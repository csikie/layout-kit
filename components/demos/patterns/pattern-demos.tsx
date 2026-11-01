import { Col } from "@/components/ui/col";
import { Grid } from "@/components/ui/grid";
import { GridItem } from "@/components/ui/grid-item";
import { Page } from "@/components/ui/page";
import { Row } from "@/components/ui/row";
import { Stack } from "@/components/ui/stack";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, BarChart, Field, Stat, people, stats } from "../fixtures";
import { Eyebrow } from "@/components/docs/typography";

const sessions = [42, 58, 51, 73, 66, 88, 94, 81, 97, 103, 92, 118, 109, 124];
const pages = [
  { path: "/docs/layout/page", views: "12,480" },
  { path: "/docs/layout/grid", views: "9,912" },
  { path: "/", views: "8,301" },
  { path: "/docs/data-table", views: "6,744" },
  { path: "/docs/patterns", views: "4,120" },
];

export function DashboardPatternDemo() {
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
          <Grid cols={{ base: 1, sm: 2, xl: 4 }} gap={4}>
            {stats.map((stat) => (
              <Card key={stat.label}>
                <CardContent>
                  <Stat {...stat} />
                </CardContent>
              </Card>
            ))}
          </Grid>
          <Grid cols={{ base: 1, lg: 3 }} gap={4}>
            <GridItem span={{ base: 1, lg: 2 }}>
              <Card className="h-full">
                <CardHeader>
                  <Row justify="between">
                    <CardTitle>Sessions</CardTitle>
                    <span className="text-xs text-muted-foreground">Daily</span>
                  </Row>
                </CardHeader>
                <CardContent>
                  <BarChart values={sessions} />
                </CardContent>
              </Card>
            </GridItem>
            <GridItem>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Top pages</CardTitle>
                </CardHeader>
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
}

const defaults = [
  { label: "Default visibility", hint: "Who can see new projects.", value: "Workspace" },
  { label: "Review policy", hint: "Approvals required before publishing.", value: "1 reviewer" },
  { label: "Retention", hint: "How long deleted projects are recoverable.", value: "30 days" },
];

export function SettingsPatternDemo() {
  return (
    <Page size="md">
      <Page.Header title="Workspace" description="General settings for Studio Co." />
      <Page.Body>
        <Stack gap={6}>
          <Card>
            <CardHeader>
              <CardTitle>Identity</CardTitle>
              <CardDescription>Shown in invitations and shared links.</CardDescription>
            </CardHeader>
            <CardContent>
              <Grid cols={{ base: 1, md: 2 }} gap={4}>
                <Field id="pattern-workspace" label="Workspace name" defaultValue="Studio Co." />
                <Field id="pattern-slug" label="URL slug" defaultValue="studio-co" />
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
                    <Button variant="outline" size="sm">
                      {item.value}
                    </Button>
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
}

const customer = {
  name: "Priya Natarajan",
  email: "priya@northwind.io",
  plan: "Team",
  summary: [
    ["Customer since", "March 2024"],
    ["Seats", "14 of 20"],
    ["MRR", "$336"],
    ["Owner", "Jonas Lindqvist"],
  ],
  invoices: [
    { id: "INV-2041", amount: "$336.00", status: "Paid", date: "Oct 1" },
    { id: "INV-1987", amount: "$336.00", status: "Paid", date: "Sep 1" },
    { id: "INV-1932", amount: "$288.00", status: "Refunded", date: "Aug 1" },
  ],
};

export function DetailPatternDemo() {
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
      <Page.Body
        asidePosition="start"
        asideWidth="sm"
        aside={
          <Card>
            <CardContent>
              <Stack gap={4}>
                <Row gap={3}>
                  <Avatar name={customer.name} size="lg" />
                  <Stack gap={1}>
                    <span className="text-sm font-medium">{customer.name}</span>
                    <span className="text-xs text-muted-foreground">Northwind</span>
                  </Stack>
                </Row>
                {customer.summary.map(([label, value]) => (
                  <Stack key={label} gap={1}>
                    <Eyebrow>{label}</Eyebrow>
                    <span className="text-sm">{value}</span>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        }
      >
        <Tabs defaultValue="activity">
          <TabsList variant="line">
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>
          <TabsContent value="activity" className="pt-4">
            <Stack gap={3}>
              {people.map((event) => (
                <Row key={event.name} gap={3} align="start">
                  <Avatar name={event.name} size="sm" />
                  <Col grow>
                    <Stack gap={1}>
                      <p className="text-sm">
                        <span className="font-medium">{event.name}</span> {event.action}
                      </p>
                    </Stack>
                  </Col>
                  <span className="text-xs text-muted-foreground">{event.time}</span>
                </Row>
              ))}
            </Stack>
          </TabsContent>
          <TabsContent value="invoices" className="pt-4">
            <Stack gap={2}>
              {customer.invoices.map((invoice) => (
                <Row
                  key={invoice.id}
                  justify="between"
                  gap={3}
                  className="rounded-[0.6rem] border bg-background px-3 py-2"
                >
                  <span className="font-mono text-xs">{invoice.id}</span>
                  <Row gap={3}>
                    <Badge variant={invoice.status === "Paid" ? "secondary" : "outline"}>
                      {invoice.status}
                    </Badge>
                    <span className="text-sm">{invoice.amount}</span>
                    <span className="text-xs text-muted-foreground">{invoice.date}</span>
                  </Row>
                </Row>
              ))}
            </Stack>
          </TabsContent>
          <TabsContent value="notes" className="pt-4">
            <p className="text-sm text-muted-foreground">No notes yet.</p>
          </TabsContent>
        </Tabs>
      </Page.Body>
    </Page>
  );
}
