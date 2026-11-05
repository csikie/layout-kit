import { Page } from "@/components/ui/page";
import { Stack } from "@/components/ui/stack";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ProjectPage({ titleAs = "h1" }: { titleAs?: "h1" | "h2" }) {
  const SectionTitle = titleAs === "h1" ? "h2" : "h3";
  return (
    <Page size="lg">
      <Page.Header
        title="Storefront redesign"
        titleAs={titleAs}
        description="Project brief and delivery checklist"
        actions={
          <Page.Actions>
            <a href="#project-checklist" className={buttonVariants({ variant: "outline" })}>
              View checklist
            </a>
          </Page.Actions>
        }
      />
      <Page.Body
        asideWidth="sm"
        asideBreakpoint="lg"
        asideCollapse="stack"
        asideLabel="Project summary"
        aside={
          <Card>
            <CardHeader>
              <CardTitle>Project summary</CardTitle>
              <CardDescription>Sample project details</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Owner: Product team. Status: In progress.</p>
            </CardContent>
          </Card>
        }
      >
        <Stack gap={6}>
          <p>Make product discovery simpler while keeping the existing checkout.</p>
          <Stack render={<section aria-label="Delivery checklist" />} gap={3}>
            <SectionTitle
              id="project-checklist"
              className="scroll-mt-24 text-lg font-semibold"
              tabIndex={-1}
            >
              Delivery checklist
            </SectionTitle>
            <Stack render={<ul />} gap={2}>
              <li>Review product navigation</li>
              <li>Check small-screen layouts</li>
              <li>Test keyboard navigation</li>
            </Stack>
          </Stack>
        </Stack>
      </Page.Body>
    </Page>
  );
}
