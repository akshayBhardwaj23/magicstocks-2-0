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

const ContactPage = () => {
  return (
    <section className="flex flex-wrap justify-center">
      <h1 className="text-6xl font-bold text-center m-4">Contact Us</h1>
      <p className="m-4 text-center">
        We'd love to hear from you! Whether you have a question, feedback, or
        simply want to connect, please don't hesitate to reach out.
      </p>
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
    </section>
  );
};

export default ContactPage;
