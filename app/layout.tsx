import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppSidebar } from "@/components/shell/app-sidebar";
import { Main } from "@/components/shell/main";
import { Providers } from "@/components/shell/providers";
import { SkipLink } from "@/components/shell/skip-link";
import { rootMetadata } from "@/lib/metadata";
import "./globals.css";

export const metadata: Metadata = rootMetadata;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="scroll-pt-24 scroll-smooth motion-reduce:scroll-auto"
    >
      <body className="selection:bg-primary selection:text-primary-foreground [-webkit-tap-highlight-color:transparent]">
        <Providers>
          <SkipLink />
          <AppSidebar />
          <Main>{children}</Main>
        </Providers>
      </body>
    </html>
  );
}
