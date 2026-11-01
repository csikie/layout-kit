"use client";

import { useState } from "react";
import { Col } from "@/components/ui/col";
import { Grid } from "@/components/ui/grid";
import { Page } from "@/components/ui/page";
import { Row } from "@/components/ui/row";
import { Stack } from "@/components/ui/stack";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Preview } from "@/components/docs/preview";
import type { PlaygroundVariants } from "@/components/docs/playground";
import {
  pagePositionOptions as positionOptions,
  pageSizeOptions as sizeOptions,
  pageWidthOptions as widthOptions,
  type PagePosition,
  type PageSizeOption,
  type PageVariantKey,
  type PageWidth,
} from "@/lib/examples/page";
import { OptionControl } from "../controls";
import { Avatar, Box, Stat, people, stats } from "../fixtures";
import { Eyebrow } from "@/components/docs/typography";

const details = [
  ["Owner", "Mara Okafor"],
  ["Timeline", "Q4 2026"],
  ["Platforms", "Web, iOS, Android"],
  ["Repository", "studio/design-system"],
];

export function PageOverviewDemo() {
  const [tasks, setTasks] = useState(12);
  return (
    <div className="rounded-[0.6rem] border bg-background w-full overflow-hidden">
      <Page size="xl">
        <Page.Header
          titleAs="h4"
          title="Design system rollout"
          description="Migrating every product surface to the shared component library."
          metadata={<Badge>Active</Badge>}
          actions={
            <Page.Actions>
              <Button variant="outline">Share</Button>
              <Button onClick={() => setTasks((value) => value + 1)}>New task</Button>
            </Page.Actions>
          }
        />
        <Page.Body
          asideWidth="sm"
          aside={
            <Card>
              <CardContent>
                <Stack gap={3}>
                  {details.map(([label, value]) => (
                    <Stack key={label} gap={1}>
                      <Eyebrow>{label}</Eyebrow>
                      <span className="text-sm">{value}</span>
                    </Stack>
                  ))}
                  <Stack gap={1}>
                    <Eyebrow>Open tasks</Eyebrow>
                    <span className="text-sm" aria-live="polite">
                      {tasks}
                    </span>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          }
        >
          <Stack gap={6}>
            <Grid cols={{ base: 1, sm: 3 }} gap={4}>
              {stats.slice(0, 3).map((stat) => (
                <Card key={stat.label}>
                  <CardContent>
                    <Stat {...stat} />
                  </CardContent>
                </Card>
              ))}
            </Grid>
            <Stack gap={3}>
              <h2 className="text-sm font-semibold">Recent activity</h2>
              {people.map((event) => (
                <Row key={event.name} gap={3} align="start">
                  <Avatar name={event.name} size="sm" />
                  <Col grow>
                    <Stack gap={1}>
                      <p className="text-sm">
                        <span className="font-medium">{event.name}</span> {event.action}
                      </p>
                    </Stack>
                  </Col>
                  <span className="text-xs text-muted-foreground">{event.time}</span>
                </Row>
              ))}
            </Stack>
          </Stack>
        </Page.Body>
      </Page>
    </div>
  );
}

export function PagePlayground({ variants }: { variants: PlaygroundVariants<PageVariantKey> }) {
  const [size, setSize] = useState<PageSizeOption>("md");
  const [position, setPosition] = useState<PagePosition>("end");
  const [width, setWidth] = useState<PageWidth>("md");
  const key: PageVariantKey = `${size}|${position}|${width}`;
  return (
    <Preview
      badge="Playground"
      padding="none"
      code={variants[key].code}
      source={variants[key].source}
      controls={
        <Stack gap={3} className="w-full">
          <OptionControl label="Size" value={size} options={sizeOptions} onChange={setSize} />
          <OptionControl
            label="Aside position"
            value={position}
            options={positionOptions}
            onChange={setPosition}
          />
          <OptionControl
            label="Aside width"
            value={width}
            options={widthOptions}
            onChange={setWidth}
          />
        </Stack>
      }
    >
      <div className="w-full border-x border-dashed">
        <Page size={size} className="outline-1 outline-dashed outline-sidebar-primary/40">
          <Page.Header
            titleAs="h4"
            title="Workspace settings"
            description="Manage members, billing, and integrations."
            actions={
              <Page.Actions>
                <Button>Invite</Button>
              </Page.Actions>
            }
          />
          <Page.Body
            asidePosition={position}
            asideWidth={width}
            aside={<Box className="h-28">Aside</Box>}
          >
            <Box className="h-40">Content</Box>
          </Page.Body>
        </Page>
      </div>
    </Preview>
  );
}
