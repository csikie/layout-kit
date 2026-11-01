import type { ReactNode } from "react";
import { Page } from "@/components/ui/page";
import { Stack } from "@/components/ui/stack";
import { Footer } from "./footer";
import { Topbar } from "./topbar";

/**
 * The column beside the sidebar. Only the page content is <main>: the topbar
 * and footer sit outside it, so they are the document's banner and contentinfo
 * landmarks. This replaces SidebarInset, which renders the whole column as <main>.
 */
export function Main({ children }: { children: ReactNode }) {
  return (
    <Stack gap={0} className="relative w-full flex-1 bg-background">
      <Topbar />
      <Page
        gutter={false}
        className="max-w-336 px-5 py-0 sm:px-8 md:py-0 min-[72rem]:px-12 min-[100rem]:px-18"
      >
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </Page>
    </Stack>
  );
}
