import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import type { ReactNode } from "react";
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
type PageHeaderProps = Omit<useRender.ComponentProps<"div">, "title"> & {
  /** Rendered as the page h1. */
  title: ReactNode;
  description?: ReactNode;
  /** Badges or status rendered inline after the title. */
  metadata?: ReactNode;
  /** Primary actions, usually wrapped in Page.Actions. */
  actions?: ReactNode;
};

function PageHeader({
  title,
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
          <h1 data-slot="page-title" className="text-2xl font-semibold tracking-tight">
            {title}
          </h1>

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

// The aside column is mirrored for "start", so the content always gets the
// flexible track. Both children are placed explicitly on row 1 at lg, which
// keeps the DOM (and reading) order content-first regardless of position.
const asideTemplateVariants = {
  end: {
    sm: "lg:grid-cols-[minmax(0,1fr)_16rem]",
    md: "lg:grid-cols-[minmax(0,1fr)_20rem]",
    lg: "lg:grid-cols-[minmax(0,1fr)_24rem]",
  },
  start: {
    sm: "lg:grid-cols-[16rem_minmax(0,1fr)]",
    md: "lg:grid-cols-[20rem_minmax(0,1fr)]",
    lg: "lg:grid-cols-[24rem_minmax(0,1fr)]",
  },
} as const satisfies Record<PageAsidePosition, Record<PageAsideWidth, string>>;

const contentPlacementVariants = {
  end: "lg:col-start-1 lg:row-start-1",
  start: "lg:col-start-2 lg:row-start-1",
} as const satisfies Record<PageAsidePosition, string>;

const asidePlacementVariants = {
  end: "lg:col-start-2 lg:row-start-1",
  start: "lg:col-start-1 lg:row-start-1",
} as const satisfies Record<PageAsidePosition, string>;

type PageBodyProps = useRender.ComponentProps<"div"> & {
  /** Supplementary column. Stacks below the content under lg. */
  aside?: ReactNode;
  /** Aside width at lg and above: 16rem, 20rem, or 24rem. */
  asideWidth?: PageAsideWidth;
  /** Which side the aside sits on at lg and above. */
  asidePosition?: PageAsidePosition;
  /** Accessible name for the aside landmark. */
  asideLabel?: string;
};

function PageBody({
  aside,
  asideWidth = "md",
  asidePosition = "end",
  asideLabel = "Supplementary information",
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
        className={cn("min-w-0", hasAside && contentPlacementVariants[asidePosition])}
      >
        {children}
      </div>

      {hasAside && (
        <aside
          data-slot="page-aside"
          aria-label={asideLabel}
          className={cn("min-w-0", asidePlacementVariants[asidePosition])}
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
          hasAside && asideTemplateVariants[asidePosition][asideWidth],
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
  PageActionsProps,
  PageBodyProps,
  PageAsideWidth,
  PageAsidePosition,
};
