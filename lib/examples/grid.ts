import { layoutImports, uiImport } from "./imports";

export const gridStats = `${layoutImports("Grid")}
${uiImport("card", "Card", "CardContent")}

export function StatTiles({ stats }) {
  return (
    <Grid cols={{ base: 1, sm: 2, lg: 4 }} gap={4}>
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent>
            <Stat {...stat} />
          </CardContent>
        </Card>
      ))}
    </Grid>
  );
}`;

export const gridForm = `${layoutImports("Grid", "Row", "Stack")}
${uiImport("button", "Button")}

export function ShippingForm() {
  return (
    <Stack gap={6}>
      <Grid cols={{ base: 1, md: 2 }} gap={4}>
        <Field id="first" label="First name" />
        <Field id="last" label="Last name" />
        <Field id="company" label="Company" placeholder="Optional" />
        <Field id="phone" label="Phone" type="tel" />
      </Grid>
      <Row justify="end">
        <Button>Continue to payment</Button>
      </Row>
    </Stack>
  );
}`;

export function gridPlayground(cols: string, gap: string) {
  return `<Grid cols={${cols}} gap={${gap}}>
  {Array.from({ length: 8 }, (_, index) => (
    <Box key={index}>{String(index + 1).padStart(2, "0")}</Box>
  ))}
</Grid>`;
}

export const gridColOptions = ["2", "3", "4", "{ base: 2, md: 4 }"] as const;
export const gridGapOptions = ["2", "4", "8"] as const;
export type GridCols = (typeof gridColOptions)[number];
export type GridGap = (typeof gridGapOptions)[number];
export type GridVariantKey = `${GridCols}|${GridGap}`;

export function gridVariantKeys(): GridVariantKey[] {
  return gridColOptions.flatMap((cols) => gridGapOptions.map((gap) => `${cols}|${gap}` as const));
}
