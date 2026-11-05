import { guides } from "./guides";

export interface NavItem {
  title: string;
  href: string;
  description: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const navigation: NavGroup[] = [
  {
    label: "Getting started",
    items: [
      { title: "Introduction", href: "/", description: "What Layout Kit is and how it fits." },
      {
        title: "Installation",
        href: "/docs/installation",
        description: "Install the primitives from the shadcn registry.",
      },
      {
        title: "Principles",
        href: "/docs/principles",
        description: "The rules the primitives follow.",
      },
    ],
  },
  {
    label: "Layout primitives",
    items: [
      { title: "Stack", href: "/docs/layout/stack", description: "Vertical rhythm." },
      { title: "Row", href: "/docs/layout/row", description: "Horizontal flow." },
      { title: "Col", href: "/docs/layout/col", description: "Flexible columns." },
      { title: "Grid", href: "/docs/layout/grid", description: "Responsive structure." },
      { title: "GridItem", href: "/docs/layout/grid-item", description: "Column spans." },
      { title: "Page", href: "/docs/layout/page", description: "The complete frame." },
    ],
  },
  {
    label: "Patterns",
    items: [
      {
        title: "Compositions",
        href: "/docs/patterns",
        description: "Full screens built from the primitives.",
      },
    ],
  },
  {
    label: "Guides",
    items: guides.map((guide) => ({
      title: guide.title,
      href: `/docs/guides/${guide.slug}`,
      description: guide.description,
    })),
  },
  {
    label: "Shared UI",
    items: [
      {
        title: "Data Table",
        href: "/docs/data-table",
        description: "Client and server tables with one surface.",
      },
      {
        title: "Breadcrumb",
        href: "/docs/breadcrumb",
        description: "Route-aware trails with overflow.",
      },
    ],
  },
];

export const flatNavigation: NavItem[] = navigation.flatMap((group) => group.items);

export function findNavItem(href: string) {
  return flatNavigation.find((item) => item.href === href);
}

export function adjacentPages(href: string) {
  const index = flatNavigation.findIndex((item) => item.href === href);
  return {
    previous: index > 0 ? flatNavigation[index - 1] : undefined,
    next: index >= 0 && index < flatNavigation.length - 1 ? flatNavigation[index + 1] : undefined,
  };
}
