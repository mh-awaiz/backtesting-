import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Lead from "@/models/Lead";

export async function POST(request: NextRequest) {
  try {
    const { name, email, message, source } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and a short message are required." },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const lead = await Lead.create({
      name,
      email,
      message,
      source: source || "homepage",
    });

    return NextResponse.json({ success: true, id: lead._id }, { status: 201 });
  } catch (err) {
    console.error("Failed to save lead:", err);
    return NextResponse.json(
      { error: "Something went wrong saving your request. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();
  const leads = await Lead.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ leads });
}
