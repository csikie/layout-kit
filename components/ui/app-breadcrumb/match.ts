import type { BreadcrumbRoute } from "./types";
import { breadcrumbSegments, decodeBreadcrumbSegment, normalizeBreadcrumbPath } from "./path";

interface PreparedRoute<TData> {
  id: string;
  path: string;
  segments: string[];
  route: BreadcrumbRoute<TData>;
}
interface BreadcrumbMatch<TData> {
  path: string;
  params: Record<string, string>;
  rawParams: Record<string, string[]>;
  definition?: PreparedRoute<TData>;
}
function prepareBreadcrumbRoutes<TData>(
  routes: readonly BreadcrumbRoute<TData>[],
): PreparedRoute<TData>[] {
  const ids = new Set<string>();
  const shapes = new Set<string>();
  const prepared = routes.map((route) => {
    if (/[?#]/u.test(route.path))
      throw new Error(
        "Breadcrumb route patterns cannot contain query strings or optional parameters.",
      );
    const path = normalizeBreadcrumbPath(route.path);
    const segments = breadcrumbSegments(path);
    const id = route.id ?? path;
    if (!id || ids.has(id)) throw new Error(`Duplicate or empty breadcrumb route ID: ${id}`);
    ids.add(id);
    const names = new Set<string>();
    for (const [index, segment] of segments.entries()) {
      if (!segment.startsWith(":") && !segment.startsWith("*")) continue;
      const name = segment.slice(1);
      if (
        !/^[a-zA-Z_]\w*$/u.test(name) ||
        names.has(name) ||
        (segment.startsWith("*") && index !== segments.length - 1)
      ) {
        throw new Error(`Invalid breadcrumb route parameter: ${segment}`);
      }
      names.add(name);
    }
    const shape = segments
      .map((segment) =>
        segment.startsWith(":")
          ? "param"
          : segment.startsWith("*")
            ? "splat"
            : `static:${decodeBreadcrumbSegment(segment)}`,
      )
      .join("/");
    if (shapes.has(shape)) throw new Error(`Ambiguous breadcrumb route pattern: ${path}`);
    shapes.add(shape);
    return { id, path, segments, route };
  });
  for (const { route } of prepared) {
    if (route.parentId !== undefined && route.parentId !== null && !ids.has(route.parentId)) {
      throw new Error(`Unknown breadcrumb parent ID: ${route.parentId}`);
    }
  }
  return prepared;
}
function match<TData>(
  path: string,
  definition: PreparedRoute<TData>,
): BreadcrumbMatch<TData> | undefined {
  const actual = breadcrumbSegments(path);
  const params: Record<string, string> = Object.create(null) as Record<string, string>;
  const rawParams: Record<string, string[]> = Object.create(null) as Record<string, string[]>;
  const pattern = definition.segments;
  const splat = pattern.at(-1)?.startsWith("*");
  if (splat ? actual.length < pattern.length : actual.length !== pattern.length) return;
  for (const [index, segment] of pattern.entries()) {
    if (segment.startsWith("*")) {
      rawParams[segment.slice(1)] = actual.slice(index);
      params[segment.slice(1)] = actual.slice(index).map(decodeBreadcrumbSegment).join("/");
      break;
    }
    if (segment.startsWith(":")) {
      params[segment.slice(1)] = decodeBreadcrumbSegment(actual[index]!);
      rawParams[segment.slice(1)] = [actual[index]!];
    } else if (decodeBreadcrumbSegment(segment) !== decodeBreadcrumbSegment(actual[index]!)) return;
  }
  return { path, params, rawParams, definition };
}
function rank(segment: string | undefined): number {
  return segment === undefined ? 0 : segment.startsWith("*") ? 1 : segment.startsWith(":") ? 2 : 3;
}
function matchBreadcrumbRoute<TData>(
  path: string,
  definitions: PreparedRoute<TData>[],
): BreadcrumbMatch<TData> {
  const matches = definitions.flatMap((definition) => {
    const result = match(path, definition);
    return result ? [result] : [];
  });
  matches.sort((a, b) => {
    const left = a.definition!.segments;
    const right = b.definition!.segments;
    for (let index = 0; index < Math.max(left.length, right.length); index++) {
      const difference = rank(right[index]) - rank(left[index]);
      if (difference) return difference;
    }
    return 0;
  });
  return matches[0] ?? { path, params: {}, rawParams: {} };
}
function expandBreadcrumbRoute<TData>(
  definition: PreparedRoute<TData>,
  params: Readonly<Record<string, string>>,
  rawParams: Readonly<Record<string, string[]>> = {},
): string {
  return (
    "/" +
    definition.segments
      .map((segment) => {
        if (!segment.startsWith(":") && !segment.startsWith("*")) return segment;
        const value = params[segment.slice(1)];
        if (!Object.hasOwn(params, segment.slice(1)) || typeof value !== "string" || !value)
          throw new Error(`Missing breadcrumb parent parameter: ${segment.slice(1)}`);
        const raw = Object.hasOwn(rawParams, segment.slice(1))
          ? rawParams[segment.slice(1)]
          : undefined;
        if (raw && (segment.startsWith("*") || raw.length === 1)) return raw.join("/");
        return segment.startsWith("*")
          ? value.split("/").map(encodeURIComponent).join("/")
          : encodeURIComponent(value);
      })
      .join("/")
  );
}

export { prepareBreadcrumbRoutes, matchBreadcrumbRoute, expandBreadcrumbRoute };
export type { PreparedRoute, BreadcrumbMatch };
