import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";

type Message = {
  message: {
    role: string;
    content: string;
  };
};

const MemoizedMessage = React.memo(({ message }: Message) => {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 shrink-0 mt-0.5">
          <AvatarFallback className="bg-brand-gradient text-primary-foreground">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={`max-w-[88%] rounded-2xl px-4 py-3 shadow-sm transition-colors ${
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-md"
            : "bg-card text-foreground border rounded-tl-md"
        }`}
      >
        <div
          className={`prose prose-sm max-w-none ${
            isUser
              ? "prose-invert prose-p:text-primary-foreground"
              : "dark:prose-invert"
          }`}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => (
                <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="mb-2 last:mb-0 space-y-1">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="mb-2 last:mb-0 space-y-1">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="text-sm leading-relaxed">{children}</li>
              ),
              h1: ({ children }) => (
                <h1 className="text-base font-semibold mb-2">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-sm font-semibold mb-1.5 mt-3">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-sm font-semibold mb-1.5 mt-3">{children}</h3>
              ),
              a: (props) => (
                <a
                  {...props}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-dotted underline-offset-2"
                />
              ),
              code: ({ children, className }) => (
                <code
                  className={`text-xs px-1.5 py-0.5 rounded bg-muted-foreground/15 ${
                    className || ""
                  }`}
                >
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className="bg-muted-foreground/10 p-3 rounded-lg overflow-x-auto text-xs mb-2">
                  {children}
                </pre>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-2 border-primary/40 pl-3 italic text-muted-foreground">
                  {children}
                </blockquote>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>

      {isUser && (
        <Avatar className="h-8 w-8 shrink-0 mt-0.5">
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
