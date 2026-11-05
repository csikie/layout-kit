import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { Callout } from "@/components/docs/callout";
import { CodeBlock } from "@/components/docs/code-block";
import { DocHeader, DocLayout, DocPagination, Section } from "@/components/docs/doc-page";
import { Preview } from "@/components/docs/preview";
import { PropsTable } from "@/components/docs/props-table";
import { BreadcrumbDemo } from "@/components/demos/breadcrumb/breadcrumb-demo";
import { BreadcrumbContextDemo } from "@/components/demos/breadcrumb/context-demo";
import { ManualBreadcrumbDemo } from "@/components/demos/breadcrumb/manual-demo";
import { uiImport } from "@/lib/examples/imports";
import type { PropDefinition } from "@/lib/primitives";
import { Stack } from "@/components/ui/stack";
import { Lede } from "@/components/docs/typography";

export const metadata: Metadata = pageMetadata({
  title: "React Breadcrumb with Route-Aware Labels",
  description:
    "Create accessible React breadcrumb navigation with dynamic route labels, responsive overflow, and an optional context provider. Explore live examples.",
  path: "/docs/breadcrumb",
});

const routeCode = `import Link from "next/link";
import { usePathname } from "next/navigation";
${uiImport("app-breadcrumb", "AppBreadcrumb", "type BreadcrumbRoute")}

type RouteData = { project: { name: string } };

const routes: BreadcrumbRoute<RouteData>[] = [
  { path: "/", label: "Home" },
  { path: "/projects", label: "Projects" },
  {
    path: "/projects/:projectId",
    label: ({ data }) => data?.project.name,
    fallbackLabel: "Project unavailable",
  },
];

export function Header({ project, isLoading }) {
  const pathname = usePathname();
  return (
    <AppBreadcrumb
      pathname={pathname}
      routes={routes}
      data={{ project }}
      loading={isLoading}
      maxVisibleItems={5}
      compactMaxVisibleItems={3}
      renderLink={({ href, children }) => <Link href={href}>{children}</Link>}
    />
  );
}`;

const contextCode = `// Layout: scope identifies the active route instance.
<BreadcrumbProvider scope={routeKey} pathname={pathname} routes={routes}>
  <header><ContextBreadcrumb /></header>
  {children}
</BreadcrumbProvider>

// A deeply nested page publishes a full trail, or only the labels it knows.
usePageBreadcrumbs({ scope: routeKey, routeLabels: { project: project.name } });
// Or: usePageBreadcrumbs({ scope: routeKey, items });`;

const manualCode = `<AppBreadcrumb
  separator="/"
  items={[
    { id: "docs", label: "Docs", href: "/" },
    { id: "shared", label: "Shared UI", href: "/docs/breadcrumb" },
    { id: "breadcrumb", label: "Breadcrumb" },
  ]}
/>`;

const hierarchyCode = `// A hierarchy that differs from URL nesting.
{ id: "project", path: "/projects/:projectId", label: projectLabel }
{ path: "/reports/:projectId/weekly", parentId: "project", label: "Weekly report" }

// Skip a level but keep its ancestors.
{ path: "/workspace", label: "Workspace", hidden: true }

// Start a new hierarchy; no URL ancestors are rendered.
{ path: "/admin", label: "Admin", parentId: null }

// Resolve without rendering, for a custom view.
const items = resolveBreadcrumbs({ pathname, routes, data });`;

const routeProps: PropDefinition[] = [
  {
    name: "path",
    type: "string",
    description: "Pattern with static segments, :params, and a terminal *catchAll.",
  },
  {
    name: "label",
    type: "ReactNode | (context) => ReactNode",
    description:
      "Static text or a synchronous resolver receiving params, data, pathname, and path.",
  },
  {
    name: "id",
    type: "string",
    defaultValue: "path",
    description: "Referenced by parentId to build custom hierarchies.",
  },
  {
    name: "parentId",
    type: "string | null",
    description: "undefined follows URL prefixes; null starts a new hierarchy.",
  },
  {
    name: "hidden",
    type: "boolean",
    defaultValue: "false",
    description: "Skip this level but keep its ancestors.",
  },
  {
    name: "href",
    type: "string | null | (context) => string | null",
    description: "Override the navigable URL. null renders a non-navigable ancestor.",
  },
  {
    name: "loadingLabel",
    type: "ReactNode",
    description: "Shown while loading applies to a function label.",
  },
  {
    name: "fallbackLabel",
    type: "ReactNode",
    description: "Shown when a function label returns nothing.",
  },
];

const appearanceProps: PropDefinition[] = [
  { name: "pathname", type: "string", description: "The current location from your router." },
  {
    name: "routes",
    type: "BreadcrumbRoute<TData>[]",
    description: "Route patterns to resolve against.",
  },
  { name: "data", type: "TData", description: "Loaded data passed to label and href resolvers." },
  {
    name: "loading",
    type: "boolean",
    description: "Marks function labels pending. Static labels stay visible.",
  },
  {
    name: "unknown",
    type: '"format" | "omit" | "error" | (context) => ReactNode',
    defaultValue: '"format"',
    description: "Policy for segments with no matching route.",
  },
  {
    name: "items",
    type: "BreadcrumbEntry[]",
    description: "Manual trail. Mutually exclusive with pathname and routes.",
  },
  {
    name: "maxVisibleItems",
    type: "number",
    defaultValue: "5",
    description: "Visible slots including the overflow trigger. Minimum 3.",
  },
  {
    name: "compactMaxVisibleItems",
    type: "number",
    defaultValue: "3",
    description: "Visible slots below 768px.",
  },
  { name: "separator", type: "ReactNode", description: "Rendered between items." },
  {
    name: "renderLink",
    type: "({ href, children, item }) => ReactElement",
    description: "Use your router's Link.",
  },
  {
    name: "labels",
    type: "Partial<BreadcrumbLabels>",
    description: "Accessible names and fallback strings.",
  },
];

const toc = [
  { id: "sandbox", title: "Path sandbox" },
  { id: "routes", title: "Route metadata" },
  { id: "context", title: "Layout + page" },
  { id: "manual", title: "Manual items" },
  { id: "api", title: "Props" },
];

export default function BreadcrumbPage() {
  return (
    <DocLayout toc={toc}>
      <DocHeader
        eyebrow="Shared UI"
        category="Navigation"
        title="Breadcrumb"
        description="A path with context. Resolve route patterns, name dynamic resources, and keep long journeys within reach."
        chips={["Automatic routes", "Custom hierarchy", "Responsive overflow"]}
      />

      <Section
        id="sandbox"
        eyebrow="Follow the path"
        title="One trail. Your application's rules."
        lede="Pick a scenario and change the data state, unknown-segment policy, and visible slots. The breadcrumb in this site's top bar is the same component resolving the real pathname."
      >
        <BreadcrumbDemo />
      </Section>

      <Section
        id="routes"
        eyebrow="Route metadata"
        title="Names belong to your data."
        lede="Read pathname from your router and use its Link in renderLink. Label functions are synchronous; loading and missing-data labels are explicit. API calls, caching, permissions, and translations stay in your application."
      >
        <Stack gap={6}>
          <CodeBlock code={routeCode} title="header.tsx" />
          <CodeBlock code={hierarchyCode} title="hierarchy options" />
        </Stack>
        <Lede className="mt-6">
          Static segments take priority over :parameters, then terminal *catchAll patterns. Invalid
          patterns, duplicate IDs, cyclic parents, and unsafe links fail with configuration errors.
        </Lede>
      </Section>

      <Section
        id="context"
        eyebrow="Layout + page"
        title="Let the page name its own trail."
        lede="A layout renders the provider and the breadcrumb. A nested page publishes labels for the resources it loaded. Scope includes route parameters, so an inactive page can never change the current trail."
      >
        <Stack gap={6}>
          <BreadcrumbContextDemo />
          <CodeBlock code={contextCode} title="layout.tsx and page.tsx" />
        </Stack>
        <Callout className="mt-6" title="Ownership rules">
          One page owns a full trail; other components may supply non-conflicting ID-based labels.
          Each registration cleans up only itself. The prop-based API still works without a
          provider.
        </Callout>
      </Section>

      <Section
        id="manual"
        eyebrow="Explicit when needed"
        title="Manual items"
        lede="When there is no router, or the trail is not derived from the URL, pass items directly. The last item is current."
      >
        <Preview source={manualCode} code={<CodeBlock code={manualCode} copy={false} />}>
          <ManualBreadcrumbDemo />
        </Preview>
        <Lede className="mt-6">
          Visible-item limits include the overflow trigger. The first and current items remain
          visible; intermediate links move into a keyboard-accessible menu. Long labels truncate
          visually while their full text remains in the markup and title.
        </Lede>
      </Section>

      <Section
        id="api"
        eyebrow="Reference"
        title="Props"
        lede="AppBreadcrumb accepts either a resolved mode (pathname and routes) or a manual mode (items). BreadcrumbProvider takes the same props plus scope."
      >
        <Stack gap={6}>
          <PropsTable props={appearanceProps} />
          <PropsTable props={routeProps} />
        </Stack>
      </Section>

      <DocPagination href="/docs/breadcrumb" />
    </DocLayout>
  );
}
