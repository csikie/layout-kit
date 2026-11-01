function unsafeCharacters(value: string): boolean {
  for (let index = 0; index < value.length; index++) {
    const code = value.charCodeAt(index);
    if (code <= 32 || code === 127 || code === 92) return true;
  }
  return false;
}
/** Accept only navigation URLs, never executable schemes or protocol-relative hosts. */
function assertBreadcrumbHref(href: string): void {
  if (!href || unsafeCharacters(href) || href.startsWith("//")) {
    throw new Error("Breadcrumb href must be a nonempty safe navigation URL.");
  }
  if (href.startsWith("/") || href.startsWith("#") || href.startsWith("?")) return;
  try {
    const url = new URL(href);
    if (url.protocol === "https:" || url.protocol === "http:") return;
  } catch {
    /* Report a consistent configuration error below. */
  }
  throw new Error("Breadcrumb href must be root-relative, a hash/query, or an HTTP(S) URL.");
}
function decodeBreadcrumbSegment(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    throw new Error("Breadcrumb pathname contains invalid URL encoding.");
  }
}
function normalizeBreadcrumbPath(pathname: string): string {
  if (!pathname.startsWith("/") || pathname.startsWith("//") || unsafeCharacters(pathname)) {
    throw new Error("Breadcrumb pathname must be an absolute path, not a URL or hash route.");
  }
  const path = pathname.split(/[?#]/u)[0]!.replace(/\/+/gu, "/").replace(/\/$/u, "") || "/";
  for (const segment of path.split("/").slice(1)) {
    const decoded = decodeBreadcrumbSegment(segment);
    if (decoded === "." || decoded === "..")
      throw new Error("Breadcrumb paths cannot contain dot segments.");
  }
  return path;
}
function breadcrumbSegments(path: string): string[] {
  return path === "/" ? [] : path.slice(1).split("/");
}
function formatBreadcrumbSegment(segment: string): string {
  return segment
    .replace(/[-_]+/gu, " ")
    .replace(/\s+/gu, " ")
    .trim()
    .replace(/^\p{L}/u, (letter) => letter.toLocaleUpperCase());
}

export {
  assertBreadcrumbHref,
  decodeBreadcrumbSegment,
  normalizeBreadcrumbPath,
  breadcrumbSegments,
  formatBreadcrumbSegment,
};
