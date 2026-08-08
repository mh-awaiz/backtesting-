import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Indicator from "@/models/Indicator";

export async function GET() {
  await connectToDatabase();
  const indicators = await Indicator.find({ published: true }).sort({ featured: -1, createdAt: -1 }).lean();
  return NextResponse.json({ indicators });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, slug, category, shortDescription, description, features, markets, timeframes, thumbnail, featured } = body;

  if (!name || !slug || !category || !shortDescription || !description) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  await connectToDatabase();

  const existing = await Indicator.findOne({ slug });
  if (existing) {
    return NextResponse.json({ error: "An indicator with this slug already exists." }, { status: 409 });
  }

  const indicator = await Indicator.create({
    name,
    slug,
    category,
    shortDescription,
    description,
    features: features || [],
    markets: markets || [],
    timeframes: timeframes || [],
    thumbnail,
    featured: !!featured,
  });

  return NextResponse.json({ indicator }, { status: 201 });
}
