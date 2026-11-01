"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { assertBreadcrumbHref } from "./path";
import { defaultBreadcrumbLabels, resolveBreadcrumbs } from "./resolve";
import type { AppBreadcrumbProps, BreadcrumbEntry, BreadcrumbLinkRenderer } from "./types";

function limitItems(limit: number): void {
  if (!Number.isInteger(limit) || limit < 3)
    throw new Error("Breadcrumb visible-item limits must be integers of at least 3.");
}
function validateItems(items: readonly BreadcrumbEntry[]): void {
  const ids = new Set<string>();
  for (const [index, item] of items.entries()) {
    if (!item.id || ids.has(item.id))
      throw new Error(`Duplicate or empty breadcrumb item ID: ${item.id}`);
    ids.add(item.id);
    if (item.href !== undefined) assertBreadcrumbHref(item.href);
    if (item.current && index !== items.length - 1)
      throw new Error("The current breadcrumb must be the last item.");
  }
}
function ItemLabel({ item }: { item: BreadcrumbEntry }) {
  return (
    <span
      className="block truncate"
      title={typeof item.label === "string" ? item.label : undefined}
    >
      {item.label}
    </span>
  );
}
function Overflow({
  items,
  label,
  renderLink,
}: {
  items: readonly BreadcrumbEntry[];
  label: string;
  renderLink?: BreadcrumbLinkRenderer;
}) {
  return (
    <BreadcrumbItem>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label={label} />}>
          <BreadcrumbEllipsis />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="max-w-[min(20rem,calc(100vw-2rem))]">
          <DropdownMenuGroup>
            {items.map((item) => (
              <DropdownMenuItem
                key={item.id}
                disabled={!item.href || item.pending}
                render={
                  item.href && !item.pending
                    ? (renderLink?.({
                        href: item.href,
                        children: <ItemLabel item={item} />,
                        item,
                      }) ?? <a href={item.href} />)
                    : undefined
                }
              >
                <ItemLabel item={item} />
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </BreadcrumbItem>
  );
}

/** A router-neutral breadcrumb: provide manual items or pathname + route metadata. */
function AppBreadcrumb<TData = unknown>(props: AppBreadcrumbProps<TData>) {
  const mobile = useIsMobile();
  const labels = { ...defaultBreadcrumbLabels, ...props.labels };
  const max = props.maxVisibleItems ?? 5;
  const compact = props.compactMaxVisibleItems ?? 3;
  limitItems(max);
  limitItems(compact);
  const items = props.items ?? resolveBreadcrumbs(props);
  validateItems(items);
  if (!items.length) return null;
  const limit = mobile ? Math.min(max, compact) : max;
  const collapse = items.length > limit;
  const tailStart = items.length - (limit - 2);
  const hidden = collapse ? items.slice(1, tailStart) : [];
  const visible = collapse ? [items[0]!, ...items.slice(tailStart)] : [...items];
  const parts: ReactNode[] = [];
  for (const [index, item] of visible.entries()) {
    if (index > 0)
      parts.push(
        <BreadcrumbSeparator key={`separator:${item.id}`}>{props.separator}</BreadcrumbSeparator>,
      );
    if (index === 1 && collapse) {
      parts.push(
        <Overflow
          key="overflow"
          items={hidden}
          label={labels.more}
          renderLink={props.renderLink}
        />,
      );
      parts.push(
        <BreadcrumbSeparator key="overflowSeparator">{props.separator}</BreadcrumbSeparator>,
      );
    }
    const current = item.current ?? item.id === items.at(-1)?.id;
    const child = <ItemLabel item={item} />;
    parts.push(
      <BreadcrumbItem key={`entry:${item.id}`} className="min-w-0 max-w-full">
        {current ? (
          <BreadcrumbPage className="min-w-0 max-w-48">{child}</BreadcrumbPage>
        ) : item.href && !item.pending ? (
          <BreadcrumbLink
            className="min-w-0 max-w-48"
            href={item.href}
            render={props.renderLink?.({ href: item.href, children: child, item })}
          >
            {child}
          </BreadcrumbLink>
        ) : (
          <span className="min-w-0 max-w-48" aria-disabled="true">
            {child}
          </span>
        )}
      </BreadcrumbItem>,
    );
  }
  return (
    <Breadcrumb
      aria-label={labels.navigation}
      aria-busy={items.some((item) => item.pending) || undefined}
      className={cn("min-w-0", props.className)}
    >
      <BreadcrumbList className="min-w-0">{parts}</BreadcrumbList>
    </Breadcrumb>
  );
}

export { AppBreadcrumb };
