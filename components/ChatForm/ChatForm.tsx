import React, { useState, useEffect, KeyboardEvent, useCallback } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { IoStopCircle } from "react-icons/io5";
import LoginDialogButton from "../LoginDialogButton/LoginDialogButton";
import { useSession } from "next-auth/react";
import { getMessagesCount } from "@/lib/userData";
import Link from "next/link";

type Props = {
  handleSubmit: (e: any) => void;
  input: string;
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  handleKeyPress: (
    e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  isLoading: boolean;
  stop: () => void;
};

const ChatForm = ({
  handleSubmit,
  input,
  handleInputChange,
  handleKeyPress,
  isLoading,
  stop,
}: Props) => {
  const { data: session } = useSession(); //Gets the session object to check the logged in user
  const [messageCount, setMessageCount] = useState<number | null>(null);

  const fetchMessageCount = useCallback(async () => {
    if (session?.user) {
      try {
        const count = await getMessagesCount(session.user.email);
        setMessageCount(count);
      } catch (error) {
        console.error("Error fetching message count:", error);
      }
    }
  }, [session?.user]);

  useEffect(() => {
    fetchMessageCount();
  }, [session, fetchMessageCount]);

  let actionButton;

  if (messageCount !== null && messageCount <= 0) {
    // Display LoginDialogButton if messageCount is 0 or less
    actionButton = (
      <Button type="button">
        <Link href="/manage-credits">Send</Link>
      </Button>
    );
  } else if (isLoading) {
    // Display Stop button if loading
    actionButton = (
      <Button type="button" onClick={stop}>
        <IoStopCircle />
      </Button>
    );
  } else if (session?.user) {
    // Display Send button if user is logged in
    actionButton = <Button type="submit">Send</Button>;
  } else {
    // Display LoginDialogButton if no session
    actionButton = <LoginDialogButton />;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <Textarea
              placeholder="Ask me anything about stocks, market analysis, or investment strategies..."
              className="min-h-[60px] max-h-[120px] resize-none pr-12 rounded-2xl border-2 focus:border-primary/50 transition-colors"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              rows={1}
            />
            <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
              {input.length > 0 && `${input.length} chars`}
            </div>
          </div>
          <div className="flex-shrink-0">
            {actionButton}
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>Press Enter to send, Shift+Enter for new line</span>
            {messageCount !== null && (
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                {messageCount} credits remaining
              </span>
            )}
          </div>
          <span>MagicStocks.ai can make mistakes. Verify important information.</span>
        </div>
      </form>
    </div>
  );
};

export default ChatForm;
