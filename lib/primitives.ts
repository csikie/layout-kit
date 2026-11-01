import type { LayoutExport } from "@/lib/examples/imports";

export type PrimitiveSlug = "stack" | "row" | "col" | "grid" | "grid-item" | "page";

export interface PropDefinition {
  name: string;
  type: string;
  defaultValue?: string;
  description: string;
}

export interface Primitive {
  slug: PrimitiveSlug;
  name: LayoutExport;
  category: "Flex" | "Grid" | "Page";
  tagline: string;
  description: string;
  renders: string;
  /** Primitives shown in the import snippet on the primitive's page. */
  usageImports: LayoutExport[];
  whenToUse: string[];
  props: PropDefinition[];
  notes: string[];
}

const gapType = "Responsive<0 | 1 | 2 | 3 | 4 | 6 | 8 | 12>";
const alignType = 'Responsive<"start" | "center" | "end" | "stretch" | "baseline">';
const justifyType = 'Responsive<"start" | "center" | "end" | "between" | "around" | "evenly">';
const renderProp: PropDefinition = {
  name: "render",
  type: "ReactElement | (props, state) => ReactElement",
  description:
    "Replaces the rendered element, for example render={<ul />}. Classes, data-slot, ref, and event handlers carry over.",
};
const renderNote =
  "Put className on the primitive, not on the render element: the primitive resolves conflicting utilities, while classes on the element are appended as they are.";
const responsiveNote =
  "Responsive props take a single value or a map of base, sm, md, lg, xl, and 2xl. Breakpoints use Tailwind defaults: sm 640px, md 768px, lg 1024px, xl 1280px, 2xl 1536px.";

export const primitives: Primitive[] = [
  {
    slug: "stack",
    name: "Stack",
    category: "Flex",
    tagline: "Vertical rhythm",
    description:
      "Stack lays children out top to bottom with one consistent gap. It is the vertical flex container: the default for forms, lists, card bodies, and anything that reads in order.",
    renders: "div.flex.flex-col",
    usageImports: ["Stack"],
    whenToUse: [
      "Form sections, settings groups, and anything that reads top to bottom.",
      "Replacing ad-hoc margin-bottom utilities with a single owner of spacing.",
      'Fixed-height cards that pin a footer to the bottom with justify="between".',
    ],
    props: [
      {
        name: "gap",
        type: gapType,
        defaultValue: "4",
        description: "Space between children on the Tailwind spacing scale (gap-4 is 1rem).",
      },
      {
        name: "align",
        type: alignType,
        defaultValue: '"stretch"',
        description: "Cross-axis (horizontal) alignment, mapped to the items-* utilities.",
      },
      {
        name: "justify",
        type: justifyType,
        defaultValue: '"start"',
        description: "Main-axis (vertical) distribution, mapped to the justify-* utilities.",
      },
      renderProp,
    ],
    notes: [
      "Stack never adds outer margin. Spacing between a Stack and its siblings belongs to the parent.",
      "Stack and Row accept exactly the same gap, align, and justify values; only the axis and the align default differ.",
      responsiveNote,
      renderNote,
    ],
  },
  {
    slug: "row",
    name: "Row",
    category: "Flex",
    tagline: "Horizontal flow",
    description:
      "Row arranges children left to right and gives you the decisions that matter on a horizontal axis: alignment, distribution, and whether the line may wrap.",
    renders: "div.flex.flex-row",
    usageImports: ["Row"],
    whenToUse: [
      "Toolbars, headers, and footers that pair a title with actions.",
      "Inline metadata such as avatars, labels, and status chips.",
      "Tag clouds or chip lists that need to wrap on narrow screens.",
    ],
    props: [
      { name: "gap", type: gapType, defaultValue: "4", description: "Space between children." },
      {
        name: "align",
        type: alignType,
        defaultValue: '"center"',
        description: "Cross-axis (vertical) alignment, mapped to the items-* utilities.",
      },
      {
        name: "justify",
        type: justifyType,
        defaultValue: '"start"',
        description: "Main-axis (horizontal) distribution, mapped to the justify-* utilities.",
      },
      {
        name: "wrap",
        type: "boolean",
        defaultValue: "false",
        description: "Allow children to flow onto additional lines.",
      },
      renderProp,
    ],
    notes: [
      'Row centers children vertically by default. Use align="start" when children have different heights and should share a top edge.',
      "Wrap a child in Col when it should grow into the remaining width or keep its intrinsic size.",
      responsiveNote,
      renderNote,
    ],
  },
  {
    slug: "col",
    name: "Col",
    category: "Flex",
    tagline: "Flexible regions",
    description:
      "Col is the flex child role. Place it inside a Row or Stack to say how a region shares space: grow into what is left, refuse to shrink, or align itself differently from its siblings. It ships with min-w-0 so long content never breaks a Row.",
    renders: "div.min-w-0",
    usageImports: ["Row", "Col"],
    whenToUse: [
      "Side-by-side regions inside a Row where one side must fill the remaining width.",
      "Media objects: a fixed thumbnail next to flexible, truncating text.",
      "A single child that needs a different cross-axis alignment than the rest of its Row.",
    ],
    props: [
      {
        name: "grow",
        type: "boolean",
        defaultValue: "false",
        description: "Fill the remaining space in the parent flex container.",
      },
      {
        name: "shrink",
        type: "boolean",
        defaultValue: "true",
        description:
          "Allow the region to shrink below its content width. Pass false for fixed rails.",
      },
      {
        name: "self",
        type: '"auto" | "start" | "center" | "end" | "stretch" | "baseline"',
        defaultValue: '"auto"',
        description: "Override the parent's align for this child only (self-* utilities).",
      },
      renderProp,
    ],
    notes: [
      "Col is not a container. To space its children, nest a Stack or Row inside it.",
      "A Col with shrink={false} keeps its intrinsic width. Give it an explicit width class when the content is flexible.",
      renderNote,
    ],
  },
  {
    slug: "grid",
    name: "Grid",
    category: "Grid",
    tagline: "Responsive structure",
    description:
      "Grid declares a column count once and lets it change per breakpoint. It replaces hand-written grid-cols chains with a typed, responsive prop.",
    renders: "div.grid",
    usageImports: ["Grid"],
    whenToUse: [
      "Stat tiles, card galleries, and anything with equal-width cells.",
      "Dashboards where the column count depends on the viewport.",
      "Form layouts with two or three fields per line on wide screens.",
    ],
    props: [
      {
        name: "cols",
        type: "Responsive<1 | 2 | 3 | 4 | 5 | 6 | 12>",
        defaultValue: "1",
        description: "A column count, or a breakpoint map of column counts.",
      },
      {
        name: "gap",
        type: gapType,
        defaultValue: "4",
        description: "Space between rows and columns.",
      },
      {
        name: "align",
        type: alignType,
        defaultValue: '"stretch"',
        description: "Vertical alignment of items within their row.",
      },
      renderProp,
    ],
    notes: [
      responsiveNote,
      "Every class in the responsive maps is written out in the component source, so Tailwind always generates it.",
      renderNote,
    ],
  },
  {
    slug: "grid-item",
    name: "GridItem",
    category: "Grid",
    tagline: "Column spans",
    description:
      "GridItem spans columns inside a Grid, with the same responsive map as cols. Use it for the one or two cells that should be larger than the rest.",
    renders: "div.min-w-0",
    usageImports: ["Grid", "GridItem"],
    whenToUse: [
      "A primary chart that should take two thirds of a dashboard row.",
      "A full-width table below a row of cards.",
      "Form fields that need a whole line on small screens but half a line on large ones.",
    ],
    props: [
      {
        name: "span",
        type: 'Responsive<1 | 2 | 3 | 4 | 5 | 6 | 12 | "full">',
        defaultValue: "1",
        description: 'Columns to span per breakpoint. "full" spans the entire row.',
      },
      renderProp,
    ],
    notes: [
      "GridItem is optional. Cells that span a single column can be plain children of Grid.",
      "A span larger than the parent's column count wraps to its own row, matching CSS Grid behavior.",
      renderNote,
    ],
  },
  {
    slug: "page",
    name: "Page",
    category: "Page",
    tagline: "The complete frame",
    description:
      "Page is the outer frame for a screen. It sets the max width and gutters, renders a header with title, metadata, and actions, and lays out a body with an optional aside on either side.",
    renders: "div > div + div.grid",
    usageImports: ["Page"],
    whenToUse: [
      "Every top-level route in an application shell.",
      "Detail screens that pair primary content with a summary or activity rail.",
      "Settings and list pages that need a consistent title and action area.",
    ],
    props: [
      {
        name: "size",
        type: '"sm" | "md" | "lg" | "xl" | "full"',
        defaultValue: '"lg"',
        description: "Maximum content width: 48rem, 64rem, 80rem, 1600px, or none.",
      },
      {
        name: "gutter",
        type: "boolean",
        defaultValue: "true",
        description: "Responsive horizontal padding (1rem, 1.5rem at sm, 2rem at lg).",
      },
      {
        name: "Header.title",
        type: "ReactNode",
        description: "Rendered as the page h1.",
      },
      {
        name: "Header.description",
        type: "ReactNode",
        description: "Supporting copy below the title.",
      },
      {
        name: "Header.metadata",
        type: "ReactNode",
        description: "Badges or status rendered inline after the title.",
      },
      {
        name: "Header.actions",
        type: "ReactNode",
        description: "Primary actions, usually wrapped in Page.Actions.",
      },
      {
        name: "Body.aside",
        type: "ReactNode",
        description: "Supplementary column. Stacks below the content under lg.",
      },
      {
        name: "Body.asideWidth",
        type: '"sm" | "md" | "lg"',
        defaultValue: '"md"',
        description: "Aside width at lg and above: 16rem, 20rem, or 24rem.",
      },
      {
        name: "Body.asidePosition",
        type: '"start" | "end"',
        defaultValue: '"end"',
        description:
          "Which side the aside sits on at lg and above. The content always keeps the flexible track and comes first in reading order.",
      },
      {
        name: "Body.asideLabel",
        type: "string",
        defaultValue: '"Supplementary information"',
        description: "Accessible name for the aside landmark.",
      },
      {
        ...renderProp,
        description:
          "Replaces the element of Page, Page.Header, Page.Body, or Page.Actions. Page.Header is a div by default; pass render={<header />} when it should be a landmark.",
      },
    ],
    notes: [
      "Page.Header always renders an h1. Headings inside the body should start at h2.",
      "Page.Header is a div, not a header: a <header> outside <main> becomes the page banner, which usually belongs to your app shell.",
      "Empty slots render nothing: aside={false}, metadata={0}, or an empty description leave no wrapper and no stray text.",
      "PageRoot, PageHeader, PageActions, and PageBody are also exported standalone for custom composition.",
      renderNote,
    ],
  },
];

export function findPrimitive(slug: string) {
  return primitives.find((item) => item.slug === slug);
}
