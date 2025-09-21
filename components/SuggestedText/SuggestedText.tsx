import { suggestedChatData } from "@/constants/constants";
import {
  MessageSquarePlus,
  TrendingUp,
  BarChart3,
  DollarSign,
} from "lucide-react";
import React from "react";

const SuggestedText = ({
  handleSuggestedText,
}: {
  handleSuggestedText: (val: string) => void;
}) => {
  const getIcon = (text: string) => {
    if (
      text.toLowerCase().includes("trend") ||
      text.toLowerCase().includes("analysis")
    ) {
      return <TrendingUp className="h-4 w-4" />;
    } else if (
      text.toLowerCase().includes("chart") ||
      text.toLowerCase().includes("graph")
    ) {
      return <BarChart3 className="h-4 w-4" />;
    } else if (
      text.toLowerCase().includes("price") ||
      text.toLowerCase().includes("investment")
    ) {
      return <DollarSign className="h-4 w-4" />;
    }
    return <MessageSquarePlus className="h-4 w-4" />;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {/* Mobile: Horizontal scrollable suggestions */}
      <div className="md:hidden">
        <div className="text-center mb-4">
          <h3 className="text-base font-semibold text-foreground mb-1">
            Get started
          </h3>
          <p className="text-xs text-muted-foreground">
            Tap any suggestion to begin
          </p>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {suggestedChatData.map((chat, index) => (
            <button
              onClick={() => handleSuggestedText(chat)}
              key={chat}
              className="group flex-shrink-0 w-64 p-3 bg-card border border-border rounded-lg hover:border-primary/50 hover:shadow-md transition-all duration-200 text-left"
            >
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 p-1.5 bg-primary/10 rounded-md group-hover:bg-primary/20 transition-colors">
                  {getIcon(chat)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {chat}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="text-center mt-3">
          <p className="text-xs text-muted-foreground">
            💡 Be specific for better responses
          </p>
        </div>
      </div>

      {/* Desktop: Grid layout */}
      <div className="hidden md:block">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Get started with these questions
          </h3>
          <p className="text-sm text-muted-foreground">
            Click any suggestion to begin your conversation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suggestedChatData.map((chat, index) => (
            <button
              onClick={() => handleSuggestedText(chat)}
              key={chat}
              className="group p-4 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-md transition-all duration-200 text-left"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  {getIcon(chat)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-3">
                    {chat}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            💡 Pro tip: Be specific in your questions for better AI responses
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuggestedText;
