// app/api/user/route.ts (regular API route)
export const runtime = "nodejs"; // Ensure Node.js runtime

import connectMongo from "@/lib/connect-mongo";
import User from "@/models/User";

export async function POST(req: Request) {
  console.log("inside the funtion");

  try {
    await connectMongo();
    const userData = await req.json();

    let user = await User.findOne({ email: userData.email });

    if (!user) {
      user = await User.create(userData);
    }

    return Response.json({ success: true, user });
  } catch (error) {
    console.log(error);
    return Response.json({ success: false, error: "Failed to save user" });
  }
}
