import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Indicator from "@/models/Indicator";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();
  const { id } = await params;
  const body = await request.json();

  const indicator = await Indicator.findByIdAndUpdate(id, body, { new: true });
  if (!indicator) return NextResponse.json({ error: "Not found." }, { status: 404 });

  return NextResponse.json({ indicator });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();
  const { id } = await params;
  await Indicator.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
