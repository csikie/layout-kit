import type { Metadata } from "next";
import Link from "next/link";
import { Callout } from "@/components/docs/callout";
import { CodeBlock } from "@/components/docs/code-block";
import { DocHeader, DocLayout, DocPagination, Section } from "@/components/docs/doc-page";
import { surfaceClassName } from "@/components/docs/typography";
import { ProseList } from "@/components/docs/typography";
import { ResponsiveDashboard } from "@/components/demos/guides/responsive-dashboard";
import { guideSource } from "@/lib/examples/guide-source";
import { guides } from "@/lib/guides";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Build a Responsive React Dashboard",
  description: guides[0].description,
  path: "/docs/guides/responsive-dashboard",
});

const toc = [
  { id: "setup", title: "Install the components" },
  { id: "layout", title: "Plan the responsive grid" },
  { id: "example", title: "Complete example" },
  { id: "verify", title: "Check the result" },
];

export default function DashboardGuidePage() {
  return (
    <DocLayout toc={toc}>
      <DocHeader
        eyebrow="Guide"
        title="Build a responsive React dashboard"
        description="Use Grid for mobile-first columns, GridItem for a wider content region, and shadcn cards for the content. CSS handles every breakpoint."
        chips={["React 19", "Tailwind CSS 4", "shadcn/ui"]}
      />
      <Section
        id="setup"
        eyebrow="01 / Prerequisites"
        title="Install the components"
        lede="Start with a React 19 and TypeScript project configured for Tailwind CSS 4 and shadcn/ui. Register @layout-kit using the installation guide, then add the layout bundle and cards."
      >
        <CodeBlock
          lang="bash"
          title="Terminal"
          code={`npx shadcn@latest add @layout-kit/layout
npx shadcn@latest add card`}
        />
        <p className="mt-4 text-sm leading-relaxed">
          The CLI copies source into your project and installs Base UI for the layout primitives.
          Follow{" "}
          <Link href="/docs/installation" className="underline underline-offset-4">
            the installation guide
          </Link>{" "}
          for registry setup and aliases. This example needs no charting library, API, router, or
          client-side state.
        </p>
      </Section>
      <Section
        id="layout"
        eyebrow="02 / Layout decisions"
        title="Plan the responsive grid"
        lede="Begin with one column so cards remain readable on a phone. Increase the metric grid to two columns at sm and three at lg. Responsive maps use Tailwind’s default media-query breakpoints."
      >
        <ProseList>
          <li>
            <code>cols={"{{ base: 1, sm: 2, lg: 3 }}"}</code> gives the metrics one, two, and three
            columns at 0, 640px, and 1024px with the default root font size.
          </li>
          <li>
            The second Grid stays at one column until lg. Its primary region spans two of three
            columns only at lg.
          </li>
          <li>
            GridItem’s base span stays at one. A span of two inside a one-column grid would create
            an unintended implicit track.
          </li>
          <li>
            Stack owns the space between the metric grid and the detail grid; cards do not need
            bottom margins.
          </li>
        </ProseList>
      </Section>
      <Section
        id="example"
        eyebrow="03 / Copy and adapt"
        title="Complete example"
        lede="The preview and the source below use the same component. Replace the sample metrics with your data; the layout does not own fetching, loading, or error handling."
      >
        <div className={surfaceClassName}>
          <ResponsiveDashboard titleAs="h2" />
        </div>
        <CodeBlock
          className="mt-6"
          code={guideSource("responsive-dashboard")}
          title="components/order-dashboard.tsx"
        />
        <Callout className="mt-6" title="One page heading">
          The component defaults to h1 for a standalone screen. This documentation preview passes
          titleAs="h2" because the guide already has its own h1.
        </Callout>
      </Section>
      <Section id="verify" eyebrow="04 / Verification" title="Check the result">
        <ProseList>
          <li>
            Resize below sm, between sm and lg, and above lg. Check both column counts and the
            primary region’s span.
          </li>
          <li>
            Try long metric labels and realistic localized values. min-w-0 allows shrinking but does
            not truncate text or make a wide table scroll automatically.
          </li>
          <li>
            Check at 200% zoom. Charts and tables you add later need their own accessible names and
            overflow treatment.
          </li>
          <li>
            Keep reading order meaningful: this example never rearranges the DOM to match a visual
            position.
          </li>
        </ProseList>
        <p className="mt-5 text-sm leading-relaxed">
          See{" "}
          <Link href="/docs/layout/grid" className="underline underline-offset-4">
            Grid props
          </Link>
          ,{" "}
          <Link href="/docs/layout/grid-item" className="underline underline-offset-4">
            GridItem spans
          </Link>
          , and{" "}
          <Link href="/docs/guides/page-layout" className="underline underline-offset-4">
            the page sidebar guide
          </Link>{" "}
          to extend this screen. Direct Tailwind utilities remain a good fit for a one-off layout
          that does not need a shared prop vocabulary.
        </p>
      </Section>
      <DocPagination href="/docs/guides/responsive-dashboard" />
    </DocLayout>
  );
}
