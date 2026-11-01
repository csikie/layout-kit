import type { ReactElement, ReactNode } from "react";

interface BreadcrumbEntry {
  id: string;
  label: ReactNode;
  href?: string;
  /** Omit for manual items: the last item is current. Resolver results set this explicitly. */
  current?: boolean;
  pending?: boolean;
}
interface BreadcrumbContext<TData = unknown> {
  /** Decoded route parameters. Links always keep their encoded path segments. */
  params: Readonly<Record<string, string>>;
  data: TData | undefined;
  pathname: string;
  path: string;
}
interface BreadcrumbRoute<TData = unknown> {
  /** Defaults to path. Used by parentId to specify an application hierarchy. */
  id?: string;
  path: string;
  label: ReactNode | ((context: BreadcrumbContext<TData>) => ReactNode);
  /** undefined follows URL prefixes; null starts a new hierarchy. */
  parentId?: string | null;
  hidden?: boolean;
  /** Overrides the navigable URL; null renders a non-navigable ancestor. */
  href?: string | null | ((context: BreadcrumbContext<TData>) => string | null);
  loadingLabel?: ReactNode;
  fallbackLabel?: ReactNode;
}
interface UnknownBreadcrumbContext<TData = unknown> extends BreadcrumbContext<TData> {
  segment: string;
}
type UnknownBreadcrumbPolicy<TData = unknown> =
  | "format"
  | "omit"
  | "error"
  | ((context: UnknownBreadcrumbContext<TData>) => ReactNode);
interface BreadcrumbLabels {
  navigation: string;
  more: string;
  home: string;
  loading: string;
  unavailable: string;
}
interface ResolveBreadcrumbsOptions<TData = unknown> {
  pathname: string;
  routes?: readonly BreadcrumbRoute<TData>[];
  data?: TData;
  /** Applies only to function labels; static labels remain visible. No fetching occurs here. */
  loading?: boolean;
  unknown?: UnknownBreadcrumbPolicy<TData>;
  labels?: Partial<BreadcrumbLabels>;
}
type BreadcrumbLinkRenderer = (props: {
  href: string;
  children: ReactNode;
  item: BreadcrumbEntry;
}) => ReactElement;
interface BreadcrumbAppearance {
  labels?: Partial<BreadcrumbLabels>;
  className?: string;
  separator?: ReactNode;
  /** Includes the overflow trigger. Minimum 3; default 5. */
  maxVisibleItems?: number;
  /** Used below 768px; defaults to 3. */
  compactMaxVisibleItems?: number;
  renderLink?: BreadcrumbLinkRenderer;
}
type AppBreadcrumbProps<TData = unknown> = BreadcrumbAppearance &
  (
    | {
        items: readonly BreadcrumbEntry[];
        pathname?: never;
        routes?: never;
        data?: never;
        loading?: never;
        unknown?: never;
      }
    | (ResolveBreadcrumbsOptions<TData> & { items?: never })
  );

export type {
  BreadcrumbEntry,
  BreadcrumbContext,
  BreadcrumbRoute,
  UnknownBreadcrumbContext,
  UnknownBreadcrumbPolicy,
  BreadcrumbLabels,
  ResolveBreadcrumbsOptions,
  BreadcrumbLinkRenderer,
  BreadcrumbAppearance,
  AppBreadcrumbProps,
};
