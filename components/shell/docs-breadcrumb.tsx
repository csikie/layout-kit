"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppBreadcrumb } from "@/components/ui/app-breadcrumb";
import { docsBreadcrumbRoutes } from "@/lib/breadcrumbs";

// The docs use the shared breadcrumb exactly as an application would: route
// patterns resolve the current pathname, and Next's Link renders every anchor.
// The routes come from the sidebar navigation (lib/navigation.ts).
const routes = docsBreadcrumbRoutes();

export function DocsBreadcrumb() {
  const pathname = usePathname();
  return (
    <AppBreadcrumb
      pathname={pathname}
      routes={routes}
      separator="/"
      labels={{ navigation: "Documentation breadcrumb" }}
      renderLink={({ href, children }) => <Link href={href}>{children}</Link>}
    />
  );
}
