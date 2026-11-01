import { layoutImports, uiImport } from "./imports";

export const gridItemDashboard = `${layoutImports("Grid", "GridItem")}
${uiImport("card", "Card", "CardContent", "CardHeader", "CardTitle")}

export function Overview() {
  return (
    <Grid cols={{ base: 1, lg: 3 }} gap={4}>
      {/* Two thirds of the row on large screens, full width below. */}
      <GridItem span={{ base: 1, lg: 2 }}>
        <Card>
          <CardHeader><CardTitle>Weekly sessions</CardTitle></CardHeader>
          <CardContent><BarChart values={sessions} /></CardContent>
        </Card>
      </GridItem>

      <GridItem>
        <Card>
          <CardHeader><CardTitle>Top referrers</CardTitle></CardHeader>
          <CardContent><ReferrerList /></CardContent>
        </Card>
      </GridItem>

      {/* A table always wants the whole row. */}
      <GridItem span="full">
        <Card>
          <CardHeader><CardTitle>Recent deployments</CardTitle></CardHeader>
          <CardContent><DeploymentTable /></CardContent>
        </Card>
      </GridItem>
    </Grid>
  );
}`;

export const gridItemForm = `${layoutImports("Grid", "GridItem")}

export function AddressFields() {
  return (
    <Grid cols={6} gap={4}>
      <GridItem span={{ base: "full", md: 3 }}>
        <Field id="street" label="Street address" />
      </GridItem>
      <GridItem span={{ base: "full", md: 3 }}>
        <Field id="unit" label="Apartment, suite" placeholder="Optional" />
      </GridItem>
      <GridItem span={{ base: "full", md: 2 }}>
        <Field id="city" label="City" />
      </GridItem>
      <GridItem span={{ base: 3, md: 2 }}>
        <Field id="region" label="State" />
      </GridItem>
      <GridItem span={{ base: 3, md: 2 }}>
        <Field id="postal" label="Postal code" />
      </GridItem>
    </Grid>
  );
}`;
