import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
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

type StackProps = useRender.ComponentProps<"div"> & {
  /** Space between children. */
  gap?: Responsive<Gap>;
  /** Cross-axis (horizontal) alignment of children. */
  align?: Responsive<Align>;
  /** Main-axis (vertical) distribution of children. */
  justify?: Responsive<Justify>;
};

/** Vertical flex container: children flow top to bottom with one consistent gap. */
function Stack({
  gap = 4,
  align = "stretch",
  justify = "start",
  className,
  render,
  ...props
}: StackProps) {
  return useRender({
    defaultTagName: "div",
    render,
    state: { slot: "stack" },
    props: mergeProps<"div">(
      {
        className: cn(
          "flex min-w-0 flex-col",
          responsiveClasses(gap, gapVariants),
          responsiveClasses(align, alignVariants),
          responsiveClasses(justify, justifyVariants),
          className,
        ),
      },
      props,
    ),
  });
}

export { Stack };
export type { StackProps };
