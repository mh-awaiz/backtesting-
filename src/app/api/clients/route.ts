import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Project from "@/models/Project";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();
  const clients = await User.find({ role: "CLIENT" }).select("-passwordHash").sort({ createdAt: -1 }).lean();

  const withCounts = await Promise.all(
    clients.map(async (c) => {
      const projectCount = await Project.countDocuments({ client: c._id });
      return { ...c, projectCount };
    })
  );

  return NextResponse.json({ clients: withCounts });
}
