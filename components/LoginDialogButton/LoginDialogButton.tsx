import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

const LoginDialogButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Send Message</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
          <DialogDescription>
            Sign in securely to try the AI for free!
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 items-center gap-4">
            <Button onClick={() => signIn("google")}>
              Sign in with Google
            </Button>
            <Button onClick={() => signIn("facebook")}>
              Sign in with Facebook
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Link className="text-blue-400 underline" href="/">
            Terms of use
          </Link>
          <Link className="text-blue-400 underline" href="/">
            Privacy Policy
          </Link>
          {/* <Button type="submit">Save changes</Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialogButton;
