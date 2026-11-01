import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import {
  alignVariants,
  gapVariants,
  responsiveClasses,
  type Align,
  type Gap,
  type Responsive,
  type ResponsiveVariants,
} from "@/lib/spacing";
import { cn } from "@/lib/utils";

type GridColumns = 1 | 2 | 3 | 4 | 5 | 6 | 12;

const columnVariants = {
  base: {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
    12: "grid-cols-12",
  },
  sm: {
    1: "sm:grid-cols-1",
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-3",
    4: "sm:grid-cols-4",
    5: "sm:grid-cols-5",
    6: "sm:grid-cols-6",
    12: "sm:grid-cols-12",
  },
  md: {
    1: "md:grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
    5: "md:grid-cols-5",
    6: "md:grid-cols-6",
    12: "md:grid-cols-12",
  },
  lg: {
    1: "lg:grid-cols-1",
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
    5: "lg:grid-cols-5",
    6: "lg:grid-cols-6",
    12: "lg:grid-cols-12",
  },
  xl: {
    1: "xl:grid-cols-1",
    2: "xl:grid-cols-2",
    3: "xl:grid-cols-3",
    4: "xl:grid-cols-4",
    5: "xl:grid-cols-5",
    6: "xl:grid-cols-6",
    12: "xl:grid-cols-12",
  },
  "2xl": {
    1: "2xl:grid-cols-1",
    2: "2xl:grid-cols-2",
    3: "2xl:grid-cols-3",
    4: "2xl:grid-cols-4",
    5: "2xl:grid-cols-5",
    6: "2xl:grid-cols-6",
    12: "2xl:grid-cols-12",
  },
} as const satisfies ResponsiveVariants<GridColumns>;

type GridProps = useRender.ComponentProps<"div"> & {
  /** Column count, or a breakpoint map of column counts. */
  cols?: Responsive<GridColumns>;
  /** Space between rows and columns. */
  gap?: Responsive<Gap>;
  /** Vertical alignment of items within their row. */
  align?: Responsive<Align>;
};

/** CSS grid with a typed, responsive column count. */
function Grid({ cols = 1, gap = 4, align = "stretch", className, render, ...props }: GridProps) {
  return useRender({
    defaultTagName: "div",
    render,
    state: { slot: "grid" },
    props: mergeProps<"div">(
      {
        className: cn(
          "grid min-w-0",
          responsiveClasses(cols, columnVariants),
          responsiveClasses(gap, gapVariants),
          responsiveClasses(align, alignVariants),
          className,
        ),
      },
      props,
    ),
  });
}

export { Grid };
export type { GridProps, GridColumns };
