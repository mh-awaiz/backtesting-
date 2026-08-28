import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Project, { ProjectStatus } from "@/models/Project";
import User from "@/models/User";

const ACTIVE_STATUSES: ProjectStatus[] = ["assigned", "in_progress", "testing", "client_review", "revision"];

// Picks the currently-online developer with the fewest active projects.
// Returns null if no developer is online — the project just stays
// unassigned (status "new") until an admin steps in or someone comes online.
async function pickAvailableDeveloper() {
  const availableDevs = await User.find({ role: "DEVELOPER", active: true, available: true }).lean();
  if (availableDevs.length === 0) return null;

  const withLoad = await Promise.all(
    availableDevs.map(async (dev) => ({
      dev,
      load: await Project.countDocuments({ assignedDeveloper: dev._id, status: { $in: ACTIVE_STATUSES } }),
    }))
  );

  withLoad.sort((a, b) => a.load - b.load);
  return withLoad[0].dev;
}

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

    const developer = await pickAvailableDeveloper();

    const project = await Project.create({
      title,
      description,
      platformLink,
      requiredFeatures,
      budget,
      timeline,
      additionalNotes,
      client: session.user.id,
      status: developer ? "assigned" : "new",
      assignedDeveloper: developer?._id,
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
