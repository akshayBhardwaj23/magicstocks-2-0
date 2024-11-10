import Razorpay from "razorpay";
import { NextRequest, NextResponse } from "next/server";
import Order from "@/models/Order";
import connectMongo from "@/lib/connect-mongo";
import User from "@/models/User";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    await connectMongo();

    const { email, planType } = (await request.json()) as {
      planType: string;
      email: string;
    };

    if (planType !== "Starter" && planType !== "Pro") {
      return NextResponse.json(
        { message: "Invalid plan type", error: "Invalid plan type" },
        { status: 400 }
      );
    }

    let amount = 0;
    if (planType === "Starter") amount = 49;
    else if (planType === "Pro") amount = 599;

    const options = {
      amount: amount * 100,
      currency: "INR",
      payment_capture: 1,
      receipt: "rcp1",
    };

    const order = await razorpay.orders.create(options);
    if (!order) {
      throw new Error("error creating order");
    }
    console.log(order);

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    const createdOrder = await Order.create({
      userId: user._id,
      status: "pending",
      plan: planType,
      amount: amount,
    });

    if (!createdOrder) {
      return NextResponse.json(
        { message: "Order not created" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { order: order, createdOrderId: createdOrder._id },
      { status: 200 }
    );
  } catch (err: any) {
    console.log(err.message);
    return NextResponse.json(
      { message: "Error creating order", error: err.message },
      { status: 400 }
    );
  }
}
