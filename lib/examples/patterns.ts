import { layoutImports, uiImport } from "./imports";

export const dashboardPattern = `${layoutImports("Grid", "GridItem", "Page", "Row", "Stack")}
${uiImport("badge", "Badge")}
${uiImport("button", "Button")}
${uiImport("card", "Card", "CardContent", "CardHeader", "CardTitle")}

export function AnalyticsDashboard() {
  return (
    <Page size="xl">
      <Page.Header
        title="Analytics"
        description="Last 30 days across all workspaces."
        metadata={<Badge variant="secondary">Live</Badge>}
        actions={
          <Page.Actions>
            <Button variant="outline">Last 30 days</Button>
            <Button variant="outline">Export</Button>
          </Page.Actions>
        }
      />
      <Page.Body>
        <Stack gap={6}>
          {/* 1. Stat tiles: equal cells, responsive count */}
          <Grid cols={{ base: 1, sm: 2, xl: 4 }} gap={4}>
            {stats.map((stat) => (
              <Card key={stat.label}>
                <CardContent><Stat {...stat} /></CardContent>
              </Card>
            ))}
          </Grid>

          {/* 2. Primary chart beside a narrower list */}
          <Grid cols={{ base: 1, lg: 3 }} gap={4}>
            <GridItem span={{ base: 1, lg: 2 }}>
              <Card>
                <CardHeader>
                  <Row justify="between">
                    <CardTitle>Sessions</CardTitle>
                    <span className="text-xs text-muted-foreground">Daily</span>
                  </Row>
                </CardHeader>
                <CardContent><BarChart values={sessions} /></CardContent>
              </Card>
            </GridItem>
            <GridItem>
              <Card>
                <CardHeader><CardTitle>Top pages</CardTitle></CardHeader>
                <CardContent>
                  <Stack gap={3}>
                    {pages.map((page) => (
                      <Row key={page.path} justify="between" gap={3}>
                        <span className="truncate font-mono text-xs">{page.path}</span>
                        <span className="text-xs text-muted-foreground">{page.views}</span>
                      </Row>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </GridItem>
          </Grid>
        </Stack>
      </Page.Body>
    </Page>
  );
}`;

export const settingsPattern = `${layoutImports("Grid", "Page", "Row", "Stack")}
${uiImport("button", "Button")}
${uiImport("card", "Card", "CardContent", "CardDescription", "CardHeader", "CardTitle")}

export function WorkspaceSettings() {
  return (
    <Page size="md">
      <Page.Header
        title="Workspace"
        description="General settings for Studio Co."
      />
      <Page.Body>
        <Stack gap={6}>
          <Card>
            <CardHeader>
              <CardTitle>Identity</CardTitle>
              <CardDescription>Shown in invitations and shared links.</CardDescription>
            </CardHeader>
            <CardContent>
              <Grid cols={{ base: 1, md: 2 }} gap={4}>
                <Field id="workspace" label="Workspace name" defaultValue="Studio Co." />
                <Field id="slug" label="URL slug" defaultValue="studio-co" />
              </Grid>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Defaults</CardTitle>
              <CardDescription>Applied to every new project.</CardDescription>
            </CardHeader>
            <CardContent>
              <Stack gap={4}>
                {defaults.map((item) => (
                  <Row key={item.label} justify="between" gap={4}>
                    <Stack gap={1}>
                      <span className="text-sm font-medium">{item.label}</span>
                      <span className="text-xs text-muted-foreground">{item.hint}</span>
                    </Stack>
                    <Button variant="outline" size="sm">{item.value}</Button>
                  </Row>
                ))}
              </Stack>
            </CardContent>
          </Card>

          <Row justify="end" gap={2}>
            <Button variant="outline">Discard</Button>
            <Button>Save</Button>
          </Row>
        </Stack>
      </Page.Body>
    </Page>
  );
}`;

export const detailPattern = `${layoutImports("Page", "Row", "Stack")}
${uiImport("badge", "Badge")}
${uiImport("button", "Button")}
${uiImport("card", "Card", "CardContent")}
${uiImport("tabs", "Tabs", "TabsContent", "TabsList", "TabsTrigger")}

export function CustomerDetail({ customer }) {
  return (
    <Page size="lg">
      <Page.Header
        title={customer.name}
        description={customer.email}
        metadata={<Badge variant="secondary">{customer.plan}</Badge>}
        actions={
          <Page.Actions>
            <Button variant="outline">Email</Button>
            <Button variant="outline">Edit</Button>
          </Page.Actions>
        }
      />
      {/* The summary rail sits first on large screens and stacks below on small ones. */}
      <Page.Body asidePosition="start" asideWidth="sm" aside={<SummaryCard customer={customer} />}>
        <Tabs defaultValue="activity">
          <TabsList variant="line">
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>
          <TabsContent value="activity">
            <ActivityFeed events={customer.activity} />
          </TabsContent>
          <TabsContent value="invoices">
            <InvoiceList invoices={customer.invoices} />
          </TabsContent>
        </Tabs>
      </Page.Body>
    </Page>
  );
}`;
