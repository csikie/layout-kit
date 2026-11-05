import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/components/docs/code-block";
import { DocHeader, DocLayout, DocPagination, Section } from "@/components/docs/doc-page";
import { surfaceClassName } from "@/components/docs/typography";
import { ProseList } from "@/components/docs/typography";
import { ProjectList } from "@/components/demos/guides/stack-row-spacing";
import { guideSource } from "@/lib/examples/guide-source";
import { guides } from "@/lib/guides";
import { pageMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Manage React Spacing with Stack and Row",
  description: guides[1].description,
  path: "/docs/guides/stack-row-spacing",
});

const toc = [
  { id: "setup", title: "Install Stack, Row, and Col" },
  { id: "ownership", title: "Let the parent own spacing" },
  { id: "example", title: "Complete project list" },
  { id: "limits", title: "Wrapping and semantics" },
];

export default function SpacingGuidePage() {
  return (
    <DocLayout toc={toc}>
      <DocHeader
        eyebrow="Guide"
        title="Manage spacing with Stack and Row"
        description="Give vertical and horizontal groups one spacing owner. Use Col for flexible children, a responsive gap for changing density, and render for meaningful HTML."
        chips={["Parent-owned gaps", "CSS flexbox", "Semantic lists"]}
      />
      <Section
        id="setup"
        eyebrow="01 / Prerequisites"
        title="Install Stack, Row, and Col"
        lede="Use a React 19 and TypeScript project with Tailwind CSS 4 and shadcn/ui configured. After registering @layout-kit, add just these three primitives; the CLI resolves their shared spacing source and Base UI dependency."
      >
        <CodeBlock
          lang="bash"
          title="Terminal"
          code="npx shadcn@latest add @layout-kit/stack @layout-kit/row @layout-kit/col"
        />
        <p className="mt-4 text-sm leading-relaxed">
          Start with{" "}
          <Link href="/docs/installation" className="underline underline-offset-4">
            registry installation
          </Link>{" "}
          if the namespace is not configured. The example uses plain text and requires no additional
          shadcn components or event handlers.
        </p>
      </Section>
      <Section
        id="ownership"
        eyebrow="02 / The spacing model"
        title="Let the parent own spacing"
        lede="Stack is a vertical flex container; Row is a horizontal flex container. Both own gap, align, and justify. Put spacing on the container instead of giving each child a bottom or right margin."
      >
        <ProseList>
          <li>
            Use an outer Stack for the heading and list, then another Stack for the list items. Each
            gap describes one relationship.
          </li>
          <li>
            Use Row to put a project’s details beside its status. Col with grow lets the details
            fill spare horizontal space.
          </li>
          <li>
            Col does not space its own children. Nest a Stack inside it to separate the title from
            the description.
          </li>
          <li>
            Gap supports 0, 1, 2, 3, 4, 6, 8, and 12 on the Tailwind scale. A value of 4 corresponds
            to 1rem with Tailwind’s default spacing.
          </li>
        </ProseList>
      </Section>
      <Section
        id="example"
        eyebrow="03 / Copy and adapt"
        title="Complete project list"
        lede="The outer gap increases from 4 to 6 at md. Individual rows can wrap, and a flex basis gives the description room before the status moves to the next line."
      >
        <div className={cn(surfaceClassName, "p-6")}>
          <ProjectList />
        </div>
        <CodeBlock
          className="mt-6"
          code={guideSource("stack-row-spacing")}
          title="components/project-list.tsx"
        />
      </Section>
      <Section id="limits" eyebrow="04 / Details that matter" title="Wrapping and semantics">
        <ProseList>
          <li>
            Row does not wrap by default. Pass wrap when its children may no longer fit; this is CSS
            flex-wrap, not a JavaScript width check.
          </li>
          <li>
            Stack renders the ul and each Row renders an li. Visual layout alone does not create
            list semantics.
          </li>
          <li>
            All primitives set min-w-0. Long unbroken content still needs an explicit wrapping,
            truncation, or scrolling strategy.
          </li>
          <li>
            align works across the flex axis and justify along it. Their visual directions change
            between Stack and Row.
          </li>
          <li>
            A partial responsive map only emits its specified classes. Include base when you need an
            explicit small-screen value.
          </li>
        </ProseList>
        <p className="mt-5 text-sm leading-relaxed">
          Use direct Tailwind classes for an isolated layout or a value outside the supported scale.
          Layout Kit is useful when repeated arrangements benefit from shared typed props. See{" "}
          <Link href="/docs/layout/stack" className="underline underline-offset-4">
            Stack
          </Link>
          ,{" "}
          <Link href="/docs/layout/row" className="underline underline-offset-4">
            Row
          </Link>
          , and{" "}
          <Link href="/docs/layout/col" className="underline underline-offset-4">
            Col
          </Link>{" "}
          for the complete API.
        </p>
      </Section>
      <DocPagination href="/docs/guides/stack-row-spacing" />
    </DocLayout>
  );
}
