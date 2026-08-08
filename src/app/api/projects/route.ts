import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();

  const { role, id } = session.user;
  let filter = {};
  if (role === "CLIENT") filter = { client: id };
  else if (role === "DEVELOPER") filter = { assignedDeveloper: id };
  // ADMIN sees everything

  const projects = await Project.find(filter)
    .sort({ updatedAt: -1 })
    .populate("client", "name email company")
    .populate("assignedDeveloper", "name email")
    .lean();

  return NextResponse.json({ projects });
}
