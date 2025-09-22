import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getZerodhaAuthUrl } from "@/lib/brokers/zerodha";

export async function GET() {
  const session = await auth();
  if (!session)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  try {
    const url = getZerodhaAuthUrl();
    return NextResponse.json({ url });
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: 400 });
  }
}
