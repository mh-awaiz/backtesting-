import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import Message from "@/models/Message";
import Violation from "@/models/Violation";
import User from "@/models/User";
import { moderateMessage } from "@/lib/moderation";
import mongoose from "mongoose";

async function checkAccess(id: string, userId: string, role: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  const project = await Project.findById(id);
  if (!project) return null;

  if (role === "ADMIN") return project;
  if (role === "CLIENT" && project.client.toString() === userId) return project;
  if (role === "DEVELOPER" && project.assignedDeveloper?.toString() === userId) return project;
  return null;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectToDatabase();
  const { id } = await params;
  const project = await checkAccess(id, session.user.id, session.user.role);
  if (!project) return NextResponse.json({ error: "Not found or no access." }, { status: 403 });

  const messages = await Message.find({ project: id }).sort({ createdAt: 1 }).populate("sender", "name role").lean();
  return NextResponse.json({ messages });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectToDatabase();
  const { id } = await params;
  const project = await checkAccess(id, session.user.id, session.user.role);
  if (!project) return NextResponse.json({ error: "Not found or no access." }, { status: 403 });

  const { text, fileUrl, fileName } = await request.json();
  if ((!text || !text.trim()) && !fileUrl) {
    return NextResponse.json({ error: "Message can't be empty." }, { status: 400 });
  }

  // Only developer messages are scanned for off-platform contact info —
  // clients/admins aren't restricted from sharing their own details.
  if (session.user.role === "DEVELOPER" && text) {
    const result = moderateMessage(text);
    if (result.blocked) {
      await Violation.create({
        project: id,
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
    project: id,
    sender: session.user.id,
    senderRole: session.user.role,
    text: text || "",
    fileUrl,
    fileName,
    readBy: [session.user.id],
  });

  const populated = await message.populate("sender", "name role");
  return NextResponse.json({ message: populated }, { status: 201 });
}
