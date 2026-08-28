import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Message from "@/models/Message";
import Violation from "@/models/Violation";
import User from "@/models/User";
import { moderateMessage } from "@/lib/moderation";
import mongoose from "mongoose";

const OFFLINE_NOTICE =
  "Developers aren't available right now — they'll follow up by email shortly.";

// Chat is scoped to the CLIENT, not a project: any developer or admin can
// open and take part in a client's conversation. A client can only ever
// reach their own thread.
async function checkAccess(clientId: string, userId: string, role: string) {
  if (!mongoose.Types.ObjectId.isValid(clientId)) return false;

  if (role === "CLIENT") return clientId === userId;
  if (role === "ADMIN" || role === "DEVELOPER") {
    const client = await User.findOne({ _id: clientId, role: "CLIENT" });
    return !!client;
  }
  return false;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ clientId: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectToDatabase();
  const { clientId } = await params;
  const allowed = await checkAccess(clientId, session.user.id, session.user.role);
  if (!allowed) return NextResponse.json({ error: "Not found or no access." }, { status: 403 });

  const messages = await Message.find({ client: clientId })
    .sort({ createdAt: 1 })
    .populate("sender", "name role")
    .lean();

  return NextResponse.json({ messages });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ clientId: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectToDatabase();
  const { clientId } = await params;
  const allowed = await checkAccess(clientId, session.user.id, session.user.role);
  if (!allowed) return NextResponse.json({ error: "Not found or no access." }, { status: 403 });

  const { text, fileUrl, fileName } = await request.json();
  if ((!text || !text.trim()) && !fileUrl) {
    return NextResponse.json({ error: "Message can't be empty." }, { status: 400 });
  }

  // Only developer messages are scanned for off-platform contact info —
  // clients/admins aren't restricted. Google Meet links are specifically
  // allowed through for developers; everything else off-platform still blocks.
  if (session.user.role === "DEVELOPER" && text) {
    const result = moderateMessage(text);
    if (result.blocked) {
      await Violation.create({
        client: clientId,
        user: session.user.id,
        originalText: text,
        reason: result.reason ?? "flagged",
      });
      const user = await User.findById(session.user.id);
      if (user) {
        user.violationCount += 1;
        if (user.violationCount >= 3) user.messagingRestricted = true;
        await user.save();
      }
      return NextResponse.json(
        { error: "This message contains restricted contact information and cannot be sent." },
        { status: 422 }
      );
    }
  }

  const message = await Message.create({
    client: clientId,
    sender: session.user.id,
    senderRole: session.user.role,
    text: text || "",
    fileUrl,
    fileName,
    readBy: [session.user.id],
  });

  // If the client just sent a message and no developer is currently online,
  // drop a one-time system note in the thread so they know to expect email
  // follow-up instead of an instant reply.
  if (session.user.role === "CLIENT") {
    const anyoneAvailable = await User.exists({
      role: "DEVELOPER",
      active: true,
      available: true,
    });

    if (!anyoneAvailable) {
      // Look at the message right before the one we just saved — if it was
      // already a SYSTEM offline notice, don't pile on another one.
      const previousMessage = await Message.findOne({
        client: clientId,
        _id: { $ne: message._id },
      }).sort({ createdAt: -1 });

      if (previousMessage?.senderRole !== "SYSTEM") {
        await Message.create({
          client: clientId,
          senderRole: "SYSTEM",
          text: OFFLINE_NOTICE,
          readBy: [],
        });
      }
    }
  }

  const populated = await message.populate("sender", "name role");
  return NextResponse.json({ message: populated }, { status: 201 });
}
