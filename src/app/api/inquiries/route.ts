import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "CLIENT") {
    return NextResponse.json({ error: "Log in as a client to submit a project inquiry." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description, platformLink, requiredFeatures, budget, timeline, additionalNotes } = body;

    if (!title || !description) {
      return NextResponse.json({ error: "Project title and description are required." }, { status: 400 });
    }

    await connectToDatabase();

    const project = await Project.create({
      title,
      description,
      platformLink,
      requiredFeatures,
      budget,
      timeline,
      additionalNotes,
      client: session.user.id,
      status: "new",
    });

    return NextResponse.json({ success: true, id: project._id }, { status: 201 });
  } catch (err) {
    console.error("Inquiry creation error:", err);
    return NextResponse.json({ error: "Something went wrong saving your request." }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();
  const inquiries = await Project.find({ status: { $in: ["new", "under_review"] } })
    .sort({ createdAt: -1 })
    .populate("client", "name email company")
    .lean();

  return NextResponse.json({ inquiries });
}
