import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Callout } from "@/components/docs/callout";
import { CodeBlock } from "@/components/docs/code-block";
import { DocHeader, DocLayout, DocPagination, Section } from "@/components/docs/doc-page";
import { PropsTable } from "@/components/docs/props-table";
import { PrimitiveExamples } from "@/components/demos/layout/examples";
import { layoutImports } from "@/lib/examples/imports";
import { pageMetadata } from "@/lib/metadata";
import { findPrimitive, primitives } from "@/lib/primitives";
import { Grid } from "@/components/ui/grid";
import { ProseList } from "@/components/docs/typography";

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
        title: primitive.name,
        description: primitive.description,
        path: `/docs/layout/${primitive.slug}`,
      })
    : { title: "Not found" };
}

const toc = [
  { id: "usage", title: "Usage" },
  { id: "examples", title: "Examples" },
  { id: "api", title: "Props" },
  { id: "notes", title: "Notes" },
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
        lede={`${primitive.name} is a thin wrapper over Tailwind utilities, so it costs nothing at runtime and composes with every other primitive.`}
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

      <DocPagination href={`/docs/layout/${primitive.slug}`} />
    </DocLayout>
  );
}
