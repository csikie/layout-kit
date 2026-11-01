import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { CodeBlock } from "@/components/docs/code-block";
import { DocHeader, DocLayout, DocPagination, Section } from "@/components/docs/doc-page";
import { Preview } from "@/components/docs/preview";
import {
  DashboardPatternDemo,
  DetailPatternDemo,
  SettingsPatternDemo,
} from "@/components/demos/patterns/pattern-demos";
import { dashboardPattern, detailPattern, settingsPattern } from "@/lib/examples/patterns";

export const metadata: Metadata = pageMetadata({
  title: "Patterns",
  description: "Full screens composed from the layout primitives and shadcn components.",
  path: "/docs/patterns",
});

const patterns = [
  {
    id: "dashboard",
    eyebrow: "Pattern 01",
    title: "Analytics dashboard",
    lede: "A wide Page with a stat grid and a two-thirds chart. Grid handles the responsive column count; GridItem gives the chart its span.",
    source: dashboardPattern,
    Demo: DashboardPatternDemo,
  },
  {
    id: "settings",
    eyebrow: "Pattern 02",
    title: "Settings page",
    lede: "A medium Page keeps forms readable. Stack spaces the cards, Grid pairs fields, and Row aligns each setting with its control.",
    source: settingsPattern,
    Demo: SettingsPatternDemo,
  },
  {
    id: "detail",
    eyebrow: "Pattern 03",
    title: "Record detail with summary rail",
    lede: "Page.Body places the summary aside first on large screens and stacks it above the tabs on small ones. The content column never fights the rail for width.",
    source: detailPattern,
    Demo: DetailPatternDemo,
  },
];

export default function PatternsPage() {
  return (
    <DocLayout toc={patterns.map((item) => ({ id: item.id, title: item.title }))}>
      <DocHeader
        eyebrow="Patterns"
        title="Compositions"
        description="Three screens you will build in most products, assembled from the primitives. Copy the source and replace the fixtures with your data."
        chips={["Page", "Grid + GridItem", "Row + Col", "Stack"]}
      />
      {patterns.map(({ id, eyebrow, title, lede, source, Demo }) => (
        <Section key={id} id={id} eyebrow={eyebrow} title={title} lede={lede}>
          <Preview
            padding="none"
            badge="Live"
            source={source}
            code={<CodeBlock code={source} copy={false} />}
          >
            <Demo />
          </Preview>
        </Section>
      ))}
      <DocPagination href="/docs/patterns" />
    </DocLayout>
  );
}
