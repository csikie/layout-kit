import type { ReactNode } from "react";
import type {
  BreadcrumbContext,
  BreadcrumbEntry,
  BreadcrumbLabels,
  ResolveBreadcrumbsOptions,
} from "./types";
import {
  assertBreadcrumbHref,
  breadcrumbSegments,
  decodeBreadcrumbSegment,
  formatBreadcrumbSegment,
  normalizeBreadcrumbPath,
} from "./path";
import {
  expandBreadcrumbRoute,
  matchBreadcrumbRoute,
  prepareBreadcrumbRoutes,
  type BreadcrumbMatch,
} from "./match";

const defaultBreadcrumbLabels: BreadcrumbLabels = {
  navigation: "Breadcrumb",
  more: "Show hidden pages",
  home: "Home",
  loading: "Loading…",
  unavailable: "Unavailable",
};
function missing(label: ReactNode): boolean {
  return label === null || label === undefined || typeof label === "boolean" || label === "";
}
function ensureSynchronous(label: ReactNode): void {
  if (label && typeof label === "object" && "then" in label) {
    throw new Error(
      "Breadcrumb label resolvers must be synchronous; pass loaded data from the app.",
    );
  }
}
/** Pure, router-independent resolution. Does not read location, fetch data, or mutate routes. */
function resolveBreadcrumbs<TData = unknown>(
  options: ResolveBreadcrumbsOptions<TData>,
): BreadcrumbEntry[] {
  const pathname = normalizeBreadcrumbPath(options.pathname);
  const definitions = prepareBreadcrumbRoutes(options.routes ?? []);
  const labels = { ...defaultBreadcrumbLabels, ...options.labels };
  const parts = breadcrumbSegments(pathname);
  const params: Record<string, string> = Object.create(null) as Record<string, string>;
  const rawParams: Record<string, string[]> = Object.create(null) as Record<string, string[]>;
  for (let index = 0; index <= parts.length; index++) {
    const match = matchBreadcrumbRoute("/" + parts.slice(0, index).join("/"), definitions);
    Object.assign(params, match.params);
    Object.assign(rawParams, match.rawParams);
  }
  const byId = new Map(definitions.map((definition) => [definition.id, definition]));
  function build(node: BreadcrumbMatch<TData>, visited: Set<string>): BreadcrumbEntry[] {
    const definition = node.definition;
    const key = definition?.id ?? `path:${node.path}`;
    if (visited.has(key)) throw new Error(`Cyclic breadcrumb hierarchy at: ${key}`);
    const nextVisited = new Set(visited).add(key);
    const route = definition?.route;
    const context: BreadcrumbContext<TData> = {
      params: { ...params, ...node.params },
      data: options.data,
      pathname,
      path: node.path,
    };
    let parent: BreadcrumbMatch<TData> | undefined;
    if (route?.parentId !== undefined && route.parentId !== null) {
      const parentDefinition = byId.get(route.parentId)!;
      const path = expandBreadcrumbRoute(parentDefinition, context.params, {
        ...rawParams,
        ...node.rawParams,
      });
      parent = { ...matchBreadcrumbRoute(path, [parentDefinition]), definition: parentDefinition };
    } else if (route?.parentId !== null && node.path !== "/") {
      let parentParts = breadcrumbSegments(node.path).slice(0, -1);
      parent = matchBreadcrumbRoute("/" + parentParts.join("/"), definitions);
      // A catch-all is one breadcrumb, not one repeated label per matched segment.
      while (parent.definition?.id === definition?.id && definition && parentParts.length > 0) {
        parentParts = parentParts.slice(0, -1);
        parent = matchBreadcrumbRoute("/" + parentParts.join("/"), definitions);
      }
    }
    const ancestors = parent ? build(parent, nextVisited) : [];
    if (route?.hidden) return ancestors;
    let label: ReactNode;
    const pending = Boolean(options.loading && typeof route?.label === "function");
    if (route) {
      label = pending
        ? (route.loadingLabel ?? labels.loading)
        : typeof route.label === "function"
          ? route.label(context)
          : route.label;
      if (missing(label)) label = route.fallbackLabel ?? labels.unavailable;
    } else if (node.path === "/") label = labels.home;
    else {
      const policy = options.unknown ?? "format";
      if (policy === "omit") return ancestors;
      if (policy === "error") throw new Error(`No breadcrumb route matches: ${node.path}`);
      const segment = decodeBreadcrumbSegment(breadcrumbSegments(node.path).at(-1)!);
      label =
        typeof policy === "function"
          ? policy({ ...context, segment })
          : formatBreadcrumbSegment(segment);
      if (missing(label)) return ancestors;
    }
    ensureSynchronous(label);
    const href =
      typeof route?.href === "function"
        ? route.href(context)
        : route?.href === undefined
          ? node.path
          : route.href;
    if (href !== null) assertBreadcrumbHref(href);
    return [
      ...ancestors,
      {
        id: key,
        label,
        ...(href === null ? {} : { href }),
        current: node.path === pathname,
        ...(pending ? { pending: true } : {}),
      },
    ];
  }
  return build(matchBreadcrumbRoute(pathname, definitions), new Set());
}

export { defaultBreadcrumbLabels, resolveBreadcrumbs };
