"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Download04Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Col } from "@/components/ui/col";
import { Row } from "@/components/ui/row";
import { Stack } from "@/components/ui/stack";
import { cn } from "@/lib/utils";
import { Avatar } from "../fixtures";

const sections = ["General", "Notifications", "Members", "Billing", "Integrations"];

export function ColSplitDemo() {
  return (
    <div className="rounded-[0.6rem] border bg-background w-full max-w-2xl p-5">
      <Row gap={6} align="stretch">
        <Col shrink={false} className="w-44">
          <Stack gap={1}>
            {sections.map((section, index) => (
              <a
                key={section}
                href="#col-examples"
                onClick={(event) => event.preventDefault()}
                className={cn(
                  "rounded-md px-2 py-1.5 text-sm hover:bg-muted",
                  index === 1 && "bg-muted font-medium",
                )}
              >
                {section}
              </a>
            ))}
          </Stack>
        </Col>
        <Col grow>
          <Stack gap={4}>
            <h3 className="text-sm font-semibold">Notifications</h3>
            <p className="text-sm text-muted-foreground">
              Choose how you want to hear about activity in your projects. Mentions and review
              requests are always delivered.
            </p>
            <Row gap={2}>
              <Button variant="outline" size="sm">
                Email
              </Button>
              <Button variant="outline" size="sm">
                Push
              </Button>
              <Button variant="outline" size="sm">
                Slack
              </Button>
            </Row>
          </Stack>
        </Col>
      </Row>
    </div>
  );
}

const files = [
  {
    name: "brand-guidelines-final-approved-v12-really-final.pdf",
    size: "4.2 MB",
    updated: "Today",
  },
  { name: "component-inventory.xlsx", size: "812 KB", updated: "Yesterday" },
];

export function ColMediaDemo() {
  return (
    <div className="rounded-[0.6rem] border bg-background w-full max-w-sm p-4">
      <Stack gap={4}>
        {files.map((file) => (
          <Row key={file.name} gap={3} align="start">
            <Col shrink={false} className="size-12 rounded-md bg-muted" />
            <Col grow>
              <Stack gap={1}>
                <span className="truncate text-sm font-medium" title={file.name}>
                  {file.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {file.size} · {file.updated}
                </span>
              </Stack>
            </Col>
            <Button variant="ghost" size="icon" aria-label={`Download ${file.name}`}>
              <HugeiconsIcon icon={Download04Icon} />
            </Button>
          </Row>
        ))}
      </Stack>
    </div>
  );
}

const requests = [
  {
    author: "Ines Duarte",
    title: "Tokens: align spacing scale with Tailwind 4",
    summary:
      "Replaces the legacy 5px steps with the default scale and migrates the three components that still used them.",
  },
  {
    author: "Kenji Mori",
    title: "Page: mirrored aside",
    summary: "Fixes the start position.",
  },
];

export function ColSelfDemo() {
  return (
    <div className="rounded-[0.6rem] border bg-background w-full max-w-lg p-4">
      <Stack gap={4}>
        {requests.map((request) => (
          <Row key={request.title} gap={3} align="start">
            <Avatar name={request.author} size="sm" />
            <Col grow>
              <Stack gap={1}>
                <span className="text-sm font-medium">{request.title}</span>
                <span className="text-xs text-muted-foreground">{request.summary}</span>
              </Stack>
            </Col>
            <Col shrink={false} self="center">
              <Button size="sm">Review</Button>
            </Col>
          </Row>
        ))}
      </Stack>
    </div>
  );
}
