"use client";

import { useState } from "react";
import {
  BreadcrumbProvider,
  ContextBreadcrumb,
  usePageBreadcrumbs,
  type BreadcrumbRoute,
} from "@/components/ui/app-breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Row } from "@/components/ui/row";
import { Stack } from "@/components/ui/stack";
import { Eyebrow } from "@/components/docs/typography";

const routes: BreadcrumbRoute[] = [
  { path: "/", label: "Docs", href: "/" },
  { path: "/projects", label: "Projects", href: "/docs/breadcrumb" },
  { id: "project", path: "/projects/:projectId", label: "Project overview" },
];
function PagePublisher({
  id,
  name,
  labelsOnly,
}: {
  id: string;
  name: string;
  labelsOnly: boolean;
}) {
  usePageBreadcrumbs(
    labelsOnly
      ? { scope: `project:${id}`, routeLabels: { project: name } }
      : {
          scope: `project:${id}`,
          items: [
            { id: "home", label: "Docs", href: "/" },
            { id: "projects", label: "Projects", href: "/docs/breadcrumb" },
            { id: "project", label: name },
          ],
        },
  );
  return null;
}
export function BreadcrumbContextDemo() {
  const [active, setActive] = useState("atlas");
  const [names, setNames] = useState<Record<string, string>>({ atlas: "Atlas", orion: "Orion" });
  const [mounted, setMounted] = useState(true);
  const [labelsOnly, setLabelsOnly] = useState(false);
  const [notice, setNotice] = useState("");
  const inactive = active === "atlas" ? "orion" : "atlas";
  return (
    <BreadcrumbProvider
      scope={`project:${active}`}
      pathname={`/projects/${active}`}
      routes={routes}
      labels={{ navigation: "Context layout breadcrumb" }}
    >
      <Stack className="gap-5 rounded-lg border p-5">
        <Row gap={3} justify="between" wrap>
          <Eyebrow>SHARED LAYOUT</Eyebrow>
          <Badge variant="outline">Active scope: project:{active}</Badge>
        </Row>
        <ContextBreadcrumb />
        <Row gap={2} align="stretch" wrap>
          {["atlas", "orion"].map((id) => (
            <Button
              key={id}
              variant={active === id ? "secondary" : "outline"}
              onClick={() => {
                setActive(id);
                setMounted(true);
                setNotice("");
              }}
            >
              Open {id === "atlas" ? "Atlas" : "Orion"}
            </Button>
          ))}
        </Row>
        <Stack gap={2}>
          <label htmlFor="context-project-name" className="text-xs font-medium">
            Current project name
          </label>
          <Input
            id="context-project-name"
            value={names[active] ?? ""}
            disabled={!mounted}
            onChange={(event) =>
              setNames((previous) => ({ ...previous, [active]: event.target.value }))
            }
          />
        </Stack>
        <Row gap={2} align="stretch" wrap>
          <Button variant="outline" onClick={() => setMounted((value) => !value)}>
            {mounted ? "Unmount active page" : "Mount active page"}
          </Button>
          <Button
            variant="outline"
            aria-pressed={labelsOnly}
            onClick={() => setLabelsOnly((value) => !value)}
          >
            Override labels only
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setNames((previous) => ({
                ...previous,
                [inactive]: `${previous[inactive]} · late update`,
              }));
              setNotice(
                `Updated inactive scope project:${inactive}. The active trail stays unchanged.`,
              );
            }}
          >
            Update inactive page
          </Button>
        </Row>
        <p role="status" className="text-xs text-muted-foreground">
          {notice ||
            "The layout and page publishers are siblings. Unmounting the active page restores the provider fallback."}
        </p>
        {["atlas", "orion"].map((id) =>
          id === active && !mounted ? null : (
            <PagePublisher key={id} id={id} name={names[id] ?? id} labelsOnly={labelsOnly} />
          ),
        )}
      </Stack>
    </BreadcrumbProvider>
  );
}
