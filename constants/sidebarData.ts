import {
  BookOpen,
  Bot,
  CircleHelp,
  CreditCard,
  Frame,
  GlobeLock,
  LifeBuoy,
  Mailbox,
  ReceiptText,
  Send,
  Settings2,
  SquareTerminal,
} from "lucide-react";

export const data = {
  navMain: [
    {
      title: "Bot",
      url: "/",
      icon: Bot,
    },
    {
      title: "Profile",
      url: "/",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Personal",
          url: "/profile",
        },
        {
          title: "Chat History",
          url: "/chat-history",
        },
        {
          title: "Manage Credits",
          url: "/manage-credits",
        },
        {
          title: "Billing History",
          url: "/billing-history",
        },
      ],
    },
    {
      title: "Portfolio",
      url: "/portfolio",
      icon: SquareTerminal,
    },
    {
      title: "Help & FAQ",
      url: "/help-faq",
      icon: CircleHelp,
    },
    {
      title: "Testimonial",
      url: "/testimonial",
      icon: BookOpen,
    },
    {
      title: "Theme",
      url: "#",
      icon: Settings2,
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
      name: "About Us",
      url: "/about-us",
      icon: Frame,
    },
    {
      name: "Contact Us",
      url: "/contact-us",
      icon: Mailbox,
    },
    {
      name: "Terms & Conditions",
      url: "/terms-conditions",
      icon: ReceiptText,
    },
    {
      name: "Privacy Policy",
      url: "/privacy-policy",
      icon: GlobeLock,
    },
  ],
};
