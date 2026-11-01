import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { CodeBlock } from "@/components/docs/code-block";
import { DocHeader, DocLayout, DocPagination, Section } from "@/components/docs/doc-page";

export const metadata: Metadata = pageMetadata({
  title: "Principles",
  description: "The rules every Layout Kit primitive follows.",
  path: "/docs/principles",
});

const principles = [
  {
    id: "parents-own-spacing",
    eyebrow: "01",
    title: "Parents own spacing.",
    body: "Children never carry margin. The container declares one gap and every child inherits the rhythm. Moving a component to a new parent never drags stray spacing along with it.",
    code: `// Avoid: spacing lives on each child
<div>
  <Card className="mb-4" />
  <Card className="mb-4" />
</div>

// Prefer: the Stack owns the rhythm
<Stack gap={4}>
  <Card />
  <Card />
</Stack>`,
  },
  {
    id: "one-element",
    eyebrow: "02",
    title: "One element, no runtime.",
    body: "Each primitive renders a single element with utility classes. There is no measurement, no context, and nothing to hydrate. What you see in the DOM is what you wrote.",
    code: `<Row gap={2} justify="between" />
// renders
<div data-slot="row" class="flex min-w-0 flex-row flex-nowrap gap-2 items-center justify-between" />`,
  },
  {
    id: "constrained-scale",
    eyebrow: "03",
    title: "A constrained scale.",
    body: "Gap accepts 0, 1, 2, 3, 4, 6, 8, and 12. Columns accept 1 to 6 and 12. The constraint is the point: it keeps interfaces aligned without a review comment. Every scale can also change per breakpoint.",
    code: `// lib/spacing.ts — one vocabulary shared by every primitive
type Gap = 0 | 1 | 2 | 3 | 4 | 6 | 8 | 12;
type Align = "start" | "center" | "end" | "stretch" | "baseline";
type Justify = "start" | "center" | "end" | "between" | "around" | "evenly";
type Breakpoint = "base" | "sm" | "md" | "lg" | "xl" | "2xl";
type Responsive<T> = T | Partial<Record<Breakpoint, T>>;

<Stack gap={{ base: 3, md: 6 }} align={{ base: "stretch", lg: "center" }} />`,
  },
  {
    id: "native-props",
    eyebrow: "04",
    title: "Native props pass through.",
    body: "Every primitive extends the props of its element. className merges after the generated classes, so an escape hatch is always one attribute away.",
    code: `<Grid cols={3} gap={4} className="auto-rows-fr" role="list" aria-label="Plans">
  …
</Grid>`,
  },
  {
    id: "min-width-zero",
    eyebrow: "05",
    title: "Content never breaks the frame.",
    body: "Every primitive sets min-w-0, because flex and grid children otherwise refuse to shrink below their content. Long text truncates; tables scroll; the layout holds.",
    code: `<Row>
  <Col grow>
    {/* truncate works here because Col sets min-w-0 */}
    <span className="truncate">{veryLongTitle}</span>
  </Col>
</Row>`,
  },
  {
    id: "containers-and-children",
    eyebrow: "06",
    title: "Containers and children have separate jobs.",
    body: "Stack and Row are containers: they own gap, align, and justify, with exactly the same values on both axes. Col is a child: it decides how one region shares space with grow, shrink, and self. A region that needs its own rhythm nests a Stack inside a Col.",
    code: `<Row gap={4} align="start">
  <Col shrink={false} className="w-44">…</Col>
  <Col grow>
    <Stack gap={2}>…</Stack>
  </Col>
  <Col self="center">
    <Button>Save</Button>
  </Col>
</Row>`,
  },
];

export default function PrinciplesPage() {
  return (
    <DocLayout toc={principles.map((item) => ({ id: item.id, title: item.title }))}>
      <DocHeader
        eyebrow="Getting started"
        title="Principles"
        description="Six rules shape every primitive. Knowing them makes the API predictable before you read a single prop table."
      />
      {principles.map((item) => (
        <Section
          key={item.id}
          id={item.id}
          eyebrow={item.eyebrow}
          title={item.title}
          lede={item.body}
        >
          <CodeBlock code={item.code} copy={false} />
        </Section>
      ))}
      <DocPagination href="/docs/principles" />
    </DocLayout>
  );
}
