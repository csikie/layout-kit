const guides = [
  {
    slug: "responsive-dashboard",
    title: "Responsive dashboard",
    description:
      "Build a responsive React dashboard with shadcn cards, a mobile-first Grid, and GridItem column spans.",
    primitives: ["grid", "grid-item"],
  },
  {
    slug: "stack-row-spacing",
    title: "Stack and Row spacing",
    description:
      "Manage spacing in React with Stack and Row: parent-owned gaps, wrapping, responsive values, and semantic lists.",
    primitives: ["stack", "row", "col"],
  },
  {
    slug: "page-layout",
    title: "Page with a sidebar",
    description:
      "Compose a React page with a title, actions, and a responsive sidebar while preserving headings and content-first reading order.",
    primitives: ["page"],
  },
] as const;

type GuideSlug = (typeof guides)[number]["slug"];

export { guides };
export type { GuideSlug };
