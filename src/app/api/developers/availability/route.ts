import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

// Self-service toggle — a developer flips their own availability. This
// drives auto-assignment on new inquiries and the "developers are offline"
// notice shown to clients.
export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "DEVELOPER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { available } = await request.json();
  if (typeof available !== "boolean") {
    return NextResponse.json({ error: "available must be true or false." }, { status: 400 });
  }

  await connectToDatabase();
  const user = await User.findByIdAndUpdate(session.user.id, { available }, { new: true });
  if (!user) return NextResponse.json({ error: "Not found." }, { status: 404 });

  return NextResponse.json({ available: user.available });
}
