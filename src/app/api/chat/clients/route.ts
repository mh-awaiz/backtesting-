import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Message from "@/models/Message";

// Client list for the uniform chat system — any admin or developer can see
// every client here and open a conversation with them (see /admin/chat and
// /developer/chats).
export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "DEVELOPER")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();
  const clients = await User.find({ role: "CLIENT" })
    .select("-passwordHash")
    .sort({ createdAt: -1 })
    .lean();

  const withLastMessage = await Promise.all(
    clients.map(async (c) => {
      const last = await Message.findOne({ client: c._id }).sort({ createdAt: -1 }).lean();
      return {
        _id: c._id,
        name: c.name,
        email: c.email,
        company: c.company,
        lastMessage: last
          ? { text: last.text, createdAt: last.createdAt, senderRole: last.senderRole }
          : null,
      };
    })
  );

  // Clients with a conversation already going show up first.
  withLastMessage.sort((a, b) => {
    const at = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : 0;
    const bt = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : 0;
    return bt - at;
  });

  return NextResponse.json({ clients: withLastMessage });
}
