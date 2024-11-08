import {
  BookOpen,
  Bot,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
} from "lucide-react";

export const data = {
  navMain: [
    {
      title: "Profile",
      url: "/profile",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Chat History",
          url: "/chat-history",
        },
        {
          title: "Manage Subscription",
          url: "/manage-subscription",
        },
        {
          title: "Upgrade",
          url: "/upgrade",
        },
      ],
    },
    {
      title: "Help & FAQ",
      url: "/help-faq",
      icon: Bot,
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
      icon: Frame,
    },
    {
      name: "About Us",
      url: "/about-us",
      icon: PieChart,
    },
    {
      name: "Contact Us",
      url: "/contact-us",
      icon: Map,
    },
    {
      name: "Terms & Conditions",
      url: "/terms-conditions",
      icon: Map,
    },
    {
      name: "Privacy Policy",
      url: "/privacy-policy",
      icon: Map,
    },
  ],
};
