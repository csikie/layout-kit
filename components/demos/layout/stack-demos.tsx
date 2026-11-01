"use client";

import { useState } from "react";
import { Col } from "@/components/ui/col";
import { Grid } from "@/components/ui/grid";
import { Row } from "@/components/ui/row";
import { Stack } from "@/components/ui/stack";
import { Button } from "@/components/ui/button";
import { Preview } from "@/components/docs/preview";
import type { PlaygroundVariants } from "@/components/docs/playground";
import { stackGapOptions as gaps, type StackGap } from "@/lib/examples/stack";
import { OptionControl } from "../controls";
import { Avatar, Box, Field, people } from "../fixtures";

export function StackFormDemo() {
  return (
    <div className="rounded-[0.6rem] border bg-background w-full max-w-md p-6">
      <Stack gap={6}>
        <Stack gap={1}>
          <h3 className="text-sm font-semibold">Profile</h3>
          <p className="text-xs text-muted-foreground">
            This is how teammates see you across the workspace.
          </p>
        </Stack>
        <Stack gap={4}>
          <Field id="stack-name" label="Full name" defaultValue="Mara Okafor" />
          <Field id="stack-email" label="Email" type="email" defaultValue="mara@studio.co" />
          <Field id="stack-title" label="Title" placeholder="Design lead" />
        </Stack>
        <Row gap={2} justify="end">
          <Button variant="outline">Cancel</Button>
          <Button>Save changes</Button>
        </Row>
      </Stack>
    </div>
  );
}

export function StackFeedDemo() {
  return (
    <div className="rounded-[0.6rem] border bg-background w-full max-w-lg p-5">
      <Stack gap={3}>
        {people.map((event) => (
          <Row key={event.name} gap={3} align="start">
            <Avatar name={event.name} size="sm" />
            <Col grow>
              <Stack gap={1}>
                <p className="text-sm">
                  <span className="font-medium">{event.name}</span> {event.action}
                </p>
                <span className="text-xs text-muted-foreground">{event.role}</span>
              </Stack>
            </Col>
            <span className="text-xs text-muted-foreground">{event.time}</span>
          </Row>
        ))}
      </Stack>
    </div>
  );
}

const plans = [
  { name: "Starter", summary: "For individuals exploring the kit.", price: "$0", featured: false },
  {
    name: "Team",
    summary: "Shared libraries, review flows, and priority support for growing product teams.",
    price: "$24",
    featured: true,
  },
  {
    name: "Enterprise",
    summary: "SSO, audit logs, and a dedicated success manager.",
    price: "Custom",
    featured: false,
  },
];

export function StackPinnedDemo() {
  return (
    <div className="w-full">
      <Grid cols={{ base: 1, sm: 3 }} gap={4}>
        {plans.map((plan) => (
          <Stack
            key={plan.name}
            justify="between"
            gap={6}
            className="rounded-[0.6rem] border bg-background h-56 p-4"
          >
            <Stack gap={2}>
              <span className="text-sm font-semibold">{plan.name}</span>
              <span className="text-xs text-muted-foreground">{plan.summary}</span>
            </Stack>
            <Stack gap={3}>
              <span className="text-[1.6rem] leading-[1.1] font-semibold tracking-[-0.04em]">
                {plan.price}
              </span>
              <Button variant={plan.featured ? "default" : "outline"}>Choose {plan.name}</Button>
            </Stack>
          </Stack>
        ))}
      </Grid>
    </div>
  );
}

export function StackResponsiveDemo() {
  return (
    <div className="rounded-[0.6rem] border bg-background w-full max-w-md p-6">
      <Stack gap={{ base: 3, md: 6, xl: 8 }}>
        <h2 className="text-lg font-semibold">Release notes</h2>
        <p className="text-sm text-muted-foreground">
          Responsive gaps without a single media query.
        </p>
        <p className="text-sm text-muted-foreground">
          Every breakpoint class is written out in source.
        </p>
      </Stack>
    </div>
  );
}

export function StackPlayground({ variants }: { variants: PlaygroundVariants<StackGap> }) {
  const [gap, setGap] = useState<StackGap>("4");
  const numeric = Number(gap) as 2 | 4 | 8;
  return (
    <Preview
      align="center"
      badge="Playground"
      code={variants[gap].code}
      source={variants[gap].source}
      controls={
        <OptionControl
          label="Gap"
          value={gap}
          options={gaps}
          onChange={setGap}
          hint={`${numeric * 4}px between items`}
        />
      }
    >
      <Stack gap={numeric} className="w-full max-w-xs">
        <Box>Header</Box>
        <Box>Content</Box>
        <Box>Footer</Box>
      </Stack>
    </Preview>
  );
}
