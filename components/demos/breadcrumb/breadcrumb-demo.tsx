"use client";

import { useState } from "react";
import {
  AppBreadcrumb,
  resolveBreadcrumbs,
  type BreadcrumbEntry,
  type UnknownBreadcrumbPolicy,
} from "@/components/ui/app-breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { demoData, demoRoutes, scenarios, type DemoData } from "./routes";
import { Row } from "@/components/ui/row";
import { Stack } from "@/components/ui/stack";
import { Eyebrow } from "@/components/docs/typography";

export function BreadcrumbDemo() {
  const [pathname, setPathname] = useState(scenarios[0]!.path);
  const [dataMode, setDataMode] = useState("ready");
  const [policy, setPolicy] = useState("format");
  const [limit, setLimit] = useState(5);
  const [hideWorkspace, setHideWorkspace] = useState(false);
  const [longLabel, setLongLabel] = useState(false);
  const unknown: UnknownBreadcrumbPolicy<DemoData> =
    policy === "custom"
      ? ({ segment }) => `Section: ${segment}`
      : policy === "omit"
        ? "omit"
        : policy === "error"
          ? "error"
          : "format";
  let items: BreadcrumbEntry[] = [];
  let error: string | undefined;
  try {
    items = resolveBreadcrumbs({
      pathname,
      routes: demoRoutes.map((route) =>
        route.path === "/workspace" ? { ...route, hidden: hideWorkspace } : route,
      ),
      data:
        dataMode === "missing"
          ? undefined
          : longLabel
            ? {
                ...demoData,
                project: {
                  name: "Atlas — a deliberately long project name for a compact navigation header",
                },
              }
            : demoData,
      loading: dataMode === "loading",
      unknown,
    });
  } catch (cause) {
    error = cause instanceof Error ? cause.message : "Unable to resolve breadcrumbs.";
  }
  return (
    <Stack gap={6}>
      <Row gap={2} align="stretch" wrap role="group" aria-label="Breadcrumb scenarios">
        {scenarios.map((scenario) => (
          <Button
            key={scenario.value}
            variant={pathname === scenario.path ? "secondary" : "outline"}
            onClick={() => setPathname(scenario.path)}
          >
            {scenario.label}
          </Button>
        ))}
      </Row>
      <Stack className="rounded-lg border bg-muted/20 p-5">
        <Row gap={3} justify="between" wrap>
          <Eyebrow>PATH SANDBOX</Eyebrow>
          <Badge variant="outline">Router independent</Badge>
        </Row>
        {error ? (
          <Alert variant="destructive">
            <AlertTitle>{error}</AlertTitle>
          </Alert>
        ) : (
          <AppBreadcrumb
            items={items}
            maxVisibleItems={limit}
            labels={{ navigation: "Breadcrumb sandbox", more: "Show hidden sandbox pages" }}
            renderLink={({ href, children }) => (
              <a
                href={href}
                data-demo-link
                onClick={(event) => {
                  event.preventDefault();
                  setPathname(href);
                }}
              >
                {children}
              </a>
            )}
          />
        )}
        <code className="break-all text-xs text-muted-foreground">{pathname}</code>
        <p className="text-xs text-muted-foreground">
          Links update this local path only. Dynamic names come from demo data; no request is made.
        </p>
      </Stack>
      <Row gap={6} align="stretch" wrap>
        <Stack gap={2}>
          <Eyebrow>DYNAMIC DATA</Eyebrow>
          <ToggleGroup
            aria-label="Dynamic breadcrumb data"
            value={[dataMode]}
            onValueChange={(value) => {
              if (value[0]) setDataMode(value[0]);
            }}
          >
            <ToggleGroupItem value="ready">Ready</ToggleGroupItem>
            <ToggleGroupItem value="loading">Loading</ToggleGroupItem>
            <ToggleGroupItem value="missing">Missing</ToggleGroupItem>
          </ToggleGroup>
        </Stack>
        <Stack gap={2}>
          <Eyebrow>UNKNOWN SEGMENTS</Eyebrow>
          <ToggleGroup
            aria-label="Unknown segment policy"
            value={[policy]}
            onValueChange={(value) => {
              if (value[0]) setPolicy(value[0]);
            }}
          >
            {["format", "omit", "error", "custom"].map((value) => (
              <ToggleGroupItem key={value} value={value}>
                {value}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </Stack>
        <Stack gap={2}>
          <Eyebrow>VISIBLE SLOTS</Eyebrow>
          <ToggleGroup
            aria-label="Breadcrumb visible slots"
            value={[String(limit)]}
            onValueChange={(value) => {
              if (value[0]) setLimit(Number(value[0]));
            }}
          >
            {[3, 5, 7].map((value) => (
              <ToggleGroupItem key={value} value={String(value)}>
                {value}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </Stack>
      </Row>
      <Row gap={2} align="stretch" wrap>
        <Button
          variant="outline"
          aria-pressed={hideWorkspace}
          onClick={() => setHideWorkspace((value) => !value)}
        >
          Hide workspace level
        </Button>
        <Button
          variant="outline"
          aria-pressed={longLabel}
          onClick={() => setLongLabel((value) => !value)}
        >
          Use long project name
        </Button>
      </Row>
      <details className="rounded-md border p-3 text-xs">
        <summary className="cursor-pointer font-medium">Resolved items</summary>
        <pre className="mt-3 max-w-full overflow-auto text-muted-foreground">
          {JSON.stringify(items, null, 2)}
        </pre>
      </details>
    </Stack>
  );
}
