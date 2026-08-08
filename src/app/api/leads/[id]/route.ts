import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Lead from "@/models/Lead";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { status } = await request.json();
  const allowed = ["new", "contacted", "converted", "closed"];
  if (!allowed.includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  await connectToDatabase();
  const lead = await Lead.findByIdAndUpdate(id, { status }, { new: true });
  if (!lead) return NextResponse.json({ error: "Not found." }, { status: 404 });

  return NextResponse.json({ lead });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await connectToDatabase();
  await Lead.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
