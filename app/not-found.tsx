import { DocHeader, DocLayout } from "@/components/docs/doc-page";
import { SectionLink } from "@/components/demos/overview-demos";

export default function NotFound() {
  return (
    <DocLayout>
      <DocHeader
        eyebrow="404"
        title="Nothing here"
        description="The page you were looking for does not exist or has moved."
      />
      <SectionLink href="/">Back to the introduction</SectionLink>
    </DocLayout>
  );
}
