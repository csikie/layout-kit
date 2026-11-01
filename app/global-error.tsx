"use client";

import { useEffect } from "react";
import { Eyebrow } from "@/components/docs/typography";
import { ThemeProviders } from "@/components/shell/providers";
import { Button } from "@/components/ui/button";
import { Stack } from "@/components/ui/stack";
import "./globals.css";

// Replaces the root layout when it fails, so it renders its own document,
// styles, and theme provider. Metadata exports are not supported here.
export default function GlobalError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProviders>
          <title>Something went wrong — Layout Kit</title>
          <main>
            <Stack gap={4} align="start" justify="center" className="min-h-svh p-8 sm:p-16">
              <Eyebrow>Error</Eyebrow>
              <h1 className="text-3xl font-semibold tracking-tight">Something went wrong</h1>
              <p className="max-w-prose text-muted-foreground">
                The documentation failed to load. Try again, or reload the page.
              </p>
              <Button onClick={() => retry()}>Try again</Button>
            </Stack>
          </main>
        </ThemeProviders>
      </body>
    </html>
  );
}
