import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import mongoose from "mongoose";

async function getAuthorizedProject(id: string, userId: string, role: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) return { project: null, forbidden: false };

  const project = await Project.findById(id)
    .populate("client", "name email company")
    .populate("assignedDeveloper", "name email");

  if (!project) return { project: null, forbidden: false };

  if (role === "ADMIN") return { project, forbidden: false };
  if (role === "CLIENT" && project.client._id.toString() === userId) return { project, forbidden: false };
  if (
    role === "DEVELOPER" &&
    project.assignedDeveloper &&
    project.assignedDeveloper._id.toString() === userId
  ) {
    return { project, forbidden: false };
  }

  return { project: null, forbidden: true };
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectToDatabase();
  const { id } = await params;
  const { project, forbidden } = await getAuthorizedProject(id, session.user.id, session.user.role);

  if (forbidden) return NextResponse.json({ error: "You don't have access to this project." }, { status: 403 });
  if (!project) return NextResponse.json({ error: "Project not found." }, { status: 404 });

  return NextResponse.json({ project });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectToDatabase();
  const { id } = await params;
  const { project, forbidden } = await getAuthorizedProject(id, session.user.id, session.user.role);

  if (forbidden) return NextResponse.json({ error: "You don't have access to this project." }, { status: 403 });
  if (!project) return NextResponse.json({ error: "Project not found." }, { status: 404 });

  const body = await request.json();
  const { role } = session.user;

  if (role === "ADMIN") {
    const allowed = ["status", "progress", "deadline", "assignedDeveloper", "paymentAmount", "paymentStatus", "title", "description"];
    for (const key of allowed) {
      if (key in body) {
        // @ts-expect-error dynamic assign across a known allowlist of schema fields
        project[key] = body[key];
      }
    }
    if (body.assignedDeveloper && project.status === "new") {
      project.status = "assigned";
    }
  } else if (role === "DEVELOPER") {
    const devStatuses = ["in_progress", "testing", "client_review", "revision", "completed"];
    if (body.status && devStatuses.includes(body.status)) {
      project.status = body.status;
    }
    if (typeof body.progress === "number") {
      project.progress = body.progress;
    }
  } else if (role === "CLIENT") {
    if (body.paymentStatus === "claimed") {
      project.paymentStatus = "claimed";
    }
    if (body.status === "revision" || body.status === "completed") {
      project.status = body.status;
    }
  }

  await project.save();
  return NextResponse.json({ project });
}
