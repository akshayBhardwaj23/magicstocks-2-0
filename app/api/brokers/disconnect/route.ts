import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectMongo from "@/lib/connect-mongo";
import User from "@/models/User";
import BrokerConnection from "@/models/BrokerConnection";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { broker } = await req.json();
  if (!broker)
    return NextResponse.json({ message: "Missing broker" }, { status: 400 });

  await connectMongo();
  const user = await User.findOne({ email: session.user?.email });
  if (!user)
    return NextResponse.json({ message: "User not found" }, { status: 404 });

  await BrokerConnection.deleteOne({ userId: user._id, broker });
  return NextResponse.json({ ok: true });
}
