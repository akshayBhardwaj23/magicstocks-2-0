import HomePage from "@/components/HomePage/HomePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MagicStocks.ai - Future of Stock Analysis",
  description:
    "MagicStocks.ai is an AI based stock analysis model that can be used by anyone to gather information regarding particular stock and to prepare strategies. AI model gives prediction, analysis and empowers the common public to make smart decisions.",
};

export default function Home() {
  return <HomePage />;
}
