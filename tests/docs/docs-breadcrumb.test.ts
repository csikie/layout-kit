import { expect, test } from "vite-plus/test";
import { resolveBreadcrumbs } from "@/components/ui/app-breadcrumb";
import { docsBreadcrumbRoutes } from "@/lib/breadcrumbs";
import { flatNavigation } from "@/lib/navigation";

const routes = docsBreadcrumbRoutes();

function trail(pathname: string) {
  return resolveBreadcrumbs({ pathname, routes, unknown: "error" }).map(
    ({ label, href, current }) => ({ label, href, current }),
  );
}

test.each(flatNavigation.filter((item) => item.href !== "/"))(
  "$href ends with its navigation title",
  (item) => {
    const items = trail(item.href);
    expect(items[0]).toMatchObject({ label: "Docs", href: "/" });
    expect(items.at(-1)).toMatchObject({ label: item.title, current: true });
  },
);

test("primitive pages sit under a non-navigable group crumb", () => {
  expect(trail("/docs/layout/grid-item")).toEqual([
    { label: "Docs", href: "/", current: false },
    { label: "Layout primitives", href: undefined, current: false },
    { label: "GridItem", href: "/docs/layout/grid-item", current: true },
  ]);
});

test("the home page is a single current crumb", () => {
  expect(trail("/")).toEqual([{ label: "Docs", href: "/", current: true }]);
});

test("a group crumb is derived from the group that owns the segment", () => {
  const derived = docsBreadcrumbRoutes([
    {
      label: "Guides",
      items: [{ title: "Theming", href: "/docs/guides/theming", description: "" }],
    },
  ]);
  expect(derived).toContainEqual({ path: "/docs/guides", label: "Guides", href: null });
  expect(derived).toContainEqual({ path: "/docs/guides/theming", label: "Theming" });
});
