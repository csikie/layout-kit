import type { Metadata } from "next";
import Link from "next/link";
import { Callout } from "@/components/docs/callout";
import { CodeBlock } from "@/components/docs/code-block";
import { DocHeader, DocLayout, DocPagination, Section } from "@/components/docs/doc-page";
import { surfaceClassName } from "@/components/docs/typography";
import { ProseList } from "@/components/docs/typography";
import { ProjectPage } from "@/components/demos/guides/page-layout";
import { guideSource } from "@/lib/examples/guide-source";
import { guides } from "@/lib/guides";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Build a React Page Layout with a Sidebar",
  description: guides[2].description,
  path: "/docs/guides/page-layout",
});

const toc = [
  { id: "setup", title: "Install the page frame" },
  { id: "regions", title: "Choose the page regions" },
  { id: "example", title: "Complete example" },
  { id: "accessibility", title: "Headings and reading order" },
];

export default function PageLayoutGuidePage() {
  return (
    <DocLayout toc={toc}>
      <DocHeader
        eyebrow="Guide"
        title="Build a page with actions and a sidebar"
        description="Compose Page.Header, Page.Actions, and Page.Body into a React detail screen. Keep the content first in reading order while the summary moves beside it at larger widths."
        chips={["Responsive aside", "Content-first DOM", "Native anchor action"]}
      />
      <Section
        id="setup"
        eyebrow="01 / Prerequisites"
        title="Install the page frame"
        lede="Start with React 19, TypeScript, Tailwind CSS 4, and an initialized shadcn project. Register the @layout-kit namespace, then install Page, Stack, and the shadcn card and button components."
      >
        <CodeBlock
          lang="bash"
          title="Terminal"
          code={`npx shadcn@latest add @layout-kit/page @layout-kit/stack
npx shadcn@latest add card button`}
        />
        <p className="mt-4 text-sm leading-relaxed">
          The{" "}
          <Link href="/docs/installation" className="underline underline-offset-4">
            installation guide
          </Link>{" "}
          covers aliases and registry setup. This example uses buttonVariants to style an actual
          in-page link; it needs no router, backend, or save handler.
        </p>
      </Section>
      <Section
        id="regions"
        eyebrow="02 / Composition"
        title="Choose the page regions"
        lede="Page constrains width and adds gutters. Page.Header provides a title, description, and action area. Page.Body holds the main region and an optional labeled aside."
      >
        <ProseList>
          <li>Use size="lg" for the outer frame, with the default maximum width of 80rem.</li>
          <li>
            The sm aside width is 16rem. asideBreakpoint="lg" places it beside the content from
            Tailwind’s lg breakpoint.
          </li>
          <li>
            asideCollapse="stack" puts the summary after the content below lg. Choose hide only for
            genuinely redundant information.
          </li>
          <li>
            asidePosition="start" can move the summary to the left on large screens while the DOM
            remains content-first.
          </li>
        </ProseList>
      </Section>
      <Section
        id="example"
        eyebrow="03 / Copy and adapt"
        title="Complete example"
        lede="The action navigates to the delivery checklist. Replace the sample brief and summary with your own content, and give each instance unique fragment IDs if you render several on one page."
      >
        <div className={surfaceClassName}>
          <ProjectPage titleAs="h2" />
        </div>
        <CodeBlock
          className="mt-6"
          code={guideSource("page-layout")}
          title="components/project-page.tsx"
        />
      </Section>
      <Section id="accessibility" eyebrow="04 / Semantics" title="Headings and reading order">
        <ProseList>
          <li>
            The standalone component defaults to an h1; the preview passes h2 to preserve the
            guide’s own h1.
          </li>
          <li>
            Page renders a div by default. Place it inside your application’s main landmark; do not
            create a second main for a nested screen.
          </li>
          <li>
            Page.Header also renders a div. Use render only when a different element is appropriate
            for your document structure.
          </li>
          <li>
            Page.Body renders a labeled aside after the content. Visual placement never changes
            screen-reader or keyboard reading order.
          </li>
          <li>
            Test the anchor with a keyboard and zoom to 200%. Keep all essential information
            available when the aside stacks.
          </li>
        </ProseList>
        <Callout className="mt-6" title="A page frame, not an application shell">
          Page does not implement routing, a collapsible navigation sidebar, authentication, or data
          loading. Use your application shell for those concerns and Page for the screen inside it.
        </Callout>
        <p className="mt-5 text-sm leading-relaxed">
          Continue with{" "}
          <Link href="/docs/layout/page" className="underline underline-offset-4">
            the full Page API
          </Link>{" "}
          or{" "}
          <Link href="/docs/guides/responsive-dashboard" className="underline underline-offset-4">
            add a responsive dashboard grid
          </Link>
          .
        </p>
      </Section>
      <DocPagination href="/docs/guides/page-layout" />
    </DocLayout>
  );
}
