import type { ComponentProps } from "react";
import {
  alignVariants,
  gapVariants,
  justifyVariants,
  responsiveClasses,
  type Align,
  type Gap,
  type Justify,
  type Responsive,
} from "@/lib/spacing";
import { cn } from "@/lib/utils";

type RowProps = ComponentProps<"div"> & {
  /** Space between children. */
  gap?: Responsive<Gap>;
  /** Cross-axis (vertical) alignment of children. */
  align?: Responsive<Align>;
  /** Main-axis (horizontal) distribution of children. */
  justify?: Responsive<Justify>;
  /** Allow children to flow onto additional lines. */
  wrap?: boolean;
};

/** Horizontal flex container: children flow left to right with one consistent gap. */
function Row({
  gap = 4,
  align = "center",
  justify = "start",
  wrap = false,
  className,
  ...props
}: RowProps) {
  return (
    <div
      data-slot="row"
      className={cn(
        "flex min-w-0 flex-row",
        wrap ? "flex-wrap" : "flex-nowrap",
        responsiveClasses(gap, gapVariants),
        responsiveClasses(align, alignVariants),
        responsiveClasses(justify, justifyVariants),
        className,
      )}
      {...props}
    />
  );
}

export { Row };
export type { RowProps };
