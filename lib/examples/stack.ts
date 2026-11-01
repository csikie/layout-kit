import { layoutImports, uiImport } from "./imports";

export const stackForm = `${layoutImports("Row", "Stack")}
${uiImport("button", "Button")}
${uiImport("input", "Input")}

export function ProfileForm() {
  return (
    <Stack gap={6}>
      <Stack gap={1}>
        <h3 className="text-sm font-semibold">Profile</h3>
        <p className="text-xs text-muted-foreground">
          This is how teammates see you across the workspace.
        </p>
      </Stack>

      <Stack gap={4}>
        <Field id="name" label="Full name" defaultValue="Mara Okafor" />
        <Field id="email" label="Email" type="email" defaultValue="mara@studio.co" />
        <Field id="title" label="Title" placeholder="Design lead" />
      </Stack>

      <Row gap={2} justify="end">
        <Button variant="outline">Cancel</Button>
        <Button>Save changes</Button>
      </Row>
    </Stack>
  );
}`;

export const stackFeed = `${layoutImports("Col", "Row", "Stack")}

export function ActivityFeed({ events }) {
  return (
    <Stack gap={3}>
      {events.map((event) => (
        <Row key={event.id} gap={3} align="start">
          <Avatar name={event.name} size="sm" />
          <Col grow>
            <Stack gap={1}>
              <p className="text-sm">
                <span className="font-medium">{event.name}</span> {event.action}
              </p>
              <span className="text-xs text-muted-foreground">{event.role}</span>
            </Stack>
          </Col>
          <span className="text-xs text-muted-foreground">{event.time}</span>
        </Row>
      ))}
    </Stack>
  );
}`;

export const stackPinned = `${layoutImports("Grid", "Stack")}
${uiImport("button", "Button")}

export function PlanCards({ plans }) {
  return (
    <Grid cols={{ base: 1, sm: 3 }} gap={4}>
      {plans.map((plan) => (
        <Stack key={plan.name} justify="between" gap={6} className="h-56 rounded-lg border p-4">
          <Stack gap={2}>
            <span className="text-sm font-semibold">{plan.name}</span>
            <span className="text-xs text-muted-foreground">{plan.summary}</span>
          </Stack>
          {/* justify="between" pins the footer regardless of copy length. */}
          <Stack gap={3}>
            <span className="text-[1.6rem] leading-[1.1] font-semibold tracking-[-0.04em]">{plan.price}</span>
            <Button variant={plan.featured ? "default" : "outline"}>Choose {plan.name}</Button>
          </Stack>
        </Stack>
      ))}
    </Grid>
  );
}`;

export const stackResponsive = `${layoutImports("Stack")}

export function Article() {
  return (
    // Tight on phones, roomy from md, generous on wide screens.
    <Stack gap={{ base: 3, md: 6, xl: 8 }}>
      <h2 className="text-lg font-semibold">Release notes</h2>
      <p className="text-sm text-muted-foreground">Responsive gaps without a single media query.</p>
      <p className="text-sm text-muted-foreground">Every breakpoint class is written out in source.</p>
    </Stack>
  );
}`;

export function stackPlayground(gap: number) {
  return `<Stack gap={${gap}}>
  <Box>Header</Box>
  <Box>Content</Box>
  <Box>Footer</Box>
</Stack>`;
}

export const stackGapOptions = ["2", "4", "8"] as const;
export type StackGap = (typeof stackGapOptions)[number];
