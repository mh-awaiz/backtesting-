import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

// Called by PresenceHeartbeat every ~45s while a user has a dashboard page
// or the chat widget open. Refreshes lastSeenAt (powers "online"/"last
// seen"), records the browser's IANA timezone, and — best-effort — city
// and country from Vercel's geo headers, which are only present when the
// app is actually deployed on Vercel (no-op locally, by design).
export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const timezone = typeof body?.timezone === "string" ? body.timezone.slice(0, 100) : undefined;

  const city = request.headers.get("x-vercel-ip-city");
  const country = request.headers.get("x-vercel-ip-country");

  await connectToDatabase();

  const update: Record<string, unknown> = { lastSeenAt: new Date() };
  if (timezone) update.timezone = timezone;
  if (city) update.locationCity = decodeURIComponent(city);
  if (country) update.locationCountry = country;

  await User.findByIdAndUpdate(session.user.id, update);

  return NextResponse.json({ success: true });
}
