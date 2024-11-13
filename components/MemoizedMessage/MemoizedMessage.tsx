import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Message = {
  message: {
    role: string;
    content: string;
  };
};

const MemoizedMessage = React.memo(({ message }: Message) => {
  return (
    <div
      className={`flex ${
        message.role === "user" ? "justify-start" : "justify-end"
      }`}
    >
      <div
        className={`max-w-[90%] rounded-lg p-3 ${
          message.role === "user"
            ? "bg-muted text-foreground"
            : "bg-primary text-primary-foreground"
        }`}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  );
});

MemoizedMessage.displayName = "MemoizedMessage";

export default MemoizedMessage;
