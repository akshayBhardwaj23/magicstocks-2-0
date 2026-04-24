import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/lib/connect-mongo";
import BrokerConnection from "@/models/BrokerConnection";
import User from "@/models/User";
import { auth } from "@/auth";
import { exchangeUpstoxCode } from "@/lib/brokers/upstox";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  if (!code)
    return NextResponse.json({ message: "Missing code" }, { status: 400 });

  await connectMongo();
  try {
    const tokenData = await exchangeUpstoxCode(code);
    const user = await User.findOne({ email: session.user?.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    await BrokerConnection.findOneAndUpdate(
      { userId: user._id, broker: "upstox" },
      {
        broker: "upstox",
        userId: user._id,
        accessToken: tokenData?.access_token,
        refreshToken: tokenData?.refresh_token,
        tokenExpiresAt: tokenData?.expires_in
          ? new Date(Date.now() + tokenData.expires_in * 1000)
          : undefined,
        meta: tokenData,
      },
      { upsert: true, new: true }
    );
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/portfolio`);
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: 400 });
  }
}
