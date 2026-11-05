import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "vite-plus/test";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { pageMetadata, rootMetadata } from "@/lib/metadata";
import { flatNavigation } from "@/lib/navigation";
import { primitives } from "@/lib/primitives";
import { siteUrl } from "@/lib/site";
import { breadcrumbData, serializeStructuredData } from "@/lib/structured-data";
import { GET as documentationIndex } from "@/app/llms.txt/route";

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

test("social cards use the shipped 1200 by 630 PNG on individual pages too", () => {
  const page = pageMetadata({ title: "Stack", path: "/docs/layout/stack" });
  expect(page.openGraph).toMatchObject({ images: [{ url: "/og.png", width: 1200, height: 630 }] });
  expect(page.twitter).toMatchObject({ card: "summary_large_image", images: ["/og.png"] });
  const png = readFileSync(join(root, "public/og.png"));
  expect(png.subarray(1, 4).toString()).toBe("PNG");
  expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1200, 630]);
});

test.each(flatNavigation.filter((item) => item.href !== "/"))(
  "$href has structured breadcrumbs with real destinations and the correct current page",
  (item) => {
    const entries = breadcrumbData(item.href).itemListElement;
    expect(entries.length).toBeGreaterThanOrEqual(2);
    expect(entries.at(-1)).toMatchObject({ name: item.title, item: `${siteUrl}${item.href}` });
    for (const [index, entry] of entries.entries()) {
      expect(entry.position).toBe(index + 1);
      expect(
        flatNavigation.some((page) => new URL(page.href, `${siteUrl}/`).href === entry.item),
      ).toBe(true);
    }
  },
);

test("JSON-LD escapes script terminators while preserving its JSON value", () => {
  const data = { name: "</script><script>alert(1)</script>" };
  const serialized = serializeStructuredData(data);
  expect(serialized).not.toContain("<");
  expect(JSON.parse(serialized)).toEqual(data);
});

test("the documentation index includes every published page from navigation", async () => {
  const response = documentationIndex();
  expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8");
  const content = await response.text();
  for (const item of flatNavigation) {
    expect(content).toContain(new URL(item.href, `${siteUrl}/`).href);
  }
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
  expect(metadata.openGraph).toMatchObject({
    title: "React Layout Primitives for shadcn/ui — Layout Kit",
    url: "/",
  });
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
