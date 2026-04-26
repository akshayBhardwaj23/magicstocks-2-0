import { auth } from "@/auth";
import connectMongo from "@/lib/connect-mongo";
import { computePortfolioInsights } from "@/lib/insights/portfolio";
import { parseHoldingsFromScreenshots } from "@/lib/portfolio/parseScreenshots";
import { diffHoldings, summarizeDiff } from "@/lib/portfolio/diff";
import User from "@/models/User";
import PortfolioSnapshot from "@/models/PortfolioSnapshot";
import PortfolioSnapshotHistory from "@/models/PortfolioSnapshotHistory";
import { NextRequest, NextResponse } from "next/server";
import type { NormalizedHolding } from "@/lib/brokers";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_FILES = 6;
const MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);

function totals(holdings: NormalizedHolding[]) {
  let invested = 0;
  let current = 0;
  for (const h of holdings) {
    const qty = h.quantity || 0;
    invested += (h.avgPrice || 0) * qty;
    current += (h.lastPrice ?? h.avgPrice ?? 0) * qty;
  }
  return { invested, current };
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectMongo();
  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ message: "Invalid form data" }, { status: 400 });
  }

  const files = form.getAll("files").filter((x): x is File => x instanceof File);
  if (files.length === 0) {
    return NextResponse.json(
      { message: "Add at least one image (files field)" },
      { status: 400 }
    );
  }
  if (files.length > MAX_FILES) {
    return NextResponse.json(
      { message: `At most ${MAX_FILES} images per request` },
      { status: 400 }
    );
  }

  const images: { base64: string; mimeType: string }[] = [];
  for (const file of files) {
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { message: `File too large (max ${MAX_BYTES / 1024 / 1024}MB each)` },
        { status: 400 }
      );
    }
    const mimeType = file.type || "image/png";
    if (!ALLOWED.has(mimeType)) {
      return NextResponse.json(
        { message: `Unsupported type: ${mimeType}` },
        { status: 400 }
      );
    }
    const buf = Buffer.from(await file.arrayBuffer());
    images.push({ base64: buf.toString("base64"), mimeType });
  }

  try {
    const { holdings, notes } = await parseHoldingsFromScreenshots(images);
    if (!holdings.length) {
      return NextResponse.json(
        {
          message:
            "No holdings could be extracted. Try clearer screenshots with visible rows.",
        },
        { status: 422 }
      );
    }

    const previous = await PortfolioSnapshot.findOne({ userId: user._id });
    const prevHoldings = (previous?.holdings as NormalizedHolding[]) || [];
    const diff = diffHoldings(prevHoldings, holdings);

    const updated = await PortfolioSnapshot.findOneAndUpdate(
      { userId: user._id },
      { $set: { holdings, source: "screenshot" } },
      { upsert: true, new: true }
    );

    const { invested, current } = totals(holdings);
    await PortfolioSnapshotHistory.create({
      userId: user._id,
      takenAt: new Date(),
      source: "screenshot",
      holdings,
      totalInvested: invested,
      totalCurrent: current,
      rowCount: holdings.length,
    });

    const insights = computePortfolioInsights(holdings);
    return NextResponse.json({
      ok: true,
      count: holdings.length,
      parseNotes: notes,
      holdings,
      insights,
      diff,
      diffSummary: summarizeDiff(diff),
      hasPrevious: prevHoldings.length > 0,
      lastUpdated: updated?.updatedAt || new Date(),
    });
  } catch (e: any) {
    console.error("[portfolio/upload]", e);
    const msg =
      e?.message?.includes("OPENAI_API_KEY")
        ? "Server missing OPENAI_API_KEY. Add it to use screenshot parsing."
        : e?.message || "Failed to parse screenshots";
    return NextResponse.json({ message: msg }, { status: 502 });
  }
}
