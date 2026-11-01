import { layoutImports, uiImport } from "./imports";

export const rowToolbar = `${layoutImports("Row")}
${uiImport("button", "Button")}
${uiImport("input", "Input")}

export function ListToolbar() {
  return (
    <Row justify="between" gap={3} wrap>
      <Row gap={2}>
        <Input placeholder="Search projects…" className="w-56" />
        <Button variant="outline">
          <HugeiconsIcon icon={FilterIcon} data-icon="inline-start" /> Filter
        </Button>
      </Row>
      <Row gap={2}>
        <Button variant="ghost">Export</Button>
        <Button>
          <HugeiconsIcon icon={Add01Icon} data-icon="inline-start" /> New project
        </Button>
      </Row>
    </Row>
  );
}`;

export const rowMetadata = `${layoutImports("Row")}
${uiImport("badge", "Badge")}

export function CommentHeader() {
  return (
    <Row gap={2} align="center" wrap>
      <Avatar name="Jonas Lindqvist" size="sm" />
      <span className="text-sm font-medium">Jonas Lindqvist</span>
      <Badge variant="secondary">Maintainer</Badge>
      <span className="text-xs text-muted-foreground">· edited 2 hours ago</span>
    </Row>
  );
}`;

export const rowTags = `${layoutImports("Row")}
${uiImport("badge", "Badge")}

export function TopicTags({ topics }) {
  return (
    <Row gap={2} wrap>
      {topics.map((topic) => (
        <Badge key={topic} variant="outline">{topic}</Badge>
      ))}
    </Row>
  );
}`;

export function rowPlayground(justify: string, align: string) {
  return `<Row gap={4} justify="${justify}" align="${align}" className="h-32">
  <Box className="h-10">One</Box>
  <Box className="h-16">Two</Box>
  <Box className="h-12">Three</Box>
</Row>`;
}

export const rowJustifyOptions = ["start", "center", "end", "between", "around", "evenly"] as const;
export const rowAlignOptions = ["start", "center", "end", "stretch", "baseline"] as const;
export type RowJustify = (typeof rowJustifyOptions)[number];
export type RowAlign = (typeof rowAlignOptions)[number];
export type RowVariantKey = `${RowJustify}-${RowAlign}`;

export function rowVariantKeys(): RowVariantKey[] {
  return rowJustifyOptions.flatMap((justify) =>
    rowAlignOptions.map((align) => `${justify}-${align}` as const),
  );
}
