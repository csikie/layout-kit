import { resolveBreadcrumbs } from "@/components/ui/app-breadcrumb/resolve";
import { docsBreadcrumbRoutes } from "./breadcrumbs";
import { siteDescription } from "./metadata";
import { author, siteName, siteUrl } from "./site";

const websiteData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  url: `${siteUrl}/`,
  name: siteName,
  description: siteDescription,
  inLanguage: "en",
  author: { "@type": "Person", name: author.name, url: author.url },
};

/** Reuse the visible trail; omit group labels that have no destination page. */
function breadcrumbData(path: string) {
  const entries = resolveBreadcrumbs({
    pathname: path,
    routes: docsBreadcrumbRoutes(),
    unknown: "error",
  }).filter((entry) => entry.href);
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: entries.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.label,
      item: new URL(entry.href!, `${siteUrl}/`).href,
    })),
  };
}

/** Prevent HTML in a JSON string from terminating the script element. */
function serializeStructuredData(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export { websiteData, breadcrumbData, serializeStructuredData };
