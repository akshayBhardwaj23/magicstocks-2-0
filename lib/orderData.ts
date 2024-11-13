import User from "@/models/User";
import connectMongo from "./connect-mongo";
import Order from "@/models/Order";

export const getOrderData = async (email: string | undefined | null) => {
  await connectMongo();
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    const orders = await Order.find({ userId: user._id })
      .sort({
        createdAt: -1,
      })
      .select("-status -userId -updatedAt -_id")
      .lean(); // ensures plain JavaScript objects

    // Ensure each order is a plain object and convert _id to string

    if (orders.length === 0) {
      return [];
    }

    const formattedOrder = orders.map((order) => ({
      ...order,
      id: order.orderId,
      createdAt: order.createdAt.toString(),
    }));
    console.log(formattedOrder);

    return formattedOrder;
  } catch (err) {
    console.error("Error in getting order data:", err);
    return [];
  }
};
