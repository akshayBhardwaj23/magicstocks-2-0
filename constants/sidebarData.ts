import {
  BookOpen,
  CircleHelp,
  CreditCard,
  GlobeLock,
  Info,
  LifeBuoy,
  Mailbox,
  MessageSquareText,
  PieChart,
  ReceiptText,
  Send,
  Sparkles,
  UserRound,
} from "lucide-react";

export const data = {
  navMain: [
    {
      title: "AI Chat",
      url: "/",
      icon: MessageSquareText,
    },
    {
      title: "Portfolio",
      url: "/portfolio",
      icon: PieChart,
    },
    {
      title: "Account",
      url: "/profile",
      icon: UserRound,
      isActive: true,
      items: [
        { title: "Personal", url: "/profile" },
        { title: "Chat history", url: "/chat-history" },
        { title: "Manage credits", url: "/manage-credits" },
        { title: "Billing history", url: "/billing-history" },
      ],
    },
    {
      title: "Help & FAQ",
      url: "/help-faq",
      icon: CircleHelp,
    },
    {
      title: "Testimonials",
      url: "/testimonial",
      icon: BookOpen,
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "mailto:support@magicstocks.ai",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "/contact-us",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Pricing",
      url: "/plans-billing",
      icon: CreditCard,
    },
    {
      name: "About us",
      url: "/about-us",
      icon: Info,
    },
    {
      name: "Contact us",
      url: "/contact-us",
      icon: Mailbox,
    },
    {
      name: "Terms & conditions",
      url: "/terms-conditions",
      icon: ReceiptText,
    },
    {
      name: "Privacy policy",
      url: "/privacy-policy",
      icon: GlobeLock,
    },
  ],
  highlight: {
    title: "Education-only",
    description:
      "Information for learning—not SEBI-regulated investment advice.",
    icon: Sparkles,
  },
};
