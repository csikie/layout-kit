"use client";

import { useEffect } from "react";
import { SectionLink } from "@/components/demos/overview-demos";
import { DocHeader, DocLayout } from "@/components/docs/doc-page";
import { Button } from "@/components/ui/button";
import { Row } from "@/components/ui/row";

function errorDigest(error: unknown): string | undefined {
  if (error instanceof Error && "digest" in error && typeof error.digest === "string") {
    return error.digest;
  }
  return undefined;
}

export default function ErrorPage({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const digest = errorDigest(error);

  return (
    <DocLayout>
      <DocHeader
        eyebrow="Error"
        title="Something went wrong"
        description="This page failed to render. Try again, or head back to the introduction."
      />
      <Row gap={3} wrap>
        <Button onClick={() => retry()}>Try again</Button>
        <SectionLink href="/">Back to the introduction</SectionLink>
      </Row>
      {digest && <p className="mt-6 text-xs text-muted-foreground">Reference: {digest}</p>}
    </DocLayout>
  );
}
