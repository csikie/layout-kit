import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * True when a slot value should produce markup. `null`, `undefined`, booleans,
 * empty strings, and `0` are treated as empty, so `aside={false}` or
 * `metadata={count}` with a zero count never render a stray wrapper or a bare "0".
 */
function isRenderable(node: ReactNode): boolean {
  return node != null && typeof node !== "boolean" && node !== "" && node !== 0;
}

// ------------------------------------------------------------------
// Page
// ------------------------------------------------------------------

const pageSizeVariants = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-7xl",
  xl: "max-w-[1600px]",
  full: "max-w-none",
} as const;

type PageSize = keyof typeof pageSizeVariants;

type PageProps = useRender.ComponentProps<"div"> & {
  /** Maximum content width. */
  size?: PageSize;
  /** Responsive horizontal padding. */
  gutter?: boolean;
};

function PageRoot({ size = "lg", gutter = true, className, render, ...props }: PageProps) {
  return useRender({
    defaultTagName: "div",
    render,
    state: { slot: "page" },
    props: mergeProps<"div">(
      {
        className: cn(
          "mx-auto w-full min-w-0",
          pageSizeVariants[size],
          gutter && "px-4 sm:px-6 lg:px-8",
          "py-6 md:py-8",
          className,
        ),
      },
      props,
    ),
  });
}

// ------------------------------------------------------------------
// Page.Header
// ------------------------------------------------------------------

/**
 * Page.Header renders a div by default. A <header> outside <main> or a sectioning
 * element becomes the page's banner landmark, which usually belongs to the app
 * shell; pass `render={<header />}` when this header should be one.
 */
type PageTitleElement = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type PageHeaderProps = Omit<useRender.ComponentProps<"div">, "title"> & {
  /** Rendered as the page heading, an h1 unless `titleAs` says otherwise. */
  title: ReactNode;
  /**
   * Heading element for the title. Keep the default h1 for a real page; pick a
   * lower level when the Page is nested, for example in a preview or a dialog.
   */
  titleAs?: PageTitleElement;
  description?: ReactNode;
  /** Badges or status rendered inline after the title. */
  metadata?: ReactNode;
  /** Primary actions, usually wrapped in Page.Actions. */
  actions?: ReactNode;
};

function PageHeader({
  title,
  titleAs: Title = "h1",
  description,
  metadata,
  actions,
  className,
  children,
  render,
  ...props
}: PageHeaderProps) {
  const content = (
    <>
      <div data-slot="page-header-content" className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <Title data-slot="page-title" className="text-2xl font-semibold tracking-tight">
            {title}
          </Title>

          {isRenderable(metadata) && <div data-slot="page-metadata">{metadata}</div>}
        </div>

        {isRenderable(description) && (
          <div data-slot="page-description" className="text-muted-foreground text-sm">
            {description}
          </div>
        )}

        {children}
      </div>

      {isRenderable(actions) && (
        <div data-slot="page-header-actions" className="flex shrink-0 items-center gap-2">
          {actions}
        </div>
      )}
    </>
  );

  return useRender({
    defaultTagName: "div",
    render,
    state: { slot: "page-header" },
    props: mergeProps<"div">(
      {
        className: cn(
          "mb-6 flex min-w-0 flex-col gap-4",
          "sm:flex-row sm:items-start sm:justify-between",
          className,
        ),
        children: content,
      },
      props,
    ),
  });
}

// ------------------------------------------------------------------
// Page.Actions
// ------------------------------------------------------------------

type PageActionsProps = useRender.ComponentProps<"div">;

function PageActions({ className, render, ...props }: PageActionsProps) {
  return useRender({
    defaultTagName: "div",
    render,
    state: { slot: "page-actions" },
    props: mergeProps<"div">(
      { className: cn("flex flex-wrap items-center gap-2", className) },
      props,
    ),
  });
}

// ------------------------------------------------------------------
// Page.Body
// ------------------------------------------------------------------

type PageAsideWidth = "sm" | "md" | "lg";
type PageAsidePosition = "start" | "end";
type PageAsideBreakpoint = "md" | "lg" | "xl" | "2xl";
type PageAsideCollapse = "stack" | "hide";

// Each preset sets --page-aside-width; the grid template reads it, so a custom
// width is one style or class away: style={{ "--page-aside-width": "13rem" }}.
const asideWidthVariants = {
  sm: "[--page-aside-width:16rem]",
  md: "[--page-aside-width:20rem]",
  lg: "[--page-aside-width:24rem]",
} as const satisfies Record<PageAsideWidth, string>;

// The aside column is mirrored for "start", so the content always gets the
// flexible track. Both children are placed explicitly on row 1 from the
// breakpoint up, which keeps the DOM (and reading) order content-first
// regardless of position.
const asideTemplateVariants = {
  md: {
    end: "md:grid-cols-[minmax(0,1fr)_var(--page-aside-width)]",
    start: "md:grid-cols-[var(--page-aside-width)_minmax(0,1fr)]",
  },
  lg: {
    end: "lg:grid-cols-[minmax(0,1fr)_var(--page-aside-width)]",
    start: "lg:grid-cols-[var(--page-aside-width)_minmax(0,1fr)]",
  },
  xl: {
    end: "xl:grid-cols-[minmax(0,1fr)_var(--page-aside-width)]",
    start: "xl:grid-cols-[var(--page-aside-width)_minmax(0,1fr)]",
  },
  "2xl": {
    end: "2xl:grid-cols-[minmax(0,1fr)_var(--page-aside-width)]",
    start: "2xl:grid-cols-[var(--page-aside-width)_minmax(0,1fr)]",
  },
} as const satisfies Record<PageAsideBreakpoint, Record<PageAsidePosition, string>>;

const contentPlacementVariants = {
  md: { end: "md:col-start-1 md:row-start-1", start: "md:col-start-2 md:row-start-1" },
  lg: { end: "lg:col-start-1 lg:row-start-1", start: "lg:col-start-2 lg:row-start-1" },
  xl: { end: "xl:col-start-1 xl:row-start-1", start: "xl:col-start-2 xl:row-start-1" },
  "2xl": { end: "2xl:col-start-1 2xl:row-start-1", start: "2xl:col-start-2 2xl:row-start-1" },
} as const satisfies Record<PageAsideBreakpoint, Record<PageAsidePosition, string>>;

const asidePlacementVariants = {
  md: { end: "md:col-start-2 md:row-start-1", start: "md:col-start-1 md:row-start-1" },
  lg: { end: "lg:col-start-2 lg:row-start-1", start: "lg:col-start-1 lg:row-start-1" },
  xl: { end: "xl:col-start-2 xl:row-start-1", start: "xl:col-start-1 xl:row-start-1" },
  "2xl": { end: "2xl:col-start-2 2xl:row-start-1", start: "2xl:col-start-1 2xl:row-start-1" },
} as const satisfies Record<PageAsideBreakpoint, Record<PageAsidePosition, string>>;

// "hide" removes the aside below the breakpoint instead of stacking it.
const asideHiddenVariants = {
  md: "hidden md:block",
  lg: "hidden lg:block",
  xl: "hidden xl:block",
  "2xl": "hidden 2xl:block",
} as const satisfies Record<PageAsideBreakpoint, string>;

type PageBodyProps = useRender.ComponentProps<"div"> & {
  /** Supplementary column, placed beside the content from `asideBreakpoint` up. */
  aside?: ReactNode;
  /** Aside width: 16rem, 20rem, or 24rem. Set --page-aside-width for any other width. */
  asideWidth?: PageAsideWidth;
  /** Which side the aside sits on from `asideBreakpoint` up. */
  asidePosition?: PageAsidePosition;
  /** Breakpoint at which the aside moves beside the content. */
  asideBreakpoint?: PageAsideBreakpoint;
  /** Below the breakpoint, stack the aside under the content or hide it. */
  asideCollapse?: PageAsideCollapse;
  /** Accessible name for the aside landmark. */
  asideLabel?: string;
  /** Extra props for the aside element, for example a sticky className. */
  asideProps?: Omit<ComponentProps<"aside">, "children">;
};

function PageBody({
  aside,
  asideWidth = "md",
  asidePosition = "end",
  asideBreakpoint = "lg",
  asideCollapse = "stack",
  asideLabel = "Supplementary information",
  asideProps,
  className,
  children,
  render,
  ...props
}: PageBodyProps) {
  const hasAside = isRenderable(aside);
  const dataAttributes = { "data-aside-position": hasAside ? asidePosition : undefined };

  const content = (
    <>
      <div
        data-slot="page-content"
        className={cn(
          "min-w-0",
          hasAside && contentPlacementVariants[asideBreakpoint][asidePosition],
        )}
      >
        {children}
      </div>

      {hasAside && (
        <aside
          data-slot="page-aside"
          aria-label={asideLabel}
          {...asideProps}
          className={cn(
            "min-w-0",
            asideCollapse === "hide" && asideHiddenVariants[asideBreakpoint],
            asidePlacementVariants[asideBreakpoint][asidePosition],
            asideProps?.className,
          )}
        >
          {aside}
        </aside>
      )}
    </>
  );

  return useRender({
    defaultTagName: "div",
    render,
    state: { slot: "page-body" },
    props: mergeProps<"div">(
      {
        ...dataAttributes,
        className: cn(
          "grid min-w-0 grid-cols-1 items-start gap-6",
          hasAside && asideWidthVariants[asideWidth],
          hasAside && asideTemplateVariants[asideBreakpoint][asidePosition],
          className,
        ),
        children: content,
      },
      props,
    ),
  });
}

// ------------------------------------------------------------------
// Compound API
// ------------------------------------------------------------------

const Page = Object.assign(PageRoot, {
  Header: PageHeader,
  Actions: PageActions,
  Body: PageBody,
});

export { Page, PageRoot, PageHeader, PageActions, PageBody, isRenderable };

export type {
  PageProps,
  PageSize,
  PageHeaderProps,
  PageTitleElement,
  PageActionsProps,
  PageBodyProps,
  PageAsideWidth,
  PageAsidePosition,
  PageAsideBreakpoint,
  PageAsideCollapse,
};
