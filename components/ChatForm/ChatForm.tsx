import React, { KeyboardEvent } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { IoStopCircle } from "react-icons/io5";
import LoginDialogButton from "../LoginDialogButton/LoginDialogButton";
import { useSession } from "next-auth/react";

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
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex w-full gap-2 items-center m-2">
          <Textarea
            placeholder="Type your message !!"
            className="flex-1"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
          />
          {isLoading ? (
            <Button type="button" onClick={() => stop()}>
              <IoStopCircle />
            </Button>
          ) : session?.user ? (
            <Button type="submit">Send message</Button>
          ) : (
            <LoginDialogButton />
          )}
        </div>
      </form>
      <p className="text-sm text-center text-muted-foreground">
        MagicStocks.ai can make mistakes. Consider checking important
        information and contact us!
      </p>
    </>
  );
};

export default ChatForm;
