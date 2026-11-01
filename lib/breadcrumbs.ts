import type { BreadcrumbRoute } from "@/components/ui/app-breadcrumb";
import { navigation, type NavGroup } from "./navigation";

function parentPath(href: string): string {
  return href.slice(0, href.lastIndexOf("/")) || "/";
}

/**
 * Breadcrumb routes for the docs, derived from the sidebar navigation so the
 * two never drift apart. Every page uses its navigation title; a URL segment
 * without its own page (such as /docs/layout) becomes a non-navigable crumb
 * named after the navigation group that owns it.
 */
function docsBreadcrumbRoutes(groups: readonly NavGroup[] = navigation): BreadcrumbRoute[] {
  const pages = groups.flatMap((group) => group.items.map((item) => ({ group, item })));
  const pagePaths = new Set(pages.map(({ item }) => item.href));
  const routes: BreadcrumbRoute[] = [
    { path: "/", label: "Docs" },
    { path: "/docs", label: "Docs", hidden: true },
  ];
  const known = new Set(routes.map((route) => route.path));

  for (const { group, item } of pages) {
    const parent = parentPath(item.href);
    if (!known.has(parent) && !pagePaths.has(parent)) {
      routes.push({ path: parent, label: group.label, href: null });
      known.add(parent);
    }
    if (!known.has(item.href)) {
      routes.push({ path: item.href, label: item.title });
      known.add(item.href);
    }
  }
  return routes;
}

export { docsBreadcrumbRoutes };
