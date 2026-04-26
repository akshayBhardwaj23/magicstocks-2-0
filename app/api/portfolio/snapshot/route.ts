import { auth } from "@/auth";
import connectMongo from "@/lib/connect-mongo";
import User from "@/models/User";
import PortfolioSnapshot from "@/models/PortfolioSnapshot";
import { NextResponse } from "next/server";

/** Clear screenshot-derived holdings so broker or empty state shows again. */
export async function DELETE() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectMongo();
  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  await PortfolioSnapshot.findOneAndDelete({ userId: user._id });
  return NextResponse.json({ ok: true });
}
