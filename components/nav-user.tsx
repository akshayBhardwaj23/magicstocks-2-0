"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import Link from "next/link";

export function NavUser() {
  const { data: session } = useSession();

  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {session?.user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={session.user.image as string | undefined}
                    alt={session?.user?.name as string | undefined}
                  />
                  <AvatarFallback className="rounded-lg">
                    {session.user.image as string | undefined}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {session?.user?.name as string | undefined}
                  </span>
                  <span className="truncate text-xs">
                    {session?.user?.email as string | undefined}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={session.user.image as string | undefined}
                      alt={session.user.name as string | undefined}
                    />
                    <AvatarFallback className="rounded-lg">
                      {session.user.image as string | undefined}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {session.user.name as string | undefined}
                    </span>
                    <span className="truncate text-xs">
                      {session.user.email as string | undefined}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Sparkles />
                  <Link href="/manage-credits">Manage Credits</Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <BadgeCheck />
                  <Link href="/profile">Account</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard />
                  <Link href="/billing-history">Billing History</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell />
                  <Link href="/notifications">Notifications</Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut />

                <Button onClick={() => signOut({ redirectTo: "/" })}>
                  Log Out
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button onClick={() => signIn()}>Sign In</Button>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
