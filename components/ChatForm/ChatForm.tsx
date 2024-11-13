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
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-2 items-center m-2">
          <Textarea
            placeholder="Type your message !!"
            className="flex-1"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
          />
          {actionButton}
        </div>
      </form>
      {/* <p className="text-sm text-center text-muted-foreground">
        MagicStocks.ai can make mistakes. Consider checking important
        information and contact us!
      </p> */}
    </>
  );
};

export default ChatForm;
