import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const selfVariants = {
  auto: "self-auto",
  start: "self-start",
  center: "self-center",
  end: "self-end",
  stretch: "self-stretch",
  baseline: "self-baseline",
} as const;

type ColSelf = keyof typeof selfVariants;

type ColProps = ComponentProps<"div"> & {
  /** Fill the remaining space in the parent Row or Stack. */
  grow?: boolean;
  /** Allow shrinking below the content size. Pass `false` for fixed rails. */
  shrink?: boolean;
  /** Override the parent's cross-axis alignment for this child only. */
  self?: ColSelf;
};

/**
 * Flex child: a region inside a Row or Stack with explicit grow and shrink
 * behavior. Col is not a container; nest a Stack or Row inside it to lay out
 * its own children.
 */
function Col({ grow = false, shrink = true, self = "auto", className, ...props }: ColProps) {
  return (
    <div
      data-slot="col"
      className={cn(
        "min-w-0",
        grow ? "grow" : "grow-0",
        shrink ? "shrink" : "shrink-0",
        selfVariants[self],
        className,
      )}
      {...props}
    />
  );
}

export { Col };
export type { ColProps, ColSelf };
