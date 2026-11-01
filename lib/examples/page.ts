import { layoutImports, uiImport } from "./imports";

export const pageOverview = `${layoutImports("Col", "Grid", "Page", "Row", "Stack")}
${uiImport("badge", "Badge")}
${uiImport("button", "Button")}
${uiImport("card", "Card", "CardContent")}

export function ProjectPage({ project }) {
  return (
    <Page size="xl">
      <Page.Header
        title={project.name}
        description="Design system rollout across web and mobile."
        metadata={<Badge>Active</Badge>}
        actions={
          <Page.Actions>
            <Button variant="outline">Share</Button>
            <Button>New task</Button>
          </Page.Actions>
        }
      />
      <Page.Body
        asideWidth="sm"
        aside={
          <Card>
            <CardContent>
              <DetailList items={project.details} />
            </CardContent>
          </Card>
        }
      >
        <Stack gap={6}>
          <Grid cols={{ base: 1, sm: 3 }} gap={4}>
            {project.stats.map((stat) => (
              <Card key={stat.label}>
                <CardContent><Stat {...stat} /></CardContent>
              </Card>
            ))}
          </Grid>
          <ActivityFeed events={project.activity} />
        </Stack>
      </Page.Body>
    </Page>
  );
}`;

export function pagePlayground(size: string, position: string, width: string) {
  return `<Page size="${size}">
  <Page.Header
    title="Workspace settings"
    description="Manage members, billing, and integrations."
    actions={<Page.Actions><Button>Invite</Button></Page.Actions>}
  />
  <Page.Body asidePosition="${position}" asideWidth="${width}" aside={<Box>Aside</Box>}>
    <Box>Content</Box>
  </Page.Body>
</Page>`;
}

export const pageSizeOptions = ["sm", "md", "lg", "full"] as const;
export const pagePositionOptions = ["end", "start"] as const;
export const pageWidthOptions = ["sm", "md", "lg"] as const;
export type PageSizeOption = (typeof pageSizeOptions)[number];
export type PagePosition = (typeof pagePositionOptions)[number];
export type PageWidth = (typeof pageWidthOptions)[number];
export type PageVariantKey = `${PageSizeOption}|${PagePosition}|${PageWidth}`;

export function pageVariantKeys(): PageVariantKey[] {
  return pageSizeOptions.flatMap((size) =>
    pagePositionOptions.flatMap((position) =>
      pageWidthOptions.map((width) => `${size}|${position}|${width}` as const),
    ),
  );
}
