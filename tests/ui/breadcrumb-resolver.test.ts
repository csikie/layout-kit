import { describe, expect, test } from "vite-plus/test";
import { resolveBreadcrumbs } from "@/components/ui/app-breadcrumb/resolve";
import type { BreadcrumbRoute } from "@/components/ui/app-breadcrumb/types";

type Data = { projectName: string };
const routes: BreadcrumbRoute<Data>[] = [
  { path: "/", label: "Home" },
  { path: "/projects", label: "Projects" },
  {
    id: "project",
    path: "/projects/:projectId",
    label: ({ data, params }) => data?.projectName ?? params.projectId,
  },
  { path: "/projects/new", label: "New project" },
  { path: "/projects/:projectId/tasks", label: "Tasks" },
  { path: "/projects/:projectId/tasks/:taskId", label: ({ params }) => `Task ${params.taskId}` },
];
const labels = (options: Parameters<typeof resolveBreadcrumbs<Data>>[0]) =>
  resolveBreadcrumbs(options).map((item) => item.label);

describe("breadcrumb route resolution", () => {
  test("resolves ancestors, multiple params and app-owned data", () => {
    const items = resolveBreadcrumbs({
      pathname: "/projects/42/tasks/7",
      routes,
      data: { projectName: "Atlas" },
    });
    expect(items.map((item) => item.label)).toEqual([
      "Home",
      "Projects",
      "Atlas",
      "Tasks",
      "Task 7",
    ]);
    expect(items.map((item) => item.href)).toEqual([
      "/",
      "/projects",
      "/projects/42",
      "/projects/42/tasks",
      "/projects/42/tasks/7",
    ]);
    expect(items.map((item) => item.current)).toEqual([false, false, false, false, true]);
  });
  test("normalizes slashes and removes query and hash", () => {
    expect(
      resolveBreadcrumbs({ pathname: "/projects//42/?tab=info#top", routes }).at(-1)?.href,
    ).toBe("/projects/42");
  });
  test("static segments win over dynamic routes independent of declaration order", () => {
    expect(labels({ pathname: "/projects/new", routes })).toEqual([
      "Home",
      "Projects",
      "New project",
    ]);
  });
  test("specificity is compared per segment, not by number of static segments", () => {
    expect(
      labels({
        pathname: "/a/b/c",
        routes: [
          { path: "/:x/b/c", label: "less specific" },
          { path: "/a/:y/:z", label: "more specific" },
        ],
      }).at(-1),
    ).toBe("more specific");
  });
  test("decodes labels and parameters without changing encoded href segments", () => {
    const result = resolveBreadcrumbs({ pathname: "/projects/Atlas%20%26%20Co%2FDesign", routes });
    expect(result.at(-1)?.label).toBe("Atlas & Co/Design");
    expect(result.at(-1)?.href).toBe("/projects/Atlas%20%26%20Co%2FDesign");
    expect(labels({ pathname: "/caf%C3%A9/new-project_name" })).toEqual([
      "Home",
      "Café",
      "New project name",
    ]);
  });
  test("supports parent overrides with params from the current route", () => {
    const result = resolveBreadcrumbs({
      pathname: "/reports/Atlas%2FDesign/weekly",
      routes: [
        ...routes,
        { path: "/reports/:projectId/weekly", parentId: "project", label: "Weekly report" },
      ],
    });
    expect(result.map((item) => item.label)).toEqual([
      "Home",
      "Projects",
      "Atlas/Design",
      "Weekly report",
    ]);
    expect(result[2]?.href).toBe("/projects/Atlas%2FDesign");
  });
  test("hidden ancestors remain traversable and parentId null starts a hierarchy", () => {
    expect(
      labels({
        pathname: "/projects/42",
        routes: routes.map((route) =>
          route.path === "/projects" ? { ...route, hidden: true } : route,
        ),
      }),
    ).toEqual(["Home", "42"]);
    expect(
      labels({
        pathname: "/projects/42",
        routes: routes.map((route) =>
          route.id === "project" ? { ...route, parentId: null } : route,
        ),
      }),
    ).toEqual(["42"]);
  });
  test("a hidden current resource does not mark an ancestor as the current page", () => {
    const result = resolveBreadcrumbs({
      pathname: "/projects/42",
      routes: routes.map((route) => (route.id === "project" ? { ...route, hidden: true } : route)),
    });
    expect(result.every((item) => !item.current)).toBe(true);
  });
  test("a catch-all becomes one crumb and receives all remaining segments", () => {
    expect(
      labels({
        pathname: "/files/design/system/tokens.json",
        routes: [
          { path: "/files", label: "Files" },
          { path: "/files/*path", label: ({ params }) => params.path },
        ],
      }),
    ).toEqual(["Home", "Files", "design/system/tokens.json"]);
  });
  test("allows safe link overrides and non-navigable ancestors", () => {
    const result = resolveBreadcrumbs({
      pathname: "/projects/42",
      routes: routes.map((route) =>
        route.path === "/projects"
          ? { ...route, href: null }
          : route.id === "project"
            ? { ...route, href: ({ params }) => `/project?id=${params.projectId}` }
            : route,
      ),
    });
    expect(result[1]?.href).toBeUndefined();
    expect(result[2]?.href).toBe("/project?id=42");
  });
  test("loading affects only dynamic labels; missing data uses explicit fallbacks", () => {
    const definitions: BreadcrumbRoute<Data>[] = [
      { path: "/", label: "Start" },
      {
        path: "/projects/:id",
        label: ({ data }) => data?.projectName,
        fallbackLabel: "Project unavailable",
      },
    ];
    expect(labels({ pathname: "/projects/1", routes: definitions, loading: true })).toEqual([
      "Start",
      "Projects",
      "Loading…",
    ]);
    expect(labels({ pathname: "/projects/1", routes: definitions })).toEqual([
      "Start",
      "Projects",
      "Project unavailable",
    ]);
    expect(
      labels({
        pathname: "/projects/1",
        routes: definitions,
        loading: true,
        labels: { loading: "Betöltés…" },
      }).at(-1),
    ).toBe("Betöltés…");
  });
  test("supports format, omit, error and custom unknown-segment policies", () => {
    expect(labels({ pathname: "/unconfigured", unknown: "omit" })).toEqual(["Home"]);
    expect(() => labels({ pathname: "/unconfigured", unknown: "error" })).toThrow(
      "No breadcrumb route",
    );
    expect(
      labels({ pathname: "/unconfigured", unknown: ({ segment }) => `Custom ${segment}` }),
    ).toEqual(["Home", "Custom unconfigured"]);
    expect(labels({ pathname: "/unconfigured", unknown: () => null })).toEqual(["Home"]);
  });
});

describe("breadcrumb configuration failures", () => {
  test.each([
    "https://example.com/path",
    "//example.com/path",
    "/bad\\path",
    "/bad path",
    "/%ZZ",
    "/projects/%2E%2E",
  ])("rejects invalid pathname %s", (pathname) => {
    expect(() => resolveBreadcrumbs({ pathname })).toThrow();
  });
  test.each([
    "javascript:alert(1)",
    "data:text/html,unsafe",
    "//example.com",
    "/\\example.com",
    "/bad\npath",
  ])("rejects unsafe navigation href %s", (href) => {
    expect(() =>
      resolveBreadcrumbs({ pathname: "/", routes: [{ path: "/", label: "Home", href }] }),
    ).toThrow("href");
  });
  test("rejects ambiguous routes, duplicate IDs and malformed params", () => {
    for (const definitions of [
      [
        { path: "/:first", label: "A" },
        { path: "/:second", label: "B" },
      ],
      [
        { id: "same", path: "/a", label: "A" },
        { id: "same", path: "/b", label: "B" },
      ],
      [{ path: "/:id/:id", label: "A" }],
      [{ path: "/files/*path/end", label: "A" }],
      [{ path: "/:id?", label: "A" }],
    ])
      expect(() => resolveBreadcrumbs({ pathname: "/a", routes: definitions })).toThrow();
  });
  test("rejects unknown parents, missing parameters and hierarchy cycles", () => {
    expect(() =>
      resolveBreadcrumbs({
        pathname: "/",
        routes: [{ path: "/", label: "A", parentId: "missing" }],
      }),
    ).toThrow("Unknown breadcrumb parent");
    expect(() =>
      resolveBreadcrumbs({
        pathname: "/weekly",
        routes: [...routes, { path: "/weekly", label: "Weekly", parentId: "project" }],
      }),
    ).toThrow("Missing breadcrumb parent parameter");
    expect(() =>
      resolveBreadcrumbs({
        pathname: "/a",
        routes: [
          { id: "a", path: "/a", label: "A", parentId: "b" },
          { id: "b", path: "/b", label: "B", parentId: "a" },
        ],
      }),
    ).toThrow("Cyclic breadcrumb hierarchy");
  });
  test("does not treat inherited object properties as parent parameter values", () => {
    expect(() =>
      resolveBreadcrumbs({
        pathname: "/report",
        routes: [
          { id: "project", path: "/:toString", label: "Parent" },
          { path: "/report", parentId: "project", label: "Report" },
        ],
      }),
    ).toThrow("Missing breadcrumb parent parameter");
  });
  test("rejects async label resolvers instead of starting data-fetching behavior", () => {
    expect(() =>
      resolveBreadcrumbs({ pathname: "/", routes: [{ path: "/", label: async () => "Later" }] }),
    ).toThrow("synchronous");
  });
});

test("custom catch-all parents preserve encoded slash boundaries", () => {
  const items = resolveBreadcrumbs({
    pathname: "/downloads/design%2Fsystem/tokens.json",
    routes: [
      { id: "files", path: "/files/*filePath", label: "Files" },
      { path: "/downloads/*filePath", parentId: "files", label: "Download" },
    ],
  });
  expect(items.find((item) => item.id === "files")?.href).toBe(
    "/files/design%2Fsystem/tokens.json",
  );
});
