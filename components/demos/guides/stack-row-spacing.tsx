import { Col } from "@/components/ui/col";
import { Row } from "@/components/ui/row";
import { Stack } from "@/components/ui/stack";

const projects = [
  { name: "Storefront", detail: "Product pages and checkout", status: "In progress" },
  { name: "Documentation", detail: "Examples and API reference", status: "Ready for review" },
];

export function ProjectList() {
  return (
    <Stack gap={{ base: 4, md: 6 }}>
      <Row justify="between" gap={3} wrap>
        <h2 className="text-lg font-semibold">Projects</h2>
        <p className="text-sm text-muted-foreground">Two sample projects</p>
      </Row>
      <Stack render={<ul />} gap={3}>
        {projects.map((project) => (
          <Row key={project.name} render={<li />} gap={3} align="start" wrap>
            <Col grow className="basis-48">
              <Stack gap={1}>
                <h3 className="font-medium">{project.name}</h3>
                <p className="text-sm text-muted-foreground">{project.detail}</p>
              </Stack>
            </Col>
            <span className="text-sm text-muted-foreground">{project.status}</span>
          </Row>
        ))}
      </Stack>
    </Stack>
  );
}
