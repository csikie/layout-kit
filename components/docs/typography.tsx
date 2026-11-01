import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** Small uppercase mono label used above headings and in sidebars. */
const eyebrowClassName =
  "font-mono text-[0.62rem] leading-normal tracking-[0.13em] text-muted-foreground uppercase";

function Eyebrow({ className, ...props }: ComponentProps<"span">) {
  return <span className={cn("block", eyebrowClassName, className)} {...props} />;
}

/** Muted introductory paragraph under a section heading. */
function Lede({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "mb-6 max-w-176 text-[0.92rem] leading-[1.75] text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

/** Bulleted list for notes and "when to use" guidance. */
function ProseList({ className, ...props }: ComponentProps<"ul">) {
  return (
    <ul
      className={cn(
        "flex list-disc flex-col gap-[0.6rem] pl-[1.1rem] text-[0.9rem] leading-[1.7] marker:text-sidebar-primary",
        className,
      )}
      {...props}
    />
  );
}

/** A bordered surface for demos and tables. */
const surfaceClassName = "rounded-[0.6rem] border bg-background";

/** Page enter animation shared by doc pages and the home page. */
const enterAnimation =
  "animate-in duration-450 ease-out fill-mode-both fade-in slide-in-from-bottom-2 motion-reduce:animate-none";

export { Eyebrow, Lede, ProseList, enterAnimation, eyebrowClassName, surfaceClassName };
