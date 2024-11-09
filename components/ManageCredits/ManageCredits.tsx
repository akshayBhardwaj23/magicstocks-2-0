import { getMessagesCount } from "@/lib/userData";
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

const ManageCredits = async ({
  email,
}: {
  email: string | undefined | null;
}) => {
  const count = await getMessagesCount(email);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="min-h-[80vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
        <div className="flex flex-col gap-4 p-4">
          <h1 className="text-3xl text-center font-bold m-4">Manage Credits</h1>
          <p className="text-center text-gray-400 m-4">
            Current Credits: <span className="font-bold">{count}</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-6xl mx-auto p-4 sm:p-6">
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
                <Button size="lg" className="w-full">
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
                <Button size="lg" className="w-full">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCredits;
