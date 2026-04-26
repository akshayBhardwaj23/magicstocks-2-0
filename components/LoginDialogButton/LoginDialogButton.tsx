"use client";
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
import { ArrowUp, Sparkles } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

const LoginDialogButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="h-10 w-10 bg-brand-gradient hover:opacity-90 transition shadow-md"
          aria-label="Sign in to send"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <div className="mx-auto h-12 w-12 rounded-2xl bg-brand-gradient grid place-items-center shadow-md mb-2">
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </div>
          <DialogTitle className="text-center font-display text-2xl">
            Welcome to MagicStocks
          </DialogTitle>
          <DialogDescription className="text-center">
            Sign in securely to start exploring markets with AI. Information &
            education only — not investment advice.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <Button
            variant="outline"
            className="h-11 justify-center gap-3"
            onClick={() => signIn("google")}
          >
            <FcGoogle className="h-5 w-5" />
            Continue with Google
          </Button>
        </div>
        <DialogFooter className="flex-col sm:flex-row sm:justify-center gap-1 text-xs text-muted-foreground">
          <span>By continuing you agree to our</span>
          <Link
            className="text-primary hover:underline"
            href="/terms-conditions"
          >
            Terms
          </Link>
          <span>·</span>
          <Link className="text-primary hover:underline" href="/privacy-policy">
            Privacy
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialogButton;
