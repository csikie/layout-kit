import type { Metadata } from "next";
import { CodeBlock } from "@/components/docs/code-block";
import { Preview } from "@/components/docs/preview";
import { Section } from "@/components/docs/doc-page";
import {
  FeatureCard,
  HeroActions,
  HeroBadges,
  PrimitiveCards,
  SectionLink,
} from "@/components/demos/overview-demos";
import { DashboardPatternDemo } from "@/components/demos/patterns/pattern-demos";
import { dashboardPattern } from "@/lib/examples/patterns";
import { Row } from "@/components/ui/row";
import { Stack } from "@/components/ui/stack";
import { enterAnimation } from "@/components/docs/typography";
import { cn } from "@/lib/utils";

import { layoutImports, uiImport } from "@/lib/examples/imports";
import { pageMetadata } from "@/lib/metadata";
import { Grid } from "@/components/ui/grid";
import { ProseList } from "@/components/docs/typography";
import { author, repositoryUrl } from "@/lib/site";

export const metadata: Metadata = pageMetadata({ path: "/" });

const quickStart = `${layoutImports("Grid", "Page", "Stack")}
${uiImport("card", "Card", "CardContent")}

export function Dashboard() {
  return (
    <Page size="xl">
      <Page.Header title="Dashboard" description="Everything, at a glance." />
      <Page.Body>
        <Stack gap={6}>
          <Grid cols={{ base: 1, sm: 2, lg: 4 }} gap={4}>
            {stats.map((stat) => (
              <Card key={stat.label}>
                <CardContent>{stat.value}</CardContent>
              </Card>
            ))}
          </Grid>
        </Stack>
      </Page.Body>
    </Page>
  );
}`;

/** Decorative sketch of a composed page: header, sidebar column, cards, and footer. */
function Blueprint() {
  return (
    <div
      aria-label="Illustration of a composed layout"
      className="relative hidden -rotate-[2.5deg] rounded-2xl border bg-muted bg-[radial-gradient(var(--border)_0.8px,transparent_0.8px)] bg-size-[14px_14px] p-6 transition-transform duration-350 hover:rotate-0 min-[72rem]:block"
    >
      <Row
        justify="between"
        className="mb-6 font-mono text-[0.6rem] tracking-[0.07em] text-muted-foreground"
      >
        <span>Composition / 001</span>
        <span>↗</span>
      </Row>
      <Stack className="gap-[0.9rem] rounded-[0.45rem] border border-foreground bg-background p-4 shadow-[7px_7px_0_color-mix(in_oklch,var(--foreground),transparent_92%)]">
        <Row justify="between">
          <span className="block h-[0.65rem] w-[45%] rounded-[2px] bg-foreground" />
          <span className="block h-[1.1rem] w-[18%] rounded-[2px] bg-primary" />
        </Row>
        <Grid gap={3} className="min-h-40 grid-cols-[0.7fr_2fr]">
          <Stack gap={2} className="rounded-[0.25rem] border border-dashed p-[0.65rem]">
            <span className="h-[0.6rem] rounded-[2px] bg-primary" />
            <span className="h-[0.6rem] rounded-[2px] bg-muted" />
            <span className="h-[0.6rem] rounded-[2px] bg-muted" />
          </Stack>
          <Grid cols={2} className="gap-[0.65rem]">
            <span className="rounded-[0.25rem] border border-primary-foreground bg-primary" />
            <span className="rounded-[0.25rem] border bg-muted" />
            <span className="rounded-[0.25rem] border bg-muted" />
            <span className="rounded-[0.25rem] border bg-muted" />
          </Grid>
        </Grid>
        <Row justify="between">
          <span className="h-[0.4rem] w-1/4 bg-border" />
          <span className="h-[0.4rem] w-[12%] bg-border" />
        </Row>
      </Stack>
      <Row justify="between" className="mt-6 text-[0.6rem] text-muted-foreground">
        <span>
          <i className="mr-[0.3rem] inline-block size-[0.4rem] rounded-full bg-sidebar-primary" />{" "}
          Simple pieces.
        </span>
        <span>Endless possibilities.</span>
      </Row>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <section aria-labelledby="hero-heading" className={cn("pt-10 sm:pt-14", enterAnimation)}>
        <HeroBadges />
        <Grid
          gap={0}
          align="center"
          className="pt-6 pb-12 sm:gap-10 sm:pt-10 min-[72rem]:grid-cols-[1.2fr_1fr]"
        >
          <div>
            <h1
              id="hero-heading"
              className="text-[clamp(2.6rem,11vw,4.2rem)] leading-none font-medium tracking-[-0.065em] sm:text-[clamp(3rem,5.6vw,6rem)]"
            >
              Good layouts.
              <br />
              <em className="font-serif font-normal italic">Less guesswork.</em>
            </h1>
            <p className="mt-6 max-w-120 text-[0.96rem] leading-[1.8] text-muted-foreground">
              Typed React layout primitives for shadcn/ui and Tailwind CSS. Build responsive screens
              with Stack, Row, Col, Grid, GridItem, and Page. Install from the shadcn registry and
              own the TypeScript source in your project.
            </p>
            <HeroActions />
          </div>
          <Blueprint />
        </Grid>
        <Row
          justify="between"
          className="border-b pb-6 font-mono text-[0.6rem] tracking-[0.07em] text-muted-foreground"
        >
          <span>01 / The big picture</span>
          <span className="hidden sm:inline">Built on Tailwind. Designed for composition.</span>
        </Row>
      </section>

      <Section
        id="why"
        eyebrow="Why a layout kit"
        title="Spacing decisions, made once."
        lede="Utility classes are great for one-off tweaks and terrible for consistency. Layout Kit moves the recurring decisions, gap scale, alignment, column counts, and page width, into typed props with sensible defaults."
      >
        <Grid cols={{ base: 1, md: 3 }}>
          <FeatureCard
            eyebrow="Typed"
            title="A constrained scale"
            description="Gap uses eight Tailwind spacing values from 0 to 12; columns use 1 to 6 or 12. TypeScript checks your choices before they reach the screen."
          />
          <FeatureCard
            eyebrow="Responsive"
            title="Breakpoint maps"
            description="gap, align, justify, cols, and span all take { base, sm, md, lg, xl, 2xl } maps. Every generated class is written out, so Tailwind always ships it."
          />
          <FeatureCard
            eyebrow="CSS layouts"
            title="Just class names"
            description="Responsive layouts use Tailwind utilities and CSS media queries. Base UI handles element rendering; no JavaScript viewport measurements are needed."
          />
        </Grid>
      </Section>

      <Section
        id="components"
        eyebrow="Your building blocks"
        title="Six primitives. A common language."
        aside={<SectionLink href="/docs/layout/stack">Start with Stack</SectionLink>}
      >
        <PrimitiveCards />
      </Section>

      <Section
        id="quick-start"
        eyebrow="Quick start"
        title="From import to a page in one file."
        lede="Add the registry, pull in the primitives with the shadcn CLI, and place shadcn components inside them."
        aside={<SectionLink href="/docs/installation">Installation guide</SectionLink>}
      >
        <CodeBlock code={quickStart} title="app/dashboard/page.tsx" />
      </Section>

      <Section
        id="composition"
        eyebrow="Better together"
        title="From primitives to a whole screen."
        lede="A dashboard built from Page, Stack, Grid, GridItem, Row, and Col. Resize the window to see the column maps respond."
        aside={<SectionLink href="/docs/patterns">All patterns</SectionLink>}
      >
        <Preview
          padding="none"
          badge="Live"
          source={dashboardPattern}
          code={<CodeBlock code={dashboardPattern} copy={false} />}
        >
          <DashboardPatternDemo />
        </Preview>
      </Section>

      <Section id="fit" eyebrow="Choose your tools" title="When Layout Kit fits">
        <Grid cols={{ base: 1, md: 2 }} gap={6}>
          <div>
            <h3 className="mb-3 text-lg font-medium">
              A shared vocabulary for application screens
            </h3>
            <ProseList>
              <li>
                Use it for dashboards, forms, settings, and detail pages with recurring spacing.
              </li>
              <li>Keep shadcn/ui for buttons, cards, and inputs; use the kit to arrange them.</li>
              <li>Choose typed responsive props when a team needs consistent layout decisions.</li>
            </ProseList>
          </div>
          <div>
            <h3 className="mb-3 text-lg font-medium">Keep direct Tailwind when it is simpler</h3>
            <ProseList>
              <li>One-off layouts can stay as utility classes without an additional component.</li>
              <li>The kit does not provide a router, data fetching, or a full design system.</li>
              <li>Its source targets React 19 and Tailwind CSS 4, and depends on Base UI.</li>
            </ProseList>
          </div>
        </Grid>
      </Section>

      <Section id="guides" eyebrow="Build something real" title="From a task to a working layout">
        <Stack gap={2} align="start">
          <SectionLink href="/docs/guides/responsive-dashboard">
            Build a responsive React dashboard
          </SectionLink>
          <SectionLink href="/docs/guides/stack-row-spacing">
            Manage spacing with Stack and Row
          </SectionLink>
          <SectionLink href="/docs/guides/page-layout">
            Compose a page with actions and a sidebar
          </SectionLink>
        </Stack>
        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
          Open source under the MIT license, maintained by{" "}
          <a href={author.url} className="underline underline-offset-4">
            {author.name}
          </a>
          .{" "}
          <a href={repositoryUrl} className="underline underline-offset-4">
            Read the source, releases, and issues on GitHub
          </a>
          .
        </p>
      </Section>
    </>
  );
}
