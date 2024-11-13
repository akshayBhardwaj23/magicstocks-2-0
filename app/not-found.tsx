import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "404 | MagicStocks.ai - Future of Stock Analysis",
  description:
    "You seem lost, but still you have the right idea. MagicStocks.ai is the best ai tool in the market that gives highly accurate stock analysis in real time.",
};

const NotFoundPage = () => {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="min-h-[80vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
        <div className="flex flex-col gap-4 p-4">
          <h1 className="text-center text-9xl font-semibold m-4 p-4">404</h1>
          <h2 className="text-center text-4xl m-4 p-4">Page Not Found</h2>
          <p className="text-center m-4 p-4">
            The page you are looking for does not exist.
          </p>
          <Button type="button">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
