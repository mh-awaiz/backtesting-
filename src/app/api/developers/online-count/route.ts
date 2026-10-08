import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

// Public, no-auth endpoint — just a count, nothing sensitive. Used by the
// floating chat widget on the marketing site so a signed-out visitor can
// see "2 developers online" before they've logged in at all.
export async function GET() {
  await connectToDatabase();
  const online = await User.countDocuments({ role: "DEVELOPER", active: true, available: true });
  return NextResponse.json({ online });
}
