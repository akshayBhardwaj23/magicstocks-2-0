import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Testimonials | MagicStocks.ai - Future of Stock Analysis",
  description:
    "User stories about using MagicStocks.ai for market learning and research support. Not performance advertising or investment advice.",
};

export default function TestimonialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

