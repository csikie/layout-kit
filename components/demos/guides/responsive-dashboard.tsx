import { Grid } from "@/components/ui/grid";
import { GridItem } from "@/components/ui/grid-item";
import { Page } from "@/components/ui/page";
import { Stack } from "@/components/ui/stack";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const metrics = [
  { label: "Open orders", value: "24" },
  { label: "Ready to ship", value: "18" },
  { label: "Awaiting payment", value: "6" },
];

export function ResponsiveDashboard({ titleAs = "h1" }: { titleAs?: "h1" | "h2" }) {
  return (
    <Page size="xl">
      <Page.Header
        title="Order dashboard"
        titleAs={titleAs}
        description="Sample fulfillment overview"
      />
      <Page.Body>
        <Stack gap={6}>
          <Grid cols={{ base: 1, sm: 2, lg: 3 }} gap={4}>
            {metrics.map((metric) => (
              <Card key={metric.label}>
                <CardHeader>
                  <CardTitle>{metric.label}</CardTitle>
                  <CardDescription>Current sample snapshot</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{metric.value}</p>
                </CardContent>
              </Card>
            ))}
          </Grid>
          <Grid cols={{ base: 1, lg: 3 }} gap={6} align="start">
            <GridItem span={{ base: 1, lg: 2 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Fulfillment</CardTitle>
                  <CardDescription>18 of 24 orders are ready to ship.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Review the remaining six payments before dispatch.</p>
                </CardContent>
              </Card>
            </GridItem>
            <Card>
              <CardHeader>
                <CardTitle>Next dispatch</CardTitle>
                <CardDescription>Warehouse checklist</CardDescription>
              </CardHeader>
              <CardContent>
                <Stack render={<ul />} gap={2}>
                  <li>Print shipping labels</li>
                  <li>Confirm collection time</li>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Stack>
      </Page.Body>
    </Page>
  );
}
