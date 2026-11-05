import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";
import { flatNavigation } from "../lib/navigation.ts";
import { productionSiteUrl } from "../lib/site.ts";

// Run after `vp run build`: inspect the export, without executing page scripts.
const output = fileURLToPath(new URL("../out/", import.meta.url));
const titles = new Set();
const descriptions = new Set();
const sitemap = readFileSync(`${output}sitemap.xml`, "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
const expectedUrls = flatNavigation.map((item) => new URL(item.href, productionSiteUrl).href);
assert.deepEqual(
  sitemapUrls.sort(),
  [...expectedUrls].sort(),
  "Sitemap must match published pages",
);

for (const item of flatNavigation) {
  const path = item.href === "/" ? "index.html" : `${item.href.slice(1)}.html`;
  const url = new URL(item.href, productionSiteUrl).href;
  const dom = new JSDOM(readFileSync(`${output}${path}`, "utf8"), { url });
  const doc = dom.window.document;
  const meta = (selector) => doc.querySelector(selector)?.getAttribute("content");
  assert.equal(doc.documentElement.lang, "en", `${path}: document language`);
  assert.equal(doc.querySelectorAll("h1").length, 1, `${path}: one h1`);
  assert.equal(doc.querySelectorAll("main").length, 1, `${path}: one main`);
  assert.equal(doc.querySelectorAll('link[rel="canonical"]').length, 1, `${path}: one canonical`);
  assert.equal(doc.querySelector('link[rel="canonical"]').href, url, `${path}: canonical`);
  assert(!/noindex|nosnippet/.test(meta('meta[name="robots"]') ?? ""), `${path}: indexable`);
  assert(doc.title.trim() && !titles.has(doc.title), `${path}: unique title`);
  titles.add(doc.title);
  const description = meta('meta[name="description"]');
  assert(description?.trim() && !descriptions.has(description), `${path}: unique description`);
  descriptions.add(description);
  // Next serializes an origin-only OG URL without '/', which is equivalent.
  assert.equal(new URL(meta('meta[property="og:url"]')).href, url, `${path}: social URL`);
  assert.equal(
    meta('meta[property="og:image"]'),
    `${productionSiteUrl}/og.png`,
    `${path}: OG image`,
  );
  assert.equal(meta('meta[name="twitter:card"]'), "summary_large_image", `${path}: Twitter card`);
  const data = [...doc.querySelectorAll('script[type="application/ld+json"]')].map((script) =>
    JSON.parse(script.textContent),
  );
  assert(
    data.some((entry) => entry["@type"] === "WebSite" && entry.url === `${productionSiteUrl}/`),
    `${path}: website data`,
  );
  if (item.href !== "/") {
    const trail = data.find((entry) => entry["@type"] === "BreadcrumbList");
    assert.equal(trail?.itemListElement.at(-1).item, url, `${path}: breadcrumb destination`);
    for (const crumb of trail.itemListElement) {
      assert(expectedUrls.includes(crumb.item), `${path}: breadcrumb must link to a real page`);
    }
  }
  for (const anchor of doc.querySelectorAll('a[href^="/docs/"]')) {
    assert(
      expectedUrls.includes(new URL(anchor.href).origin + new URL(anchor.href).pathname),
      `${path}: broken docs link ${anchor.href}`,
    );
  }
  for (const link of doc.querySelectorAll('link[rel="stylesheet"], script[src]')) {
    const asset = new URL(link.href ?? link.src);
    if (asset.origin === productionSiteUrl)
      assert(
        existsSync(`${output}${decodeURIComponent(asset.pathname)}`),
        `${path}: missing asset ${asset.pathname}`,
      );
  }
  dom.window.close();
}

const robots = readFileSync(`${output}robots.txt`, "utf8");
assert(robots.includes("Allow: /"), "Robots must allow crawling");
assert(!robots.includes("Disallow: /"), "Robots must not block the site");
assert(robots.includes(`${productionSiteUrl}/sitemap.xml`), "Robots sitemap origin");
const index = readFileSync(`${output}llms.txt`, "utf8");
for (const url of expectedUrls)
  assert(index.includes(url), `Documentation index is missing ${url}`);
const notFound = new JSDOM(readFileSync(`${output}404.html`, "utf8"));
assert(
  notFound.window.document.querySelector('meta[name="robots"]')?.content.includes("noindex"),
  "404 must be noindex",
);
notFound.window.close();
assert(existsSync(`${output}og.png`), "Export must contain the social image");
console.log(
  `Verified ${flatNavigation.length} exported pages: metadata, headings, structured data, docs links, assets, sitemap, robots, llms.txt, and 404 noindex.`,
);
