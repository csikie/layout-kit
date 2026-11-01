"use client";

import { useState } from "react";
import { Row } from "@/components/ui/row";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, FilterIcon } from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Preview } from "@/components/docs/preview";
import type { PlaygroundVariants } from "@/components/docs/playground";
import {
  rowAlignOptions as alignOptions,
  rowJustifyOptions as justifyOptions,
  type RowAlign,
  type RowJustify,
  type RowVariantKey,
} from "@/lib/examples/row";
import { OptionControl } from "../controls";
import { Avatar, Box } from "../fixtures";
import { Stack } from "@/components/ui/stack";

export function RowToolbarDemo() {
  return (
    <div className="rounded-[0.6rem] border bg-background w-full p-4">
      <Row justify="between" gap={3} wrap>
        <Row gap={2}>
          <Input placeholder="Search projects…" className="w-56" aria-label="Search projects" />
          <Button variant="outline">
            <HugeiconsIcon icon={FilterIcon} data-icon="inline-start" /> Filter
          </Button>
        </Row>
        <Row gap={2}>
          <Button variant="ghost">Export</Button>
          <Button>
            <HugeiconsIcon icon={Add01Icon} data-icon="inline-start" /> New project
          </Button>
        </Row>
      </Row>
    </div>
  );
}

export function RowMetadataDemo() {
  return (
    <div className="rounded-[0.6rem] border bg-background w-full max-w-lg p-4">
      <Row gap={2} align="center" wrap>
        <Avatar name="Jonas Lindqvist" size="sm" />
        <span className="text-sm font-medium">Jonas Lindqvist</span>
        <Badge variant="secondary">Maintainer</Badge>
        <span className="text-xs text-muted-foreground">· edited 2 hours ago</span>
      </Row>
    </div>
  );
}

const topics = [
  "Design systems",
  "Accessibility",
  "React 19",
  "Tailwind CSS",
  "Grid layout",
  "Typography",
  "Dark mode",
  "Internationalization",
  "Performance",
  "Testing",
];

export function RowTagsDemo() {
  return (
    <div className="rounded-[0.6rem] border bg-background w-full max-w-md p-4">
      <Row gap={2} wrap>
        {topics.map((topic) => (
          <Badge key={topic} variant="outline">
            {topic}
          </Badge>
        ))}
      </Row>
    </div>
  );
}

export function RowPlayground({ variants }: { variants: PlaygroundVariants<RowVariantKey> }) {
  const [justify, setJustify] = useState<RowJustify>("between");
  const [align, setAlign] = useState<RowAlign>("center");
  const key: RowVariantKey = `${justify}-${align}`;
  return (
    <Preview
      badge="Playground"
      code={variants[key].code}
      source={variants[key].source}
      controls={
        <Stack gap={3} className="w-full">
          <OptionControl
            label="Justify"
            value={justify}
            options={justifyOptions}
            onChange={setJustify}
          />
          <OptionControl label="Align" value={align} options={alignOptions} onChange={setAlign} />
        </Stack>
      }
    >
      <Row
        gap={4}
        justify={justify}
        align={align}
        className="h-32 w-full rounded-md border border-dashed px-3"
      >
        <Box className="h-10 min-w-16">One</Box>
        <Box className="h-16 min-w-16">Two</Box>
        <Box className="h-12 min-w-16">Three</Box>
      </Row>
    </Preview>
  );
}
