import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

/** Theme storage key, kept from the earlier hand-written theme script. */
const themeStorageKey = "layout-kit-theme";

export function ThemeProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey={themeStorageKey}
    >
      {children}
    </ThemeProvider>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProviders>
      <TooltipProvider>
        <SidebarProvider>{children}</SidebarProvider>
      </TooltipProvider>
    </ThemeProviders>
  );
}
