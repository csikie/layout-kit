const developmentSiteUrl = "http://localhost:3000";

/**
 * Normalises a configured site origin. Throws when `strict` and the value is
 * missing, and whenever the value is not an absolute http(s) URL.
 */
function resolveSiteUrl(value: string | undefined, { strict }: { strict: boolean }): string {
  const raw = value?.trim();
  if (!raw) {
    if (strict) {
      throw new Error(
        "NEXT_PUBLIC_SITE_URL is required for production builds. Set it to the public origin of the docs site (see .env.example).",
      );
    }
    return developmentSiteUrl;
  }

  const url = new URL(raw);
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error(`NEXT_PUBLIC_SITE_URL must be an http(s) URL, received "${raw}".`);
  }
  return url.href.replace(/\/+$/, "");
}

/** Public origin of the docs site and registry, without a trailing slash. */
const siteUrl = resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL, {
  strict: process.env.NODE_ENV === "production",
});

const siteName = "Layout Kit";

/** Source repository on GitHub. */
const repositoryUrl = "https://github.com/csikie/layout-kit";

/** Author credited in the footer and the license. */
const author = { name: "Erik Csiki-Gecse", url: "https://github.com/csikie" };

/** Registry namespace consumers add to their components.json. */
const registryNamespace = "@layout-kit";

export { siteUrl, siteName, registryNamespace, repositoryUrl, author, resolveSiteUrl };
