import type { ComponentProps } from "react";
import { responsiveClasses, type Responsive, type ResponsiveVariants } from "@/lib/spacing";
import { cn } from "@/lib/utils";

type GridSpan = 1 | 2 | 3 | 4 | 5 | 6 | 12 | "full";

const spanVariants = {
  base: {
    1: "col-span-1",
    2: "col-span-2",
    3: "col-span-3",
    4: "col-span-4",
    5: "col-span-5",
    6: "col-span-6",
    12: "col-span-12",
    full: "col-span-full",
  },
  sm: {
    1: "sm:col-span-1",
    2: "sm:col-span-2",
    3: "sm:col-span-3",
    4: "sm:col-span-4",
    5: "sm:col-span-5",
    6: "sm:col-span-6",
    12: "sm:col-span-12",
    full: "sm:col-span-full",
  },
  md: {
    1: "md:col-span-1",
    2: "md:col-span-2",
    3: "md:col-span-3",
    4: "md:col-span-4",
    5: "md:col-span-5",
    6: "md:col-span-6",
    12: "md:col-span-12",
    full: "md:col-span-full",
  },
  lg: {
    1: "lg:col-span-1",
    2: "lg:col-span-2",
    3: "lg:col-span-3",
    4: "lg:col-span-4",
    5: "lg:col-span-5",
    6: "lg:col-span-6",
    12: "lg:col-span-12",
    full: "lg:col-span-full",
  },
  xl: {
    1: "xl:col-span-1",
    2: "xl:col-span-2",
    3: "xl:col-span-3",
    4: "xl:col-span-4",
    5: "xl:col-span-5",
    6: "xl:col-span-6",
    12: "xl:col-span-12",
    full: "xl:col-span-full",
  },
  "2xl": {
    1: "2xl:col-span-1",
    2: "2xl:col-span-2",
    3: "2xl:col-span-3",
    4: "2xl:col-span-4",
    5: "2xl:col-span-5",
    6: "2xl:col-span-6",
    12: "2xl:col-span-12",
    full: "2xl:col-span-full",
  },
} as const satisfies ResponsiveVariants<GridSpan>;

type GridItemProps = ComponentProps<"div"> & {
  /** Columns to span, or a breakpoint map of spans. `"full"` spans the whole row. */
  span?: Responsive<GridSpan>;
};

/** A Grid cell that spans more than one column. */
function GridItem({ span = 1, className, ...props }: GridItemProps) {
  return (
    <div
      data-slot="grid-item"
      className={cn("min-w-0", responsiveClasses(span, spanVariants), className)}
      {...props}
    />
  );
}

export { GridItem };
export type { GridItemProps, GridSpan };
