// @vitest-environment jsdom
import { act, createElement, StrictMode } from "react";
import { createRoot, hydrateRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import { afterEach, beforeEach, expect, test, vi } from "vite-plus/test";
import {
  BreadcrumbProvider,
  ContextBreadcrumb,
  usePageBreadcrumbs,
} from "@/components/ui/app-breadcrumb/context";
import type { PageBreadcrumbsOptions } from "@/components/ui/app-breadcrumb/context-types";
import type { BreadcrumbEntry } from "@/components/ui/app-breadcrumb/types";

const fallback: BreadcrumbEntry[] = [
  { id: "home", label: "Home", href: "/" },
  { id: "page", label: "Fallback" },
];
function Page(props: PageBreadcrumbsOptions) {
  usePageBreadcrumbs(props);
  return null;
}
let root: Root;
let container: HTMLDivElement;
beforeEach(() => {
  (
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true;
  vi.stubGlobal("matchMedia", () => ({
    matches: false,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  vi.unstubAllGlobals();
});
const current = () => container.querySelector('[aria-current="page"]')?.textContent;
async function render(scope: string, pages: PageBreadcrumbsOptions[] = []) {
  await act(async () =>
    root.render(
      createElement(BreadcrumbProvider, {
        scope,
        items: fallback,
        children: [
          createElement(ContextBreadcrumb, { key: "layout" }),
          ...pages.map((props, index) => createElement(Page, { ...props, key: index })),
        ],
      }),
    ),
  );
}

test("an independently rendered layout follows page-owned items and returns to fallback on cleanup", async () => {
  await render("project:1");
  expect(current()).toBe("Fallback");
  await render("project:1", [{ scope: "project:1", items: [{ id: "project", label: "Atlas" }] }]);
  expect(current()).toBe("Atlas");
  await render("project:1", [
    { scope: "project:1", items: [{ id: "project", label: "Renamed Atlas" }] },
  ]);
  expect(current()).toBe("Renamed Atlas");
  await render("project:1");
  expect(current()).toBe("Fallback");
});
test("inactive page updates and delayed cleanup cannot overwrite the active page", async () => {
  await render("project:1", [{ scope: "project:1", items: [{ id: "project", label: "Atlas" }] }]);
  await render("project:2", [
    { scope: "project:1", items: [{ id: "old", label: "Late old response" }] },
    { scope: "project:2", items: [{ id: "new", label: "Orion" }] },
  ]);
  expect(current()).toBe("Orion");
  // Keep the newer page mounted while the outgoing page finally unmounts.
  await act(async () =>
    root.render(
      createElement(BreadcrumbProvider, {
        scope: "project:2",
        items: fallback,
        children: [
          createElement(ContextBreadcrumb, { key: "layout" }),
          null,
          createElement(Page, {
            key: 1,
            scope: "project:2",
            items: [{ id: "new", label: "Orion" }],
          }),
        ],
      }),
    ),
  );
  expect(current()).toBe("Orion");
});
test("label overrides compose by ID and loaded names clear pending state", async () => {
  const pending = [
    { id: "home", label: "Home", href: "/" },
    { id: "project", label: "Loading…", pending: true },
  ];
  await act(async () =>
    root.render(
      createElement(BreadcrumbProvider, {
        scope: "project:1",
        items: pending,
        children: [
          createElement(ContextBreadcrumb, { key: "layout" }),
          createElement(Page, {
            key: "project",
            scope: "project:1",
            routeLabels: { project: "Atlas" },
          }),
          createElement(Page, {
            key: "home",
            scope: "project:1",
            routeLabels: { home: "Kezdőlap" },
          }),
        ],
      }),
    ),
  );
  expect(current()).toBe("Atlas");
  expect(container.textContent).toContain("Kezdőlap");
  expect(container.querySelector("nav")?.hasAttribute("aria-busy")).toBe(false);
});
test("full page items can also receive distinct subcomponent label overrides", async () => {
  await render("p", [
    { scope: "p", items: [{ id: "custom", label: "Original" }] },
    { scope: "p", routeLabels: { custom: "Updated by child", unrelated: "Ignored" } },
  ]);
  expect(current()).toBe("Updated by child");
  expect(container.textContent).not.toContain("Ignored");
});
test("disabling a hook releases its contribution and missing partial data preserves fallback", async () => {
  await render("p", [{ scope: "p", routeLabels: { page: "Active" } }]);
  expect(current()).toBe("Active");
  await render("p", [{ scope: "p", routeLabels: { page: "Active" }, enabled: false }]);
  expect(current()).toBe("Fallback");
  await render("p", [{ scope: "p", routeLabels: { page: undefined } }]);
  expect(current()).toBe("Fallback");
});
test("StrictMode setup-cleanup-setup leaves one valid owner and no render loop", async () => {
  await act(async () =>
    root.render(
      createElement(
        StrictMode,
        null,
        createElement(BreadcrumbProvider, {
          scope: "p",
          items: fallback,
          children: [
            createElement(ContextBreadcrumb, { key: "layout" }),
            createElement(Page, {
              key: "page",
              scope: "p",
              items: [{ id: "page", label: "Strict page" }],
            }),
          ],
        }),
      ),
    ),
  );
  expect(current()).toBe("Strict page");
});
test("nested providers isolate layout trails", async () => {
  await act(async () =>
    root.render(
      createElement(BreadcrumbProvider, {
        scope: "p",
        items: fallback,
        children: [
          createElement(ContextBreadcrumb, { key: "outer", labels: { navigation: "Outer trail" } }),
          createElement(BreadcrumbProvider, {
            key: "nested",
            scope: "p",
            items: fallback,
            children: [
              createElement(ContextBreadcrumb, {
                key: "inner",
                labels: { navigation: "Inner trail" },
              }),
              createElement(Page, {
                key: "page",
                scope: "p",
                items: [{ id: "inner", label: "Inner page" }],
              }),
            ],
          }),
        ],
      }),
    ),
  );
  expect(container.querySelector('nav[aria-label="Outer trail"]')?.textContent).toContain(
    "Fallback",
  );
  expect(container.querySelector('nav[aria-label="Inner trail"]')?.textContent).toBe("Inner page");
});
test("server rendering uses provider fallback without running page registration effects", () => {
  const html = renderToStaticMarkup(
    createElement(BreadcrumbProvider, {
      scope: "p",
      items: fallback,
      children: [
        createElement(ContextBreadcrumb, { key: "layout" }),
        createElement(Page, {
          key: "page",
          scope: "p",
          items: [{ id: "page", label: "Client page" }],
        }),
      ],
    }),
  );
  expect(html).toContain("Fallback");
  expect(html).not.toContain("Client page");
});
test("missing provider fails with a useful diagnostic", () => {
  expect(() => renderToStaticMarkup(createElement(ContextBreadcrumb))).toThrow(
    "inside BreadcrumbProvider",
  );
  expect(() => renderToStaticMarkup(createElement(Page, { scope: "p", items: [] }))).toThrow(
    "inside BreadcrumbProvider",
  );
});
test("hydration starts from the server fallback and then publishes page-owned items", async () => {
  const element = createElement(BreadcrumbProvider, {
    scope: "p",
    items: fallback,
    children: [
      createElement(ContextBreadcrumb, { key: "layout" }),
      createElement(Page, {
        key: "page",
        scope: "p",
        items: [{ id: "page", label: "Hydrated page" }],
      }),
    ],
  });
  await act(async () => root.unmount());
  container.innerHTML = renderToString(element);
  expect(current()).toBe("Fallback");
  const recover = vi.fn();
  await act(async () => {
    root = hydrateRoot(container, element, { onRecoverableError: recover });
  });
  expect(current()).toBe("Hydrated page");
  expect(recover).not.toHaveBeenCalled();
});
