import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Callout } from "@/components/docs/callout";
import { CodeBlock } from "@/components/docs/code-block";
import { DocHeader, DocLayout, DocPagination, Section } from "@/components/docs/doc-page";
import { PropsTable } from "@/components/docs/props-table";
import { PrimitiveExamples } from "@/components/demos/layout/examples";
import { layoutImports } from "@/lib/examples/imports";
import { renderExamples } from "@/lib/examples/render";
import { pageMetadata } from "@/lib/metadata";
import { findPrimitive, primitives } from "@/lib/primitives";
import { Grid } from "@/components/ui/grid";
import { ProseList } from "@/components/docs/typography";
import { guides } from "@/lib/guides";

// Only the published primitives exist; any other slug is a static 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return primitives.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const primitive = findPrimitive(slug);
  return primitive
    ? pageMetadata({
        title: `React ${primitive.name} ${primitive.slug === "page" ? "Layout" : "Component"}`,
        description: primitive.seoDescription,
        path: `/docs/layout/${primitive.slug}`,
      })
    : { title: "Not found" };
}

const toc = [
  { id: "usage", title: "Usage" },
  { id: "examples", title: "Examples" },
  { id: "render", title: "Element" },
  { id: "api", title: "Props" },
  { id: "notes", title: "Notes" },
  { id: "compatibility", title: "Compatibility and next steps" },
];

export default async function PrimitivePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const primitive = findPrimitive(slug);
  if (!primitive) notFound();

  const usage = layoutImports(...primitive.usageImports);

  return (
    <DocLayout toc={toc}>
      <DocHeader
        eyebrow="Layout primitives"
        category={primitive.category}
        title={primitive.name}
        description={primitive.description}
        chips={["TypeScript", `Renders ${primitive.renders}`, "Accepts native props"]}
      />

      <Section
        id="usage"
        eyebrow="When to reach for it"
        title="Usage"
        lede={`${primitive.name} arranges React content with Tailwind utilities. Responsive behavior uses CSS media queries; Base UI handles element rendering without JavaScript viewport measurements.`}
      >
        <Grid gap={6} className="md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <ProseList>
            {primitive.whenToUse.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ProseList>
          <CodeBlock code={usage} title="Import" />
        </Grid>
      </Section>

      <Section
        id="examples"
        eyebrow="In practice"
        title="Examples"
        lede="Each example is a real composition with shadcn components. Switch to the Code tab for the source, or copy it directly."
      >
        <PrimitiveExamples slug={primitive.slug} />
      </Section>

      <Section
        id="render"
        eyebrow="Semantics"
        title="Rendering a different element"
        lede={`${primitive.name} renders a div by default. Pass an element to render when the markup needs a list, a landmark, or a link; the layout classes, data-slot, ref, and event handlers move onto it.`}
      >
        <CodeBlock code={renderExamples[primitive.slug]} title="render" />
      </Section>

      <Section
        id="api"
        eyebrow="Reference"
        title="Props"
        lede="Every primitive also accepts the native props of its element, including className, children, ref, and data attributes."
      >
        <PropsTable props={primitive.props} />
      </Section>

      <Section id="notes" eyebrow="Good to know" title="Notes">
        <ProseList>
          {primitive.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ProseList>
        <Callout className="mt-6" title="Layout, without the lock-in">
          These components arrange your UI. They never style content, so cards, buttons, and forms
          keep coming from shadcn and your own design system.
        </Callout>
      </Section>

      <Section
        id="compatibility"
        eyebrow="Use it in your project"
        title="Compatibility and next steps"
      >
        <ProseList>
          <li>
            Targets React 19, TypeScript, and Tailwind CSS 4. The shadcn CLI copies the source and
            installs @base-ui/react; no Layout Kit npm package is needed.
          </li>
          <li>
            The primitive provides layout, not routing, data fetching, or accessible behavior for
            interactive widgets. Choose appropriate elements and labels for your content.
          </li>
          <li>
            min-w-0 allows shrinking. Add explicit text wrapping or a scrolling region when content
            can still overflow.
          </li>
          <li>
            Use className for a one-off override, or direct Tailwind utilities when the supported
            prop values do not fit your design.
          </li>
          <li>
            <Link href="/docs/installation" className="underline underline-offset-4">
              Install from the shadcn registry
            </Link>{" "}
            and review updates before accepting changes to your local source.
          </li>
          {guides
            .filter((guide) => (guide.primitives as readonly string[]).includes(primitive.slug))
            .map((guide) => (
              <li key={guide.slug}>
                <Link href={`/docs/guides/${guide.slug}`} className="underline underline-offset-4">
                  {guide.title}: a complete example
                </Link>
              </li>
            ))}
        </ProseList>
      </Section>

      <DocPagination href={`/docs/layout/${primitive.slug}`} />
    </DocLayout>
  );
}
