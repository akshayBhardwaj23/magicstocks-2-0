import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUpstoxAuthUrl } from "@/lib/brokers/upstox";

export async function GET() {
  const session = await auth();
  if (!session)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  try {
    const url = getUpstoxAuthUrl();
    return NextResponse.json({ url });
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: 400 });
  }
}




