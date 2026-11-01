import type { ReactNode } from "react";
import type { AppBreadcrumbProps, BreadcrumbAppearance, BreadcrumbEntry } from "./types";

type BreadcrumbProviderProps<TData = unknown> = AppBreadcrumbProps<TData> & {
  /** Active route instance, including resource params. Must match the page hook's scope. */
  scope: string;
  children: ReactNode;
};
type ContextBreadcrumbProps = BreadcrumbAppearance;
type PageBreadcrumbsOptions = { scope: string; enabled?: boolean } & (
  | { items: readonly BreadcrumbEntry[]; routeLabels?: never }
  | { routeLabels: Readonly<Record<string, ReactNode>>; items?: never }
);

export type { BreadcrumbProviderProps, ContextBreadcrumbProps, PageBreadcrumbsOptions };
