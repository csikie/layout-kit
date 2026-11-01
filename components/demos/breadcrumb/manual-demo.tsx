import { AppBreadcrumb } from "@/components/ui/app-breadcrumb";

export function ManualBreadcrumbDemo() {
  return (
    <div className="rounded-[0.6rem] border bg-background w-full p-5">
      <AppBreadcrumb
        labels={{ navigation: "Manual breadcrumb example" }}
        items={[
          { id: "docs", label: "Docs", href: "/" },
          { id: "shared", label: "Shared UI", href: "/docs/breadcrumb" },
          { id: "breadcrumb", label: "Breadcrumb" },
        ]}
        separator="/"
      />
    </div>
  );
}
