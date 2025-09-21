import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Testimonials | MagicStocks.ai - Future of Stock Analysis",
  description:
    "See what users say about MagicStocks.ai's advanced AI stock analysis. Real stories and reviews from investors who have enhanced their strategies with AI-powered insights.",
};

export default function TestimonialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
