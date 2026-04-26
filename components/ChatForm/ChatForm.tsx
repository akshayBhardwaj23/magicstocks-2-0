import React, { useState, useEffect, KeyboardEvent, useCallback } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { IoStopCircle } from "react-icons/io5";
import { ArrowUp, Coins } from "lucide-react";
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
  const { data: session } = useSession();
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

  let actionButton: React.ReactNode;

  if (messageCount !== null && messageCount <= 0) {
    actionButton = (
      <Button asChild>
        <Link href="/manage-credits">Buy credits</Link>
      </Button>
    );
  } else if (isLoading) {
    actionButton = (
      <Button
        type="button"
        onClick={stop}
        variant="outline"
        size="icon"
        className="h-10 w-10"
        aria-label="Stop generating"
      >
        <IoStopCircle className="h-5 w-5" />
      </Button>
    );
  } else if (session?.user) {
    actionButton = (
      <Button
        type="submit"
        size="icon"
        className="h-10 w-10 bg-brand-gradient hover:opacity-90 transition shadow-md"
        aria-label="Send"
        disabled={!input.trim()}
      >
        <ArrowUp className="h-5 w-5" />
      </Button>
    );
  } else {
    actionButton = <LoginDialogButton />;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-3 md:p-4">
      <form onSubmit={handleSubmit} className="space-y-2 md:space-y-3">
        <div className="relative flex items-end gap-2">
          <div className="flex-1 relative">
            <Textarea
              placeholder="Ask about a stock, sector, or how a metric is read… (information & education only)"
              className="min-h-[52px] md:min-h-[60px] max-h-[180px] resize-none pr-14 rounded-2xl border-2 bg-background focus:border-primary/40 focus-visible:ring-primary/20 transition-colors text-sm shadow-sm"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              rows={1}
            />
            {input.length > 0 && (
              <div className="pointer-events-none absolute bottom-2 right-3 text-[10px] text-muted-foreground">
                {input.length}
              </div>
            )}
          </div>
          <div className="flex-shrink-0">{actionButton}</div>
        </div>

        <div className="hidden md:flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="rounded border bg-muted px-1 py-0.5 font-mono text-[10px]">
                Enter
              </kbd>{" "}
              to send,{" "}
              <kbd className="rounded border bg-muted px-1 py-0.5 font-mono text-[10px]">
                Shift+Enter
              </kbd>{" "}
              for new line
            </span>
            {messageCount !== null && (
              <span className="inline-flex items-center gap-1.5 rounded-full border bg-background px-2 py-0.5">
                <Coins className="h-3 w-3 text-primary" />
                <span className="font-medium text-foreground">
                  {messageCount}
                </span>
                <span>credit{messageCount === 1 ? "" : "s"}</span>
              </span>
            )}
          </div>
          <span className="text-muted-foreground">
            MagicStocks.ai can make mistakes. Verify important information.
          </span>
        </div>

        <div className="md:hidden flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
          {messageCount !== null && (
            <span className="inline-flex items-center gap-1 rounded-full border bg-background px-2 py-0.5">
              <Coins className="h-3 w-3 text-primary" />
              <span className="font-medium text-foreground">
                {messageCount}
              </span>{" "}
              credits
            </span>
          )}
        </div>
      </form>
    </div>
  );
};

export default ChatForm;
