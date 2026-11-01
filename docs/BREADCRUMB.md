# Breadcrumb

`@/components/ui/app-breadcrumb` exports `AppBreadcrumb`, the pure `resolveBreadcrumbs`
function, their types, and `defaultBreadcrumbLabels`. The original shadcn
primitives remain available from `@/components/ui/breadcrumb`.

## Automatic route resolution

```tsx
import { AppBreadcrumb, type BreadcrumbRoute } from "@/components/ui/app-breadcrumb";

type Data = { project: { name: string } };
const routes: BreadcrumbRoute<Data>[] = [
  { path: "/", label: "Home" },
  { path: "/projects", label: "Projects" },
  {
    id: "project",
    path: "/projects/:projectId",
    label: ({ data }) => data?.project.name,
    fallbackLabel: "Project unavailable",
  },
];

<AppBreadcrumb
  pathname={pathname}
  routes={routes}
  data={project ? { project } : undefined}
  loading={isLoading}
  maxVisibleItems={5}
  compactMaxVisibleItems={3}
  renderLink={({ href, children }) => <Link to={href}>{children}</Link>}
/>;
```

The application supplies `pathname` and a router's link element. Without
`renderLink`, ordinary anchors are used. The same renderer is used in the
collapsed menu. Its returned element must accept/forward link attributes,
event handlers and refs, as required by the shadcn/Base UI `render` contract.

The package does not read browser location or import a routing library. It does
not fetch names, cache resources, resolve permissions or translate domain labels.
Names and their loading state are passed from your application. This keeps API
requests and authorization in the app's existing data layer. For a hash router,
translate its location to an absolute path or use manual items; the docs header
uses manual hash links.

## Patterns and hierarchy

- Patterns are absolute, case-sensitive paths. `/projects/new` outranks
  `/projects/:projectId`, independent of configuration order. Specificity is
  compared from left to right: static segment, named parameter, then catch-all.
- `:projectId` matches one segment. A terminal `*filePath` matches one or more
  segments and creates one breadcrumb, not a repeated label for every segment.
- Optional parameters, regex patterns and router-specific syntax are not supported.
- Query strings and fragments are removed from the input pathname; duplicate
  interior slashes and trailing slashes are normalized. Links use the resulting
  encoded path, while `params` and fallback labels are decoded once.
- By default, each URL prefix contributes a step. A root label defaults to
  `labels.home` when no root route is configured. Route `id` defaults to its
  normalized `path`.
- `hidden: true` removes a step but still traverses its parents.
- `parentId` replaces the URL-derived parent with a configured route. Parameters
  for that route come from the matched current path. Missing parameters are an
  error; IDs are never invented.
- `parentId: null` starts a new hierarchy without URL ancestors.
- `href` overrides the step's URL; a function receives the same context as
  `label`. `href: null` produces a non-navigable ancestor.

```ts
const routes: BreadcrumbRoute<Data>[] = [
  { path: "/", label: "Home" },
  { path: "/projects", label: "Projects" },
  { id: "project", path: "/projects/:projectId", label: projectLabel },
  // /reports/42/weekly renders Home / Projects / [project name] / Weekly report.
  { path: "/reports/:projectId/weekly", parentId: "project", label: "Weekly report" },
];
```

A label function receives `{ params, data, pathname, path }`. `pathname` is the
normalized current resource and `path` is this step's resolved path. Parent
callbacks can access current-resource parameters as well as their own params.
`data` can be undefined. Return null/undefined/false/empty text to use the route's
`fallbackLabel`, or `labels.unavailable` if none is supplied. Label functions must
be synchronous. A thrown error is a configuration/application error, not silently
converted to a label. Catch it in your application's error boundary when needed.

When `loading` is true, function labels use `loadingLabel` or `labels.loading`;
static labels remain visible. The navigation is marked busy and pending ancestor
links are disabled. Passing updated data updates labels without remounting.

Hidden current resources do not incorrectly mark their parent as the current
page. For a normal visible current resource, `aria-current="page"` is applied to
a non-navigable current label, even if that item has an href.

## Unknown paths

`routes` is optional, so the component can produce a trail from a pathname alone.
`unknown` controls unmatched non-root URL prefixes:

- `"format"` (default): decode once and turn hyphens/underscores into spaces.
- `"omit"`: leave unknown steps out of the visible trail.
- `"error"`: throw a diagnostic naming the unconfigured path.
- A callback receives `{ segment, params, data, pathname, path }` and returns a
  label. Returning null/undefined/false/empty text omits that step.

For sensitive or internal identifiers, configure meaningful route labels or use
`unknown: "omit"`/`"error"` rather than exposing URL-derived labels.

## Manual entries and custom rendering

```tsx
<AppBreadcrumb
  items={[
    { id: "docs", label: "Docs", href: "#overview" },
    { id: "breadcrumb", label: "Breadcrumb" },
  ]}
  separator="/"
  labels={{ navigation: "Oldalútvonal", more: "Rejtett oldalak" }}
/>
```

Manual items require stable unique `id` values and a `label` (text or React
content), with optional `href`, `current` and `pending`. The last item is current
by default. An explicit `current: false` preserves a link, useful when the actual
current step was intentionally omitted. An explicit current item must be last.

`items` and automatic route props are mutually exclusive. For a custom view:

```ts
const items = resolveBreadcrumbs({ pathname, routes, data, loading, unknown });
```

This pure function has no DOM or network dependency, making it usable outside
React and suitable for direct unit tests. It returns decoded labels, safe
navigation URLs, and current/pending metadata.

## Overflow, long labels and accessibility

`maxVisibleItems` defaults to 5; `compactMaxVisibleItems` defaults to 3 below
768 CSS pixels. Limits include the overflow trigger and must be integers of at
least 3. The compact limit never exceeds the normal limit.

When needed, the first and final entries stay visible, with middle entries moved
into the dropdown. Base UI provides keyboard opening, menu focus, Escape closing,
and focus return. Non-navigable or pending hidden entries are disabled. Long
string labels have visual truncation plus their full text in markup and a title;
custom React content should include its own accessible text.

The navigation label, overflow trigger, default root, loading and missing-data
text can all be localized through `labels`. Separators are hidden from assistive
technology. An empty item list renders no navigation landmark.

## Configuration errors

Duplicate IDs, equivalent ambiguous patterns, repeated/invalid parameter names,
missing parents/parent parameters, active hierarchy cycles and async labels throw
useful configuration errors. Pathnames must be root-relative paths, not full URLs,
protocol-relative hosts, dot paths or raw hash routes. Malformed percent encoding
is rejected.

Explicit hrefs allow root-relative paths, hashes, query links and HTTP(S) URLs.
Executable schemes, protocol-relative hosts, backslashes and unencoded ASCII
spaces/control characters are rejected. The application still owns destination
validation and access control; breadcrumb visibility is not an authorization check.

The docs example at `/docs/breadcrumb` is a local path sandbox. It demonstrates the
router adapter without pretending to provide real project/report endpoints.

## Optional Context: layout and page ownership

`BreadcrumbProvider`, `ContextBreadcrumb` and `usePageBreadcrumbs` allow a page to
publish breadcrumb items without passing callbacks up to its layout. The
provider accepts the same manual or route-based source and appearance props as
`AppBreadcrumb`, plus a required active `scope` and `children`.

```tsx
// Shared layout. Derive the same route-instance key in the layout and page.
const routeKey = `project:${projectId}`;

<BreadcrumbProvider
  scope={routeKey}
  pathname={pathname}
  routes={routes}
  data={routeData}
  separator="/"
>
  <header>
    <ContextBreadcrumb />
  </header>
  <Outlet />
</BreadcrumbProvider>;
```

A mounted page publishes its full trail declaratively:

```tsx
function ProjectPage({ projectId, project }) {
  usePageBreadcrumbs({
    scope: `project:${projectId}`,
    items: [
      { id: "projects", label: "Projects", href: "/projects" },
      { id: "project", label: project?.name ?? "Loading…", pending: !project },
    ],
  });
  return <ProjectDetails project={project} />;
}
```

Or a page/subcomponent supplies only route labels, identified by the resolver's
route `id` (the normalized route pattern when no explicit ID was configured):

```tsx
usePageBreadcrumbs({
  scope: `project:${projectId}`,
  routeLabels: { project: project?.name },
  enabled: true,
});
```

The hook updates as its input changes. Call it unconditionally during rendering;
use `enabled: false` to release its contribution. API callbacks update normal
React state, which then updates the hook input. Do not call the hook inside an
async callback or mutate item arrays/label maps in place.

Ownership and lifecycle rules:

- Only registrations whose scope equals the provider's active scope are visible.
  Include route parameters/resource identity in that key, not just a route name.
- At most one hook owns a full `items` list for each scope. An empty list is a
  valid override that hides the trail.
- Multiple subcomponents may supply labels for distinct IDs. These labels apply
  to the active full override or, if none exists, the provider's fallback items.
  Two owners for the same label ID are a configuration error, not last-writer-wins.
- Null, undefined, boolean and empty partial labels preserve the fallback label.
  A supplied nonempty label clears the corresponding pending flag.
- Cleanup removes only its own registration. Old cleanup calls are idempotent
  and cannot clear newer registrations. Inactive-page updates cannot overwrite
  the active trail. Cached mounted pages may retain their inactive contributions
  until unmount; they become visible only when their scope is active again.
- Unmounting/disabling the full owner restores the provider fallback, with any
  remaining active partial-label contributions still applied.
- Each provider has an isolated registry. Nested providers use the closest
  provider; there is no global singleton or cross-application mutable state.
- StrictMode's setup/cleanup/setup cycle is supported. Inputs are registered in
  an effect, not during rendering. Server rendering uses the provider fallback;
  page registrations become visible after the client commits. Supply useful
  initial route data in the provider when server-rendered names matter.

`ContextBreadcrumb` accepts appearance props only: `className`, `separator`,
visible-item limits, `renderLink`, and localized `labels`. These inherit from the
provider and can be overridden per display. It always renders with the same
`AppBreadcrumb` implementation. `AppBreadcrumb` and `resolveBreadcrumbs` remain
usable without Context.

Both the hook and the Context display fail with a useful diagnostic outside a
provider. Context does not fetch data or cancel requests; the application still
owns its data lifecycle and authorization.
