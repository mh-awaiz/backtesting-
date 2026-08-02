import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Lead from "@/models/Lead";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, platform, pkg, details } = body;

    if (!name || !email || !details) {
      return NextResponse.json(
        { error: "Name, email, and strategy details are required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const lead = await Lead.create({
      name,
      email,
      platform: platform || "TradingView",
      package: pkg || "Not sure yet",
      details,
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

export async function GET(request: NextRequest) {
  try {
    const key = request.nextUrl.searchParams.get("key");
    if (key !== process.env.ADMIN_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const leads = await Lead.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ leads });
  } catch (err) {
    console.error("Failed to fetch leads:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
