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
  title: "Plans and Billing | MagicStocks.ai - Future of Stock Analysis",
  description:
    "Explore MagicStocks.ai's flexible plans and billing options. Select the best plan for your AI-powered stock analysis needs, with transparent pricing and easy upgrades",
};

const PlansPage = () => {
  return (
    <div>
      <h1 className="text-6xl font-bold text-center m-4">Plans</h1>

      <p className="m-4 p-4 text-center">
        {`Choose a plan that fits your needs—pay only for what you use! With
        MagicStocks AI, there are no subscriptions or expiration dates. Just
        purchase credits, and you're ready to dive into powerful insights
        whenever you need them.`}{" "}
        <b>(1 credit = 1 message)</b>
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 max-w-6xl mx-auto p-4 sm:p-6">
        <Card className="bg-background p-6 rounded-lg shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Free</CardTitle>
            <div className="text-4xl font-bold">$0</div>
            {/* <div className="text-muted-foreground text-sm">/month</div> */}
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center gap-2">
              <CheckIcon className="w-5 h-5 text-primary" />
              <span>2 credits</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon className="w-5 h-5 text-primary" />
              <span>Try for free</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon className="w-5 h-5 text-primary" />
              <span>Advanced stock analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon className="w-5 h-5 text-primary" />
              <span>Available only once</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button size="lg" className="w-full">
              <Link href="/">Get Started</Link>
            </Button>
          </CardFooter>
        </Card>
        <Card className="bg-background p-6 rounded-lg shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Starter</CardTitle>
            <div className="text-4xl font-bold">$1</div>
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
            <Button size="lg" className="w-full">
              <Link href="/manage-credits">Get Started</Link>
            </Button>
          </CardFooter>
        </Card>
        <Card className="bg-background p-6 rounded-lg shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Pro</CardTitle>
            <div className="text-4xl font-bold">$10</div>
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
            <Button size="lg" className="w-full">
              <Link href="/manage-credits">Get Started</Link>
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
      </div>
    </div>
  );
};

function CheckIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export default PlansPage;
