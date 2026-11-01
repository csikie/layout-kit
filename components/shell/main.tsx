import type { ReactNode } from "react";
import { Page } from "@/components/ui/page";
import { SidebarInset } from "@/components/ui/sidebar";
import { Footer } from "./footer";
import { Topbar } from "./topbar";

export function Main({ children }: { children: ReactNode }) {
  return (
    <SidebarInset className="min-w-0">
      <Topbar />
      <Page
        id="main-content"
        tabIndex={-1}
        gutter={false}
        className="max-w-336 px-5 py-0 sm:px-8 md:py-0 min-[72rem]:px-12 min-[100rem]:px-18"
      >
        {children}
        <Footer />
      </Page>
    </SidebarInset>
  );
}
