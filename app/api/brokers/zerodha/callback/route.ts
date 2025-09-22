import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/lib/connect-mongo";
import { exchangeZerodhaRequestToken } from "@/lib/brokers/zerodha";
import BrokerConnection from "@/models/BrokerConnection";
import User from "@/models/User";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const request_token = searchParams.get("request_token");
  if (!request_token)
    return NextResponse.json(
      { message: "Missing request_token" },
      { status: 400 }
    );

  await connectMongo();
  try {
    const tokenData = await exchangeZerodhaRequestToken(request_token);
    const user = await User.findOne({ email: session.user?.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    await BrokerConnection.findOneAndUpdate(
      { userId: user._id, broker: "zerodha" },
      {
        broker: "zerodha",
        userId: user._id,
        accountId: tokenData?.user_id,
        displayName: tokenData?.user_name,
        accessToken: tokenData?.access_token,
        meta: tokenData,
      },
      { upsert: true, new: true }
    );
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/portfolio`);
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: 400 });
  }
}
