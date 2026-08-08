import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import User from "../models/User";
import Indicator from "../models/Indicator";
import Project from "../models/Project";

// Explicitly load .env.local from project root
dotenv.config({
  path: path.resolve(process.cwd(), ".env.local"),
});

async function seed() {
  const uri = process.env.MONGODB_URI;

  console.log("MongoDB URI loaded:", Boolean(uri));

  if (!uri) {
    throw new Error(
      "MONGODB_URI is not defined. Check your .env.local file."
    );
  }

  try {
    await mongoose.connect(uri);

    console.log("Connected to MongoDB.");
    console.log("Starting seed...");

    // --------------------------------------------------
    // CLEAR EXISTING DATA
    // --------------------------------------------------

    await Promise.all([
      User.deleteMany({}),
      Indicator.deleteMany({}),
      Project.deleteMany({}),
    ]);

    console.log("Existing users, indicators and projects cleared.");

    // --------------------------------------------------
    // PASSWORD
    // --------------------------------------------------

    const passwordHash = await bcrypt.hash("password123", 10);

    // --------------------------------------------------
    // USERS
    // --------------------------------------------------

    const admin = await User.create({
      name: "Admin",
      email: "admin@northbeam.dev",
      passwordHash,
      role: "ADMIN",
    });

    const developer = await User.create({
      name: "Jordan Lee",
      email: "dev@northbeam.dev",
      passwordHash,
      role: "DEVELOPER",
    });

    const client = await User.create({
      name: "Sam Client",
      email: "client@northbeam.dev",
      passwordHash,
      role: "CLIENT",
      company: "Sample Trading Co.",
    });

    console.log("Users created.");

    // --------------------------------------------------
    // INDICATORS
    // --------------------------------------------------

    await Indicator.create([
      {
        name: "Trend Filter Pro",
        slug: "trend-filter-pro",
        category: "Trend",

        shortDescription:
          "EMA-based trend filter with adaptive smoothing.",

        description:
          "A trend-following overlay that filters out chop using an adaptive EMA and a volatility-scaled band. Built for traders who want fewer, higher-conviction signals.",

        features: [
          "Adaptive EMA smoothing",
          "Built-in alert conditions",
          "Multi-timeframe confirmation",
        ],

        markets: [
          "Crypto",
          "Forex",
          "Indices",
        ],

        timeframes: [
          "15m",
          "1h",
          "4h",
          "1D",
        ],

        featured: true,
        published: true,
      },

      {
        name: "Momentum Divergence Scanner",
        slug: "momentum-divergence-scanner",
        category: "Momentum",

        shortDescription:
          "Automatic bullish/bearish divergence detection.",

        description:
          "Scans price action against RSI and MACD for divergence patterns and marks them directly on the chart, with configurable sensitivity.",

        features: [
          "Auto divergence detection",
          "RSI + MACD confluence",
          "Configurable sensitivity",
        ],

        markets: [
          "Crypto",
          "Stocks",
        ],

        timeframes: [
          "1h",
          "4h",
          "1D",
        ],

        featured: true,
        published: true,
      },

      {
        name: "Volume Profile Zones",
        slug: "volume-profile-zones",
        category: "Volume",

        shortDescription:
          "Session-based volume profile with high-volume zone shading.",

        description:
          "Builds a rolling volume profile per session and shades the high-volume nodes traders use as support/resistance zones.",

        features: [
          "Session-based profile",
          "High-volume node shading",
          "Point of control line",
        ],

        markets: [
          "Futures",
          "Crypto",
        ],

        timeframes: [
          "5m",
          "15m",
          "1h",
        ],

        featured: true,
        published: true,
      },
    ]);

    console.log("Indicators created.");

    // --------------------------------------------------
    // PROJECTS
    // --------------------------------------------------

    await Project.create([
      {
        title: "Custom RSI + EMA crossover strategy",

        description:
          "Need a strategy combining RSI oversold/overbought with a 50/200 EMA crossover filter. Should include alert conditions for webhook automation.",

        budget: "$150-250",

        timeline: "1 week",

        client: client._id,

        assignedDeveloper: developer._id,

        status: "in_progress",

        progress: 45,

        paymentAmount: 8000,

        paymentStatus: "claimed",
      },

      {
        title: "Support/resistance auto-zone indicator",

        description:
          "Looking for an indicator that automatically draws support/resistance zones based on pivot clustering.",

        budget: "$100-150",

        timeline: "flexible",

        client: client._id,

        status: "new",
      },
    ]);

    console.log("Projects created.");

    // --------------------------------------------------
    // COMPLETE
    // --------------------------------------------------

    console.log("");
    console.log("========================================");
    console.log("       SEED COMPLETED SUCCESSFULLY");
    console.log("========================================");
    console.log("");

    console.log(
      "Admin:     admin@northbeam.dev / password123"
    );

    console.log(
      "Developer: dev@northbeam.dev / password123"
    );

    console.log(
      "Client:    client@northbeam.dev / password123"
    );

    console.log("");
    console.log("========================================");

  } catch (error) {
    console.error("");
    console.error("❌ SEED FAILED");
    console.error(error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

seed().catch(() => {
  process.exit(1);
});