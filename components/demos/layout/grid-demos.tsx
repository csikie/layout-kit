"use client";

import { useState } from "react";
import { Grid } from "@/components/ui/grid";
import { Row } from "@/components/ui/row";
import { Stack } from "@/components/ui/stack";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Preview } from "@/components/docs/preview";
import type { PlaygroundVariants } from "@/components/docs/playground";
import {
  gridColOptions as colOptions,
  gridGapOptions as gapOptions,
  type GridCols,
  type GridGap,
  type GridVariantKey,
} from "@/lib/examples/grid";
import { OptionControl } from "../controls";
import { Box, Field, Stat, stats } from "../fixtures";

export function GridStatsDemo() {
  return (
    <div className="w-full">
      <Grid cols={{ base: 1, sm: 2, lg: 4 }} gap={4}>
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent>
              <Stat {...stat} />
            </CardContent>
          </Card>
        ))}
      </Grid>
    </div>
  );
}

export function GridFormDemo() {
  return (
    <div className="rounded-[0.6rem] border bg-background w-full max-w-xl p-6">
      <Stack gap={6}>
        <Grid cols={{ base: 1, md: 2 }} gap={4}>
          <Field id="grid-first" label="First name" />
          <Field id="grid-last" label="Last name" />
          <Field id="grid-company" label="Company" placeholder="Optional" />
          <Field id="grid-phone" label="Phone" type="tel" />
        </Grid>
        <Row justify="end">
          <Button>Continue to payment</Button>
        </Row>
      </Stack>
    </div>
  );
}

export function GridPlayground({ variants }: { variants: PlaygroundVariants<GridVariantKey> }) {
  const [cols, setCols] = useState<GridCols>("3");
  const [gap, setGap] = useState<GridGap>("4");
  const key: GridVariantKey = `${cols}|${gap}`;
  const resolvedCols =
    cols === "{ base: 2, md: 4 }" ? ({ base: 2, md: 4 } as const) : (Number(cols) as 2 | 3 | 4);
  return (
    <Preview
      badge="Playground"
      code={variants[key].code}
      source={variants[key].source}
      controls={
        <Stack gap={3} className="w-full">
          <OptionControl label="Cols" value={cols} options={colOptions} onChange={setCols} />
          <OptionControl label="Gap" value={gap} options={gapOptions} onChange={setGap} />
        </Stack>
      }
    >
      <Grid cols={resolvedCols} gap={Number(gap) as 2 | 4 | 8} className="w-full">
        {Array.from({ length: 8 }, (_, index) => (
          <Box key={index}>{String(index + 1).padStart(2, "0")}</Box>
        ))}
      </Grid>
    </Preview>
  );
}
