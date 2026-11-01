import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Row } from "@/components/ui/row";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { CopyButton } from "./copy-button";

interface PreviewProps {
  /** Rendered live example. */
  children: ReactNode;
  /** Pre-highlighted code, usually a CodeBlock rendered by the server page. */
  code: ReactNode;
  /** Raw source for the copy button. */
  source: string;
  title?: string;
  badge?: string;
  align?: "center" | "start";
  padding?: "default" | "none";
  /** Optional control strip rendered under the canvas. */
  controls?: ReactNode;
}

export function Preview({
  children,
  code,
  source,
  title,
  badge,
  align = "start",
  padding = "default",
  controls,
}: PreviewProps) {
  const canvasClassName = cn(
    "relative min-w-0 overflow-x-auto bg-[radial-gradient(var(--border)_0.7px,transparent_0.7px)] bg-size-[16px_16px]",
    padding === "default" && "p-4 sm:p-8",
  );
  return (
    <Tabs defaultValue="preview" className="gap-0 overflow-hidden rounded-[0.6rem] border bg-card">
      <Row gap={3} justify="between" wrap className="border-b bg-muted px-3 py-2">
        <Row gap={3}>
          <TabsList variant="line" className="h-8">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
          {title && <span className="truncate text-xs text-muted-foreground">{title}</span>}
        </Row>
        <Row gap={2}>
          {badge && <Badge variant="outline">{badge}</Badge>}
          <CopyButton text={source.trim()} />
        </Row>
      </Row>
      <TabsContent value="preview" className="m-0">
        {align === "center" ? (
          <Row justify="center" className={cn(canvasClassName, "min-h-56 sm:min-h-72")}>
            {children}
          </Row>
        ) : (
          <div className={canvasClassName}>{children}</div>
        )}
        {controls && (
          <Row gap={4} wrap className="border-t bg-muted px-4 py-3">
            {controls}
          </Row>
        )}
      </TabsContent>
      <TabsContent value="code" className="m-0 [&_pre]:m-0 [&_pre]:rounded-none [&_pre]:border-0">
        {code}
      </TabsContent>
    </Tabs>
  );
}
