// @vitest-environment jsdom
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, test, vi } from "vite-plus/test";
import { AppBreadcrumb } from "@/components/ui/app-breadcrumb/app-breadcrumb";
import type { AppBreadcrumbProps, BreadcrumbEntry } from "@/components/ui/app-breadcrumb/types";

const items: BreadcrumbEntry[] = [
  { id: "home", label: "Home", href: "/" },
  { id: "workspace", label: "Workspace", href: "/workspace" },
  { id: "projects", label: "Projects", href: "/workspace/projects" },
  { id: "project", label: "Atlas", href: "/workspace/projects/atlas" },
  { id: "current", label: "Activity", href: "/workspace/projects/atlas/activity" },
];
let root: Root;
let container: HTMLDivElement;
const listeners = new Set<() => void>();
beforeEach(() => {
  (
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true;
  vi.stubGlobal("innerWidth", 1280);
  vi.stubGlobal("matchMedia", () => ({
    matches: window.innerWidth < 768,
    addEventListener: (_: string, listener: () => void) => listeners.add(listener),
    removeEventListener: (_: string, listener: () => void) => listeners.delete(listener),
  }));
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  listeners.clear();
  vi.unstubAllGlobals();
});
async function render(props: AppBreadcrumbProps) {
  await act(async () => root.render(createElement(AppBreadcrumb, props)));
}
async function click(element: Element | null) {
  expect(element).not.toBeNull();
  await act(async () => (element as HTMLElement).click());
}

test("manual entries use real links, hidden separators and a non-navigable current page", async () => {
  await render({
    items: items.slice(0, 2),
    separator: "/",
    labels: { navigation: "Oldalútvonal" },
  });
  expect(container.querySelector("nav")?.getAttribute("aria-label")).toBe("Oldalútvonal");
  expect(container.querySelector("a")?.getAttribute("href")).toBe("/");
  const current = container.querySelector('[aria-current="page"]');
  expect(current?.textContent).toBe("Workspace");
  expect(current?.tagName).toBe("SPAN");
  expect(
    container.querySelector('[data-slot="breadcrumb-separator"]')?.getAttribute("aria-hidden"),
  ).toBe("true");
});
test("overflow preserves first and current entries and uses custom router links in the menu", async () => {
  const navigate = vi.fn();
  await render({
    items,
    maxVisibleItems: 3,
    renderLink: ({ href, children }) =>
      createElement(
        "a",
        {
          href,
          "data-router-link": "",
          onClick: (event) => {
            event.preventDefault();
            navigate(href);
          },
        },
        children,
      ),
  });
  expect(container.querySelector('[aria-current="page"]')?.textContent).toBe("Activity");
  expect(container.querySelectorAll('[data-slot="breadcrumb-item"]')).toHaveLength(3);
  await click(container.querySelector('button[aria-label="Show hidden pages"]'));
  const links = [...document.querySelectorAll('[role="menuitem"]')];
  expect(links.map((item) => item.textContent)).toEqual(["Workspace", "Projects", "Atlas"]);
  expect(links.every((item) => item.hasAttribute("data-router-link"))).toBe(true);
  await click(links[1]!);
  expect(navigate).toHaveBeenCalledWith("/workspace/projects");
});
test("overflow supports keyboard opening, menu focus, Escape and focus return", async () => {
  await render({ items, maxVisibleItems: 3 });
  const trigger = container.querySelector<HTMLButtonElement>("button")!;
  await act(async () => {
    trigger.focus();
    trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
  });
  expect(document.querySelector('[role="menu"]')).not.toBeNull();
  await act(async () => {
    await vi.waitFor(() => expect(document.activeElement?.getAttribute("role")).toBe("menuitem"));
  });
  await act(async () =>
    document.activeElement?.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    ),
  );
  await act(async () => {
    await vi.waitFor(() => expect(document.activeElement).toBe(trigger));
  });
});
test("compact overflow updates when the viewport breakpoint changes", async () => {
  await render({ items, maxVisibleItems: 5, compactMaxVisibleItems: 3 });
  expect(container.querySelector("button")).toBeNull();
  await act(async () => {
    vi.stubGlobal("innerWidth", 390);
    for (const listener of listeners) listener();
  });
  expect(container.querySelector('button[aria-label="Show hidden pages"]')).not.toBeNull();
  expect(container.querySelectorAll('[data-slot="breadcrumb-item"]')).toHaveLength(3);
});
test("app data changes update dynamic names without stale labels or a remount", async () => {
  const routes = [
    {
      path: "/projects/:id",
      label: ({ data }: { data: { name: string } | undefined }) => data?.name,
    },
  ];
  await act(async () =>
    root.render(
      createElement(AppBreadcrumb<{ name: string }>, {
        pathname: "/projects/42",
        routes,
        loading: true,
      }),
    ),
  );
  expect(container.querySelector("nav")?.getAttribute("aria-busy")).toBe("true");
  expect(container.querySelector('[aria-current="page"]')?.textContent).toBe("Loading…");
  await act(async () =>
    root.render(
      createElement(AppBreadcrumb<{ name: string }>, {
        pathname: "/projects/42",
        routes,
        data: { name: "Atlas" },
      }),
    ),
  );
  expect(container.querySelector('[aria-current="page"]')?.textContent).toBe("Atlas");
  expect(container.querySelector("nav")?.hasAttribute("aria-busy")).toBe(false);
  await act(async () =>
    root.render(
      createElement(AppBreadcrumb<{ name: string }>, { pathname: "/projects/42", routes }),
    ),
  );
  expect(container.querySelector('[aria-current="page"]')?.textContent).toBe("Unavailable");
});
test("non-navigable hidden ancestors are disabled menu items", async () => {
  await render({
    items: items.map((item) => (item.id === "projects" ? { ...item, href: undefined } : item)),
    maxVisibleItems: 3,
  });
  await click(container.querySelector("button"));
  const entry = [...document.querySelectorAll('[role="menuitem"]')].find(
    (item) => item.textContent === "Projects",
  );
  expect(entry?.getAttribute("aria-disabled")).toBe("true");
  expect(entry?.hasAttribute("href")).toBe(false);
});
test("invalid visible limits and unsafe manual URLs are rejected", async () => {
  // Server rendering checks diagnostics without leaving a failed client root mounted.
  const { renderToStaticMarkup } = await import("react-dom/server");
  expect(() =>
    renderToStaticMarkup(createElement(AppBreadcrumb, { items, maxVisibleItems: 2 })),
  ).toThrow("at least 3");
  expect(() =>
    renderToStaticMarkup(
      createElement(AppBreadcrumb, {
        items: [{ id: "bad", label: "Bad", href: "javascript:alert(1)" }],
      }),
    ),
  ).toThrow("href");
  expect(() =>
    renderToStaticMarkup(createElement(AppBreadcrumb, { items: [items[0]!, items[0]!] })),
  ).toThrow("Duplicate");
});
