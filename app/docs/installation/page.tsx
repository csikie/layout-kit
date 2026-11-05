import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { Callout } from "@/components/docs/callout";
import { CodeBlock } from "@/components/docs/code-block";
import { DocHeader, DocLayout, DocPagination, Section } from "@/components/docs/doc-page";
import { PropsTable } from "@/components/docs/props-table";
import registry from "@/registry.json";
import { registryNamespace, siteUrl } from "@/lib/site";
import { layoutImports, uiImport } from "@/lib/examples/imports";
import { ProseList } from "@/components/docs/typography";

export const metadata: Metadata = pageMetadata({
  title: "Install with the shadcn CLI",
  description:
    "Install Layout Kit in a React 19 and Tailwind CSS 4 project. Configure the shadcn registry, add typed layout components, and customize your source.",
  path: "/docs/installation",
});

const registryUrl = `${siteUrl}/r/{name}.json`;

const steps = [
  {
    id: "step-registry",
    title: "Register the namespace",
    description:
      "Add the Layout Kit registry to the components.json of any project that already runs shadcn. The namespace lets the CLI resolve items and their dependencies from this site.",
    lang: "json" as const,
    file: "components.json",
    code: `{
  "registries": {
    "${registryNamespace}": "${registryUrl}"
  }
}`,
  },
  {
    id: "step-add",
    title: "Add the primitives",
    description:
      "Install everything with the layout bundle, or pick individual items. The CLI copies the source into your ui and lib folders and rewrites imports to your aliases.",
    lang: "bash" as const,
    file: "Terminal",
    code: `# Everything: Stack, Row, Col, Grid, GridItem, Page
npx shadcn@latest add ${registryNamespace}/layout

# Or only what you need
npx shadcn@latest add ${registryNamespace}/page ${registryNamespace}/grid`,
  },
  {
    id: "step-compose",
    title: "Compose your first layout",
    description:
      "Import from the files the CLI created and place shadcn components inside them. Tailwind picks the classes up from your own source tree, so there is nothing else to configure.",
    lang: "tsx" as const,
    file: "app/page.tsx",
    code: `${layoutImports("Row", "Stack")}
${uiImport("button", "Button")}

export default function Page() {
  return (
    <Stack gap={6}>
      <h1 className="text-2xl font-semibold tracking-tight">Your next idea</h1>
      <Row gap={2} wrap>
        <Button>Get started</Button>
        <Button variant="outline">Learn more</Button>
      </Row>
    </Stack>
  );
}`,
  },
];

// Generated from registry.json so the table never drifts from what the CLI installs.
const items = registry.items.map((item) => ({
  name: `${registryNamespace}/${item.name}`,
  type: item.files.length === 0 ? "bundle" : item.type,
  description: item.description,
}));

const toc = [
  ...steps.map((step) => ({ id: step.id, title: step.title })),
  { id: "items", title: "Registry items" },
  { id: "requirements", title: "Requirements" },
];

export default function InstallationPage() {
  return (
    <DocLayout toc={toc}>
      <DocHeader
        eyebrow="Getting started"
        title="Installation"
        description="Layout Kit ships as a shadcn registry. Three steps from an existing shadcn project to a well-composed interface."
        chips={["shadcn registry", "Tailwind CSS 4", "React 19"]}
      />
      {steps.map((step, index) => (
        <Section
          key={step.id}
          id={step.id}
          eyebrow={`Step 0${index + 1}`}
          title={step.title}
          lede={step.description}
        >
          <CodeBlock code={step.code} lang={step.lang} title={step.file} />
        </Section>
      ))}
      <Section
        id="items"
        eyebrow="Reference"
        title="Registry items"
        lede="Every item is published from this site. The raw JSON for each one lives at the URL pattern configured above."
      >
        <PropsTable props={items} />
      </Section>
      <Section id="requirements" eyebrow="Environment" title="Requirements">
        <ProseList>
          <li>
            An existing shadcn setup with a components.json and a cn helper in your utils alias.
          </li>
          <li>
            Tailwind CSS 4. The primitives are plain utility classes and need no plugin or preset.
          </li>
          <li>React 19 and TypeScript. The primitives use the React 19 ref-as-prop model.</li>
          <li>The CLI installs @base-ui/react, used by the primitives for element rendering.</li>
          <li>
            No specific router is required. Examples use the default @/components/ui alias; your
            shadcn configuration controls the installed paths.
          </li>
        </ProseList>
        <Callout className="mt-6" title="Your code, not a dependency">
          The registry copies MIT-licensed source files into your project. There is no Layout Kit
          npm package. Edit the files freely; review the CLI diff before accepting updates so local
          customizations are preserved.
        </Callout>
      </Section>
      <DocPagination href="/docs/installation" />
    </DocLayout>
  );
}
