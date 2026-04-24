import HomePage from "@/components/HomePage/HomePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MagicStocks.ai - Future of Stock Analysis",
  description:
    "MagicStocks.ai offers AI-assisted market information and education for Indian equities—facts, data, and learning-oriented commentary. It does not provide SEBI-regulated investment advice or personalized buy/sell recommendations.",
};

export default function Home() {
  return <HomePage />;
}
