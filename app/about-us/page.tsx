import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import React from "react";

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
              Welcome to <span className="font-semibold">MagicStocks.ai</span>,
              your AI-powered partner for smarter investing. We believe stock
              market insights should be accessible, accurate, and actionable,
              helping you make confident investment decisions without the
              complexity.
            </p>
            <p className="mb-4 text-lg">
              MagicStocks.ai leverages advanced AI technology to analyze the
              market, providing insights driven by technical, fundamental, and
              sentiment analysis. Whether you are a seasoned investor or just
              starting out, our smart chatbot delivers relevant stock analysis
              right at your fingertips.
            </p>
            <p className="mb-4 text-lg">
              Our mission is to empower investors by bringing together
              cutting-edge AI and reliable market data in one seamless platform.
              Say goodbye to endless research and hello to a simpler, smarter
              approach to the stock market with MagicStocks.ai.
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
