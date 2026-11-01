import type { Metadata } from "next";
import { siteName, siteUrl } from "./site";

const defaultTitle = `${siteName} — Documentation`;
const siteDescription =
  "Small, composable React layout primitives. Explore Stack, Row, Col, Grid, GridItem, and Page with live examples and API references.";

const openGraphDefaults = { type: "website", siteName, locale: "en_US" } as const;

/** Site-wide defaults for the root layout. Pages add their own via `pageMetadata`. */
const rootMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: defaultTitle, template: `%s — ${siteName}` },
  description: siteDescription,
  applicationName: siteName,
  openGraph: { ...openGraphDefaults, title: defaultTitle, description: siteDescription },
  twitter: { card: "summary", title: defaultTitle, description: siteDescription },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

interface PageMetadataOptions {
  /** Page title; the root template appends the site name. Omit for the home page. */
  title?: string;
  description?: string;
  /** Route path, e.g. `/docs/installation`. Resolved against `metadataBase`. */
  path: string;
}

/**
 * Per-page metadata with a canonical URL and matching Open Graph / Twitter
 * fields. Next.js replaces nested metadata objects instead of merging them, so
 * every page states its social fields in full.
 */
function pageMetadata({
  title,
  description = siteDescription,
  path,
}: PageMetadataOptions): Metadata {
  const fullTitle = title ? `${title} — ${siteName}` : defaultTitle;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: { ...openGraphDefaults, title: fullTitle, description, url: path },
    twitter: { card: "summary", title: fullTitle, description },
  };
}

export { rootMetadata, pageMetadata, siteDescription };
export type { PageMetadataOptions };
