import { Stack } from "@/components/ui/stack";
import { Grid } from "@/components/ui/grid";
import { GridItem } from "@/components/ui/grid-item";
import { Row } from "@/components/ui/row";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart, Field } from "../fixtures";

const sessions = [42, 58, 51, 73, 66, 88, 94, 81, 97, 103, 92, 118];
const referrers = [
  { source: "Direct", share: "41%" },
  { source: "Google", share: "27%" },
  { source: "GitHub", share: "18%" },
  { source: "Newsletter", share: "9%" },
];
const deployments = [
  { id: "dpl_8f21", env: "Production", status: "Ready", by: "Mara", when: "12 min ago" },
  { id: "dpl_8f1c", env: "Preview", status: "Ready", by: "Jonas", when: "1 hour ago" },
  { id: "dpl_8f0a", env: "Production", status: "Failed", by: "Theo", when: "Yesterday" },
];

export function GridItemDashboardDemo() {
  return (
    <div className="w-full">
      <Grid cols={{ base: 1, lg: 3 }} gap={4}>
        <GridItem span={{ base: 1, lg: 2 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Weekly sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart values={sessions} />
            </CardContent>
          </Card>
        </GridItem>
        <GridItem>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Top referrers</CardTitle>
            </CardHeader>
            <CardContent>
              <Stack gap={3}>
                {referrers.map((referrer) => (
                  <Row key={referrer.source} justify="between">
                    <span className="text-sm">{referrer.source}</span>
                    <span className="text-sm text-muted-foreground">{referrer.share}</span>
                  </Row>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </GridItem>
        <GridItem span="full">
          <Card>
            <CardHeader>
              <CardTitle>Recent deployments</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Deployment</TableHead>
                    <TableHead>Environment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>By</TableHead>
                    <TableHead className="text-right">When</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deployments.map((deployment) => (
                    <TableRow key={deployment.id}>
                      <TableCell className="font-mono text-xs">{deployment.id}</TableCell>
                      <TableCell>{deployment.env}</TableCell>
                      <TableCell>
                        <Badge
                          variant={deployment.status === "Ready" ? "secondary" : "destructive"}
                        >
                          {deployment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{deployment.by}</TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {deployment.when}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </GridItem>
      </Grid>
    </div>
  );
}

export function GridItemFormDemo() {
  return (
    <div className="rounded-[0.6rem] border bg-background w-full max-w-2xl p-6">
      <Grid cols={6} gap={4}>
        <GridItem span={{ base: "full", md: 3 }}>
          <Field id="gi-street" label="Street address" />
        </GridItem>
        <GridItem span={{ base: "full", md: 3 }}>
          <Field id="gi-unit" label="Apartment, suite" placeholder="Optional" />
        </GridItem>
        <GridItem span={{ base: "full", md: 2 }}>
          <Field id="gi-city" label="City" />
        </GridItem>
        <GridItem span={{ base: 3, md: 2 }}>
          <Field id="gi-region" label="State" />
        </GridItem>
        <GridItem span={{ base: 3, md: 2 }}>
          <Field id="gi-postal" label="Postal code" />
        </GridItem>
      </Grid>
    </div>
  );
}
