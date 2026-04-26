"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { data } from "@/constants/sidebarData";
import logo from "../public/logo.png";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const Highlight = data.highlight.icon;

  return (
    <Sidebar variant="inset" className="border-r" {...props}>
      <SidebarHeader className="border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="hover:bg-sidebar-accent group-data-[collapsible=icon]:!p-0"
            >
              <Link href="/">
                <div className="flex items-center gap-3 group-data-[collapsible=icon]:gap-0">
                  <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-brand-gradient text-primary-foreground shadow-sm overflow-hidden">
                    <Image
                      alt="Magic Stocks AI"
                      src={logo}
                      width={28}
                      height={28}
                      className="h-6 w-6 object-contain brightness-0 invert"
                      priority
                    />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-display font-semibold text-sidebar-foreground">
                      MagicStocks.ai
                    </span>
                    <span className="truncate text-xs text-sidebar-foreground/60">
                      Markets · learning · AI
                    </span>
                  </div>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-2">
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <SidebarGroup className="mt-auto group-data-[collapsible=icon]:hidden">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs leading-relaxed text-sidebar-foreground/80">
            <div className="flex items-center gap-2 text-primary">
              <Highlight className="h-3.5 w-3.5" />
              <span className="font-semibold">{data.highlight.title}</span>
            </div>
            <p className="mt-1 text-muted-foreground">
              {data.highlight.description}
            </p>
          </div>
        </SidebarGroup>
        <NavSecondary items={data.navSecondary} />
      </SidebarContent>

      <SidebarFooter className="border-t">
        <div className="px-2 py-1 text-[11px] text-sidebar-foreground/60 text-center group-data-[collapsible=icon]:hidden">
          Made in India · © {new Date().getFullYear()}
        </div>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
