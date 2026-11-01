import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { primitives } from "@/lib/primitives";
import { Grid } from "@/components/ui/grid";
import { Row } from "@/components/ui/row";
import { Eyebrow, enterAnimation } from "@/components/docs/typography";

export function HeroActions() {
  return (
    <Row gap={3} wrap className="mt-8">
      <Link href="/docs/installation" className={buttonVariants({ size: "lg" })}>
        Start building <HugeiconsIcon icon={ArrowRight01Icon} data-icon="inline-end" />
      </Link>
      <Link href="/docs/patterns" className={buttonVariants({ variant: "outline", size: "lg" })}>
        See the patterns
      </Link>
    </Row>
  );
}

export function HeroBadges() {
  return (
    <Row gap={3}>
      <Badge variant="outline">The layout toolkit</Badge>
      <span className="text-xs text-muted-foreground">React 19 · TypeScript · Tailwind CSS 4</span>
    </Row>
  );
}

// Each sketch mimics the primitive it illustrates. Classes are written out in
// full so Tailwind can find them.
const sketchVariants: Record<string, string> = {
  stack: "flex-col",
  row: "",
  col: "[&>span:first-child]:flex-[2]",
  grid: "grid grid-cols-3",
  "grid-item": "grid grid-cols-[2fr_1fr] [&>span:last-child]:col-span-full",
  page: "grid grid-cols-[2fr_1fr] [&>span:first-child]:col-span-full",
};

function LayoutSketch({ kind }: { kind: string }) {
  return (
    <Row
      align="stretch"
      aria-hidden="true"
      className={cn(
        "min-h-[6.8rem] gap-[0.45rem] rounded-[0.35rem] border border-dashed bg-muted p-3",
        sketchVariants[kind],
      )}
    >
      {Array.from({ length: kind === "grid" ? 6 : 3 }, (_, index) => (
        <span
          key={index}
          className="grid min-w-0 flex-1 place-items-center rounded-[0.2rem] border bg-background font-mono text-[0.55rem] text-muted-foreground first:border-primary-foreground/35 first:bg-primary first:text-primary-foreground"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      ))}
    </Row>
  );
}

export function PrimitiveCards() {
  return (
    <Grid
      cols={{ base: 1, sm: 2 }}
      gap={{ base: 3, sm: 4 }}
      className={cn("delay-100 min-[72rem]:grid-cols-3", enterAnimation)}
    >
      {primitives.map((item, index) => (
        <Link
          className="block min-w-0 transition-transform duration-250 hover:-translate-y-1 focus-visible:rounded-(--radius) focus-visible:outline-2 focus-visible:outline-offset-5 focus-visible:outline-ring"
          href={`/docs/layout/${item.slug}`}
          key={item.slug}
        >
          <Card className="h-full">
            <CardHeader>
              <Row gap={0} justify="between">
                <span className="font-mono text-[0.6rem] text-muted-foreground">0{index + 1}</span>
                <Badge variant="outline">{item.category}</Badge>
              </Row>
            </CardHeader>
            <CardContent>
              <LayoutSketch kind={item.slug} />
            </CardContent>
            <CardFooter className="items-start justify-between">
              <div>
                <CardTitle>{item.name}</CardTitle>
                <CardDescription>{item.tagline}</CardDescription>
              </div>
              <span className="text-lg" aria-hidden="true">
                ↗
              </span>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </Grid>
  );
}

export function SectionLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className={buttonVariants({ variant: "ghost" })}>
      {children} <HugeiconsIcon icon={ArrowRight01Icon} data-icon="inline-end" />
    </Link>
  );
}

export function FeatureCard({
  title,
  description,
  eyebrow,
}: {
  title: string;
  description: string;
  eyebrow: string;
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <Eyebrow>{eyebrow}</Eyebrow>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
