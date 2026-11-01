import type { PrimitiveSlug } from "@/lib/primitives";
import { layoutImports } from "./imports";

/** One `render` prop sample per primitive, shown on its docs page. */
export const renderExamples: Record<PrimitiveSlug, string> = {
  stack: `${layoutImports("Stack")}

export function Checklist({ items }) {
  return (
    <Stack render={<ul />} gap={2}>
      {items.map((item) => (
        <li key={item.id}>{item.label}</li>
      ))}
    </Stack>
  );
}`,
  row: `${layoutImports("Row")}

export function Pager({ children }) {
  return (
    <Row render={<nav aria-label="Pagination" />} justify="between">
      {children}
    </Row>
  );
}`,
  col: `${layoutImports("Col", "Row")}

export function Workspace({ filters, children }) {
  return (
    <Row align="start" gap={6}>
      <Col render={<aside aria-label="Filters" />} shrink={false} className="w-64">
        {filters}
      </Col>
      <Col grow>{children}</Col>
    </Row>
  );
}`,
  grid: `${layoutImports("Grid")}

export function ProjectList({ projects }) {
  return (
    <Grid render={<ul />} cols={{ base: 1, md: 3 }} gap={4}>
      {projects.map((project) => (
        <li key={project.id}>
          <ProjectCard project={project} />
        </li>
      ))}
    </Grid>
  );
}`,
  "grid-item": `${layoutImports("Grid", "GridItem")}

export function Gallery({ featured, photos }) {
  return (
    <Grid render={<ul />} cols={3} gap={4}>
      <GridItem render={<li />} span={2}>
        <Photo photo={featured} />
      </GridItem>
      {photos.map((photo) => (
        <li key={photo.id}>
          <Photo photo={photo} />
        </li>
      ))}
    </Grid>
  );
}`,
  page: `${layoutImports("Page")}

export function OrdersPage() {
  return (
    <Page render={<main />}>
      {/* A div by default; opt into <header> when this page owns the banner. */}
      <Page.Header render={<header />} title="Orders" />
      <Page.Body render={<section aria-label="Orders" />}>…</Page.Body>
    </Page>
  );
}`,
};
