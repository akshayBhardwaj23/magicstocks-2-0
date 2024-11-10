"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { CheckIcon } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import axios from "axios";
import { useSession } from "next-auth/react";
import { updateMessageCount } from "@/lib/userData";

const Plans = () => {
  const { data: session } = useSession();

  const handleCredits = async (planType: string) => {
    try {
      const res = await axios.post("/api/order", {
        email: session?.user?.email,
        planType,
      });

      if (res.status === 200) {
        console.log("Order created successfully:", res.data);
        const { order, createdOrderId } = await res.data;
        if (order?.id) {
          const options = {
            key: process.env.RAZORPAY_KEY_ID,
            amount: parseFloat(order.amount) * 100,
            currency: order.currency,
            name: "MagicStocks.ai",
            description: "MagicStocks.ai Credits",
            order_id: order.id,
            handler: async function (response: any) {
              const data = {
                orderCreationId: order.id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: createdOrderId,
                razorpaySignature: response.razorpay_signature,
              };

              const result = await fetch("/api/verify", {
                method: "POST",
                body: JSON.stringify(data),
                headers: { "Content-Type": "application/json" },
              });
              const res = await result.json();
              if (res.isOk) {
                alert("payment succeed");
                await updateMessageCount(session?.user?.email, planType);
              } else {
                alert(res.message);
              }
            },
            prefill: {
              name: session?.user?.name,
              email: session?.user?.email,
            },
            theme: {
              color: "#3399cc",
            },
          };
          //@ts-expect-error: it will open in new window
          const paymentObject = new window.Razorpay(options);
          paymentObject.on("payment.failed", function (response: any) {
            alert(response.error.description);
          });
          paymentObject.open();
        }
      } else {
        console.log("Unexpected status:", res.status, res.data.message);
      }
    } catch (error: any) {
      if (error.response) {
        console.log("Error response:", error.response.data.message);
      } else if (error.request) {
        console.log("No response received:", error.request);
      } else {
        console.log("Request error:", error.message);
      }
    }
  };
  return (
    <>
      <Card className="bg-background p-6 rounded-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Starter</CardTitle>
          <div className="text-4xl font-bold">₹49</div>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center gap-2">
            <CheckIcon className="w-5 h-5 text-primary" />
            <span>20 credits</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckIcon className="w-5 h-5 text-primary" />
            <span>Available for lifetime</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckIcon className="w-5 h-5 text-primary" />
            <span>Complete stock analysis features</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            size="lg"
            className="w-full"
            onClick={() => handleCredits("Starter")}
          >
            Buy Credits
          </Button>
        </CardFooter>
      </Card>
      <Card className="bg-background p-6 rounded-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Pro</CardTitle>
          <div className="text-4xl font-bold">₹599</div>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center gap-2">
            <CheckIcon className="w-5 h-5 text-primary" />
            <span>300 credits</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckIcon className="w-5 h-5 text-primary" />
            <span>Available for lifetime</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckIcon className="w-5 h-5 text-primary" />
            <span>Complete Stock Analysis</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            size="lg"
            className="w-full"
            onClick={() => handleCredits("Pro")}
          >
            Buy Credits
          </Button>
        </CardFooter>
      </Card>
      <Card className="bg-background p-6 rounded-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Enterprise</CardTitle>
          <div className="text-4xl font-bold">Custom Pricing</div>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center gap-2">
            <CheckIcon className="w-5 h-5 text-primary" />
            <span>Custom Credits</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckIcon className="w-5 h-5 text-primary" />
            <span>Available for lifetime</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckIcon className="w-5 h-5 text-primary" />
            <span>Advanced Global Stock Analysis</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button size="lg" className="w-full">
            <Link href="mailto:support@magicstocks.ai">Contact Us</Link>
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default Plans;
