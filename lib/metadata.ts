import type { Metadata } from "next";
import { siteName, siteUrl } from "./site";

const defaultTitle = `React Layout Primitives for shadcn/ui — ${siteName}`;
const siteDescription =
  "Build responsive React layouts with typed Stack, Row, Grid, and Page components. Install from the shadcn registry, customize the source, and keep your Tailwind styles.";

const socialImage = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "Layout Kit — typed React layout primitives for shadcn/ui and Tailwind CSS",
};

const openGraphDefaults = {
  type: "website",
  siteName,
  locale: "en_US",
  images: [socialImage],
} satisfies NonNullable<Metadata["openGraph"]>;
const twitterDefaults = {
  card: "summary_large_image",
  images: [socialImage.url],
} satisfies NonNullable<Metadata["twitter"]>;

/** Site-wide defaults for the root layout. Pages add their own via `pageMetadata`. */
const rootMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: defaultTitle, template: `%s — ${siteName}` },
  description: siteDescription,
  applicationName: siteName,
  openGraph: { ...openGraphDefaults, title: defaultTitle, description: siteDescription },
  twitter: { ...twitterDefaults, title: defaultTitle, description: siteDescription },
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
    twitter: { ...twitterDefaults, title: fullTitle, description },
  };
}

export { rootMetadata, pageMetadata, siteDescription };
export type { PageMetadataOptions };
