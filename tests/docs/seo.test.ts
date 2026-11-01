import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "vite-plus/test";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { pageMetadata, rootMetadata } from "@/lib/metadata";
import { flatNavigation } from "@/lib/navigation";
import { primitives } from "@/lib/primitives";
import { siteUrl } from "@/lib/site";

const root = join(import.meta.dirname, "../..");

test("the sitemap lists every navigation page once, as an absolute URL", () => {
  const urls = sitemap().map((entry) => entry.url);
  expect(new Set(urls).size).toBe(urls.length);
  expect(urls).toEqual(flatNavigation.map((item) => new URL(item.href, `${siteUrl}/`).href));
  for (const url of urls) expect(url.startsWith(`${siteUrl}/`)).toBe(true);
  for (const { slug } of primitives) expect(urls).toContain(`${siteUrl}/docs/layout/${slug}`);
});

test("robots allows crawling and points at the sitemap", () => {
  const result = robots();
  expect(result.rules).toEqual({ userAgent: "*", allow: "/" });
  expect(result.sitemap).toBe(`${siteUrl}/sitemap.xml`);
});

test("root metadata resolves relative URLs against the site origin", () => {
  expect(String(rootMetadata.metadataBase)).toBe(`${siteUrl}/`);
});

test("every icon the metadata references ships in public/", () => {
  const icons = rootMetadata.icons as { icon: { url: string }[]; apple: string };
  for (const url of [...icons.icon.map((icon) => icon.url), icons.apple]) {
    expect(() => readFileSync(join(root, "public", url))).not.toThrow();
  }
});

test("page metadata carries a canonical URL and matching social fields", () => {
  const metadata = pageMetadata({
    title: "Stack",
    description: "Vertical rhythm.",
    path: "/docs/layout/stack",
  });
  expect(metadata.title).toBe("Stack");
  expect(metadata.alternates?.canonical).toBe("/docs/layout/stack");
  expect(metadata.openGraph).toMatchObject({
    title: "Stack — Layout Kit",
    description: "Vertical rhythm.",
    url: "/docs/layout/stack",
    siteName: "Layout Kit",
  });
  expect(metadata.twitter).toMatchObject({ title: "Stack — Layout Kit" });
});

test("the home page keeps the default title", () => {
  const metadata = pageMetadata({ path: "/" });
  expect(metadata).not.toHaveProperty("title");
  expect(metadata.openGraph).toMatchObject({ title: "Layout Kit — Documentation", url: "/" });
});

function pageFiles(dir: string): string[] {
  return readdirSync(join(root, dir), { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return pageFiles(path);
    return entry.name === "page.tsx" ? [path] : [];
  });
}

test.each(pageFiles("app"))("%s declares canonical metadata via pageMetadata", (file) => {
  expect(readFileSync(join(root, file), "utf8")).toContain("pageMetadata(");
});
