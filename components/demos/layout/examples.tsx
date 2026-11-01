import { CodeBlock } from "@/components/docs/code-block";
import { Example, ExampleGroup } from "@/components/docs/doc-page";
import type { PlaygroundVariants } from "@/components/docs/playground";
import { Preview } from "@/components/docs/preview";
import type { PrimitiveSlug } from "@/lib/primitives";
import {
  stackFeed,
  stackForm,
  stackPinned,
  stackPlayground,
  stackResponsive,
  type StackGap,
} from "@/lib/examples/stack";
import {
  rowMetadata,
  rowPlayground,
  rowTags,
  rowToolbar,
  rowVariantKeys,
  type RowVariantKey,
} from "@/lib/examples/row";
import { colMedia, colSelf, colSplit } from "@/lib/examples/col";
import {
  gridForm,
  gridPlayground,
  gridStats,
  gridVariantKeys,
  type GridVariantKey,
} from "@/lib/examples/grid";
import { gridItemDashboard, gridItemForm } from "@/lib/examples/grid-item";
import {
  pageOverview,
  pagePlayground,
  pageVariantKeys,
  type PageVariantKey,
} from "@/lib/examples/page";
import {
  StackFeedDemo,
  StackFormDemo,
  StackPinnedDemo,
  StackPlayground,
  StackResponsiveDemo,
} from "./stack-demos";
import { RowMetadataDemo, RowPlayground, RowTagsDemo, RowToolbarDemo } from "./row-demos";
import { ColMediaDemo, ColSelfDemo, ColSplitDemo } from "./col-demos";
import { GridFormDemo, GridPlayground, GridStatsDemo } from "./grid-demos";
import { GridItemDashboardDemo, GridItemFormDemo } from "./grid-item-demos";
import { PageOverviewDemo, PagePlayground } from "./page-demos";

/** Builds the pre-highlighted code map a client playground switches between. */
function variants<K extends string>(keys: K[], source: (key: K) => string): PlaygroundVariants<K> {
  return Object.fromEntries(
    keys.map((key) => {
      const text = source(key);
      return [key, { source: text, code: <CodeBlock code={text} copy={false} /> }];
    }),
  ) as PlaygroundVariants<K>;
}

function Live({ source, ...props }: Omit<React.ComponentProps<typeof Preview>, "code">) {
  return <Preview {...props} source={source} code={<CodeBlock code={source} copy={false} />} />;
}

export function PrimitiveExamples({ slug }: { slug: PrimitiveSlug }) {
  switch (slug) {
    case "stack":
      return (
        <ExampleGroup>
          <Example
            title="Form section"
            description="Nested Stacks own every vertical distance: the section gap, the field gap, and the heading gap are each declared once."
          >
            <Live source={stackForm} align="center">
              <StackFormDemo />
            </Live>
          </Example>
          <Example
            title="Activity feed"
            description="A tight gap keeps repeated rows scannable. Row handles the horizontal structure, and a growing Col gives the text the remaining width."
          >
            <Live source={stackFeed} align="center">
              <StackFeedDemo />
            </Live>
          </Example>
          <Example
            title="Pinned card footer"
            description='justify="between" pushes the price and button to the bottom of fixed-height cards, regardless of how long the summary runs.'
          >
            <Live source={stackPinned}>
              <StackPinnedDemo />
            </Live>
          </Example>
          <Example
            title="Responsive gap"
            description="gap, align, and justify all accept a breakpoint map. Resize the window to watch the spacing open up."
          >
            <Live source={stackResponsive} align="center">
              <StackResponsiveDemo />
            </Live>
          </Example>
          <Example
            title="Gap scale"
            description="Every value on the scale maps to a Tailwind gap utility."
          >
            <StackPlayground
              variants={variants<StackGap>(["2", "4", "8"], (gap) => stackPlayground(Number(gap)))}
            />
          </Example>
        </ExampleGroup>
      );
    case "row":
      return (
        <ExampleGroup>
          <Example
            title="List toolbar"
            description='A Row with justify="between" holds two inner Rows. The outer wrap keeps both groups usable on narrow screens.'
          >
            <Live source={rowToolbar}>
              <RowToolbarDemo />
            </Live>
          </Example>
          <Example
            title="Inline metadata"
            description="Mixed-height children, such as an avatar beside text and a badge, line up on their vertical centers by default."
          >
            <Live source={rowMetadata} align="center">
              <RowMetadataDemo />
            </Live>
          </Example>
          <Example
            title="Wrapping chips"
            description="With wrap enabled the gap applies between lines as well as between items."
          >
            <Live source={rowTags} align="center">
              <RowTagsDemo />
            </Live>
          </Example>
          <Example
            title="Alignment and distribution"
            description="Combine justify and align to see how each maps onto the row."
          >
            <RowPlayground
              variants={variants<RowVariantKey>(rowVariantKeys(), (key) => {
                const [justify, align] = key.split("-");
                return rowPlayground(justify!, align!);
              })}
            />
          </Example>
        </ExampleGroup>
      );
    case "col":
      return (
        <ExampleGroup>
          <Example
            title="Fixed rail, flexible content"
            description="The navigation rail opts out of shrinking and sets its own width. The content Col grows into the rest; a Stack inside each Col spaces its children."
          >
            <Live source={colSplit} align="center">
              <ColSplitDemo />
            </Live>
          </Example>
          <Example
            title="Media object with truncation"
            description="Col sets min-w-0, which is what lets a long filename truncate instead of pushing the download button out of the row."
          >
            <Live source={colMedia} align="center">
              <ColMediaDemo />
            </Live>
          </Example>
          <Example
            title="Per-child alignment"
            description='The Row aligns its children to the top so multi-line text reads well. self="center" lets the action button opt back into centering.'
          >
            <Live source={colSelf} align="center">
              <ColSelfDemo />
            </Live>
          </Example>
        </ExampleGroup>
      );
    case "grid":
      return (
        <ExampleGroup>
          <Example
            title="Stat tiles"
            description="One column on phones, two on tablets, four on desktops. Resize the window to watch the map apply."
          >
            <Live source={gridStats}>
              <GridStatsDemo />
            </Live>
          </Example>
          <Example
            title="Two-column form"
            description="Fields share a line from the md breakpoint. Below it they stack without any extra markup."
          >
            <Live source={gridForm} align="center">
              <GridFormDemo />
            </Live>
          </Example>
          <Example
            title="Columns and gap"
            description="Switch between fixed counts and a responsive map."
          >
            <GridPlayground
              variants={variants<GridVariantKey>(gridVariantKeys(), (key) => {
                const [cols, gap] = key.split("|");
                return gridPlayground(cols!, gap!);
              })}
            />
          </Example>
        </ExampleGroup>
      );
    case "grid-item":
      return (
        <ExampleGroup>
          <Example
            title="Dashboard spans"
            description="The chart takes two of three columns on large screens, the referrer list takes one, and the table spans the full row."
          >
            <Live source={gridItemDashboard}>
              <GridItemDashboardDemo />
            </Live>
          </Example>
          <Example
            title="Responsive address form"
            description="A six-column grid gives fine control: half-width fields at md, full width below, and a three-up last line that collapses to pairs."
          >
            <Live source={gridItemForm} align="center">
              <GridItemFormDemo />
            </Live>
          </Example>
        </ExampleGroup>
      );
    case "page":
      return (
        <ExampleGroup>
          <Example
            title="Project overview"
            description="A complete screen: header with metadata and actions, a stat grid in the body, and a detail rail as the aside. The New task button updates the aside."
          >
            <Live source={pageOverview} padding="none">
              <PageOverviewDemo />
            </Live>
          </Example>
          <Example
            title="Size, aside width, and position"
            description="The dashed outline marks the Page element so the max width is visible inside the preview."
          >
            <PagePlayground
              variants={variants<PageVariantKey>(pageVariantKeys(), (key) => {
                const [size, position, width] = key.split("|");
                return pagePlayground(size!, position!, width!);
              })}
            />
          </Example>
        </ExampleGroup>
      );
  }
}
