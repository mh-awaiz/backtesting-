import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import mongoose from "mongoose";

const ALLOWED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".pdf", ".zip", ".txt", ".csv", ".pine"];
const MAX_SIZE = 15 * 1024 * 1024; // 15MB

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const projectId = formData.get("projectId") as string | null;

  if (!file || !projectId) {
    return NextResponse.json({ error: "File and projectId are required." }, { status: 400 });
  }
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return NextResponse.json({ error: "Invalid project." }, { status: 400 });
  }

  await connectToDatabase();
  const project = await Project.findById(projectId);
  if (!project) return NextResponse.json({ error: "Project not found." }, { status: 404 });

  const { role, id: userId } = session.user;
  const authorized =
    role === "ADMIN" ||
    (role === "CLIENT" && project.client.toString() === userId) ||
    (role === "DEVELOPER" && project.assignedDeveloper?.toString() === userId);

  if (!authorized) return NextResponse.json({ error: "No access to this project." }, { status: 403 });

  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return NextResponse.json({ error: `File type ${ext} is not allowed.` }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File is larger than the 15MB limit." }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const dir = path.join(process.cwd(), "public", "uploads", projectId);
  await mkdir(dir, { recursive: true });

  const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
  await writeFile(path.join(dir, safeName), bytes);

  const url = `/uploads/${projectId}/${safeName}`;
  return NextResponse.json({ url, fileName: file.name });
}
