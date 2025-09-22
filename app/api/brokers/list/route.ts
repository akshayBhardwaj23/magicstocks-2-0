import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectMongo from "@/lib/connect-mongo";
import User from "@/models/User";
import BrokerConnection from "@/models/BrokerConnection";

export async function GET() {
  const session = await auth();
  if (!session)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  await connectMongo();
  const user = await User.findOne({ email: session.user?.email });
  if (!user)
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  const conns = await BrokerConnection.find({ userId: user._id });
  const safe = conns.map((c: any) => ({
    id: c.id,
    broker: c.broker,
    accountId: c.accountId,
    displayName: c.displayName,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  }));
  return NextResponse.json({ connections: safe });
}
