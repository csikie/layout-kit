import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * The Layout Kit mark ("Keyed Block", design/logo/): two stepped blocks with
 * a constant gap. Fills follow the theme tokens, so it adapts to dark mode.
 */
function LogoMark({ className, ...props }: ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
      className={cn("shrink-0", className)}
      {...props}
    >
      <path className="fill-primary" d="M2 2h16v12h-8v16H2Z" />
      <path className="fill-sidebar-foreground" d="M22 2h8v28H14V18h8Z" />
    </svg>
  );
}

export { LogoMark };
