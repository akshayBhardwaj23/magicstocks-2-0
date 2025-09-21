import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Bot } from "lucide-react";

type Message = {
  message: {
    role: string;
    content: string;
  };
};

const MemoizedMessage = React.memo(({ message }: Message) => {
  const isUser = message.role === "user";
  
  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
          isUser
            ? "bg-primary text-primary-foreground ml-auto"
            : "bg-muted text-foreground border"
        }`}
      >
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              ul: ({ children }) => <ul className="mb-2 last:mb-0 space-y-1">{children}</ul>,
              ol: ({ children }) => <ol className="mb-2 last:mb-0 space-y-1">{children}</ol>,
              li: ({ children }) => <li className="text-sm">{children}</li>,
              code: ({ children, className }) => (
                <code className={`text-xs px-1.5 py-0.5 rounded bg-muted-foreground/10 ${className || ''}`}>
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className="bg-muted-foreground/5 p-3 rounded-lg overflow-x-auto text-xs mb-2">
                  {children}
                </pre>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
      
      {isUser && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="bg-secondary text-secondary-foreground">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
});

MemoizedMessage.displayName = "MemoizedMessage";

export default MemoizedMessage;
