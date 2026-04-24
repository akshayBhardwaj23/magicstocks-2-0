import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "About Us | MagicStocks.ai - Future of Stock Analysis",
  description:
    "Learn about MagicStocks.ai: AI-powered information and learning tools for Indian stock markets, not a substitute for a SEBI-registered investment adviser.",
};

const AboutPage = () => {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen px-6 py-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl">
        <Card className="border border-gray-200 dark:border-gray-700 shadow-lg">
          <CardHeader className="pb-4 text-center">
            <CardTitle className="text-4xl font-bold text-gray-800 dark:text-white">
              About Us
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 py-4 text-gray-700 dark:text-gray-300">
            <p className="mb-4 text-lg">
              Welcome to <span className="font-semibold">MagicStocks.ai</span>.
              We help people understand Indian stock markets with information and
              education—data, context, and explainers—not personalized
              investment advice. We are not SEBI-registered as an investment
              adviser or research analyst.
            </p>
            <p className="mb-4 text-lg">
              Our tools combine AI with public market data so you can study
              companies, indices, and ideas in one place. Whether you are
              experienced or new to markets, the focus is on learning and
              research workflows you control.
            </p>
            <p className="mb-4 text-lg">
              For decisions that affect your money, we encourage you to consult a
              SEBI-registered investment adviser or other qualified
              professional. MagicStocks is here to support understanding, not to
              replace that relationship.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center pt-4">
            <Button
              variant="outline"
              className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
            >
              <Link href="/contact-us">Contact Us</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
};

export default AboutPage;
