import { suggestedChatData } from "@/constants/constants";
import {
  BarChart3,
  GraduationCap,
  Layers,
  Newspaper,
  TrendingUp,
} from "lucide-react";
import React from "react";

type Category = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  match: (text: string) => boolean;
};

const CATEGORIES: Category[] = [
  {
    label: "Stocks & tickers",
    icon: TrendingUp,
    match: (t) => /[A-Z]+\.NS|stock|company/i.test(t),
  },
  {
    label: "Sectors",
    icon: Layers,
    match: (t) => /sector|theme|capex|nifty/i.test(t),
  },
  {
    label: "News & sentiment",
    icon: Newspaper,
    match: (t) => /news|sentiment|moving|month/i.test(t),
  },
  {
    label: "Concepts",
    icon: GraduationCap,
    match: (t) => /metric|valuation|p\/e|dividend|how do/i.test(t),
  },
];

function categorize(text: string): Category {
  for (const c of CATEGORIES) if (c.match(text)) return c;
  return { label: "Explore", icon: BarChart3, match: () => true };
}

const SuggestedText = ({
  handleSuggestedText,
}: {
  handleSuggestedText: (val: string) => void;
}) => {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="md:hidden">
        <div className="mb-3">
          <h3 className="text-sm font-semibold">Try a prompt</h3>
          <p className="text-xs text-muted-foreground">
            Tap to send. Answers are educational, never trade calls.
          </p>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {suggestedChatData.map((chat) => {
            const cat = categorize(chat);
            const Icon = cat.icon;
            return (
              <button
                onClick={() => handleSuggestedText(chat)}
                key={chat}
                className="group flex-shrink-0 w-64 p-3 bg-card border rounded-xl hover:border-primary/40 hover:shadow-sm transition-all text-left"
              >
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-muted-foreground">
                  <Icon className="h-3 w-3 text-primary" />
                  {cat.label}
                </div>
                <p className="mt-1.5 text-xs font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                  {chat}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="hidden md:block">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold">
              Get started with a question
            </h3>
            <p className="text-sm text-muted-foreground">
              Pick a prompt or write your own—answers stay educational.
            </p>
          </div>
          <span className="text-xs text-muted-foreground">
            Press{" "}
            <kbd className="rounded border bg-muted px-1.5 py-0.5 text-[10px] font-mono">
              Enter
            </kbd>{" "}
            to send
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {suggestedChatData.slice(0, 9).map((chat) => {
            const cat = categorize(chat);
            const Icon = cat.icon;
            return (
              <button
                onClick={() => handleSuggestedText(chat)}
                key={chat}
                className="group p-4 bg-card border rounded-xl hover:border-primary/40 hover:shadow-md transition-all text-left"
              >
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-muted-foreground">
                  <Icon className="h-3.5 w-3.5 text-primary" />
                  {cat.label}
                </div>
                <p className="mt-2 text-sm font-medium text-foreground line-clamp-3 group-hover:text-primary transition-colors">
                  {chat}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SuggestedText;
