import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | MagicStocks.ai - Future of Stock Analysis",
  description:
    "Get in touch with the MagicStocks.ai team for any inquiries, support, or feedback. Our dedicated team is here to help you make the most of AI-powered stock analysis and market insights.",
};

const ContactPage = () => {
  return (
    <section>
      <h1 className="text-6xl font-bold text-center m-4">Contact Us</h1>

      <p className="m-4 text-center">
        {`We'd love to hear from you! Whether you have a question, feedback, or
        simply want to connect, please don't hesitate to reach out.`}
      </p>

      <div className="flex flex-wrap justify-center">
        <Card className="w-[350px] m-4">
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
            <CardDescription className="pt-4">
              Email us at support@magicstocks.ai.
            </CardDescription>
          </CardHeader>

          <CardFooter className="flex justify-between">
            <Button>
              <Link href="mailto:support@magicstocks.ai">Click Here</Link>
            </Button>
          </CardFooter>
        </Card>
        <Card className="w-[350px] m-4">
          <CardHeader>
            <CardTitle>Operational Address</CardTitle>
            <CardDescription className="pt-4">
              #1448, TDI City, Sector - 110, 140307 - Mohali, Punjab
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </section>
  );
};

export default ContactPage;
