"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { Eyebrow, eyebrowClassName } from "@/components/docs/typography";
import { Row } from "@/components/ui/row";
import { navigation } from "@/lib/navigation";
import { LogoMark } from "./logo-mark";

export function AppSidebar() {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const { setOpenMobile } = useSidebar();
  const needle = query.trim().toLowerCase();
  const groups = navigation
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.title.toLowerCase().includes(needle)),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <Sidebar collapsible="offcanvas" aria-label="Documentation navigation">
      <SidebarHeader className="gap-5 p-5">
        <Link
          href="/"
          className="flex items-center gap-[0.65rem] text-[1.6rem] leading-none font-[650] tracking-[-0.07em]"
          onClick={() => setOpenMobile(false)}
        >
          <LogoMark className="size-8" />
          <span>
            layout<span className="font-[350]">kit</span>
            <span className="text-sidebar-primary">.</span>
          </span>
        </Link>
        <Row justify="between">
          <Eyebrow>Documentation</Eyebrow>
          <Badge variant="outline">v0.0.0</Badge>
        </Row>
        <SidebarInput
          aria-label="Filter pages"
          placeholder="Filter pages…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </SidebarHeader>
      <SidebarContent className="px-3">
        {groups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className={eyebrowClassName}>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        render={<Link href={item.href} />}
                        isActive={active}
                        className="data-active:[--sidebar-accent-foreground:var(--primary-foreground)] data-active:[--sidebar-accent:var(--primary)]"
                        onClick={() => setOpenMobile(false)}
                      >
                        <span>{item.title}</span>
                        {active && (
                          <span className="ml-auto" aria-hidden="true">
                            ↗
                          </span>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        {!groups.length && (
          <p role="status" className="px-4 text-xs text-muted-foreground">
            No matching pages.
          </p>
        )}
      </SidebarContent>
      <SidebarFooter className="gap-4 p-5">
        <SidebarSeparator className="mx-0" />
        <p className="font-serif text-[1.3rem] leading-[1.3] text-muted-foreground italic">
          Less scaffolding.
          <br />
          More building.
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
