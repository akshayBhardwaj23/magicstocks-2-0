import { getChatHistory } from "@/lib/storeChats";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ChatHistory = async ({ email }: { email: string | undefined | null }) => {
  const data = await getChatHistory(email);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="min-h-[80vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
        <div className="flex flex-col gap-4 p-4">
          {data &&
            data.map((message) => (
              <>
                <div className={`flex justify-start`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 bg-muted text-foreground`}
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.userMessage}
                    </ReactMarkdown>
                    <p className="text-xs text-gray-500">
                      {message.createdAt.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className={`flex justify-end`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 bg-primary text-primary-foreground`}
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.botMessage}
                    </ReactMarkdown>
                  </div>
                </div>
              </>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;
