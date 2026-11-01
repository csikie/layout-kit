import type { MetadataRoute } from "next";
import { flatNavigation } from "@/lib/navigation";
import { siteUrl } from "@/lib/site";

// Generated once at build time for the static export.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return flatNavigation.map((item) => ({ url: new URL(item.href, `${siteUrl}/`).href }));
}
