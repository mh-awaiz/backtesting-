import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import TypingStatus from "@/models/TypingStatus";
import mongoose from "mongoose";

// Typing is considered stale after this long — matches the TTL on the
// model, just enforced here too so a doc that's about to expire doesn't
// briefly still count as "typing" in a GET that races the cleanup.
const TYPING_WINDOW_MS = 4000;

async function checkAccess(clientId: string, userId: string, role: string) {
  if (!mongoose.Types.ObjectId.isValid(clientId)) return false;
  if (role === "CLIENT") return clientId === userId;
  if (role === "ADMIN" || role === "DEVELOPER") {
    const client = await User.findOne({ _id: clientId, role: "CLIENT" });
    return !!client;
  }
  return false;
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ clientId: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectToDatabase();
  const { clientId } = await params;
  const allowed = await checkAccess(clientId, session.user.id, session.user.role);
  if (!allowed) return NextResponse.json({ error: "Not found or no access." }, { status: 403 });

  await TypingStatus.findOneAndUpdate(
    { client: clientId, user: session.user.id },
    { role: session.user.role, updatedAt: new Date() },
    { upsert: true }
  );

  return NextResponse.json({ success: true });
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ clientId: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectToDatabase();
  const { clientId } = await params;
  const allowed = await checkAccess(clientId, session.user.id, session.user.role);
  if (!allowed) return NextResponse.json({ error: "Not found or no access." }, { status: 403 });

  const since = new Date(Date.now() - TYPING_WINDOW_MS);
  const typing = await TypingStatus.find({
    client: clientId,
    user: { $ne: session.user.id },
    updatedAt: { $gte: since },
  })
    .populate("user", "name")
    .lean();

  return NextResponse.json({
    typing: typing.map((t) => ({
      name: (t.user as unknown as { name: string })?.name ?? "Someone",
      role: t.role,
    })),
  });
}
