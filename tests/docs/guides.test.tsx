import { renderToStaticMarkup } from "react-dom/server";
import { expect, test, vi } from "vite-plus/test";
import { ProjectPage } from "@/components/demos/guides/page-layout";
import { ProjectList } from "@/components/demos/guides/stack-row-spacing";
import { ResponsiveDashboard } from "@/components/demos/guides/responsive-dashboard";
import { guideSource } from "@/lib/examples/guide-source";
import { guides } from "@/lib/guides";

vi.mock("server-only", () => ({}));

test.each(guides)("$slug exposes portable source without docs-only imports", (guide) => {
  const code = guideSource(guide.slug);
  expect(code).toContain("export function");
  expect(code).not.toContain("@/components/demos");
  expect(code).not.toContain("@/lib/");
});

test("the page guide keeps the content before its labeled aside and the action targets content", () => {
  document.body.innerHTML = renderToStaticMarkup(<ProjectPage />);
  expect(document.querySelectorAll("h1")).toHaveLength(1);
  expect(document.querySelector("h2")?.textContent).toBe("Delivery checklist");
  expect(document.querySelector("aside")?.getAttribute("aria-label")).toBe("Project summary");
  const content = document.querySelector('[data-slot="page-content"]')!;
  const aside = document.querySelector("aside")!;
  expect(content.compareDocumentPosition(aside) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  const action = document.querySelector<HTMLAnchorElement>('[data-slot="page-header-actions"] a')!;
  expect(document.querySelector(action.hash)?.textContent).toBe("Delivery checklist");
});

test("nested page examples lower their headings without adding a second h1", () => {
  document.body.innerHTML = renderToStaticMarkup(
    <>
      <ResponsiveDashboard titleAs="h2" />
      <ProjectPage titleAs="h2" />
    </>,
  );
  expect(document.querySelector("h1")).toBeNull();
  expect(document.querySelector("h3")?.textContent).toBe("Delivery checklist");
});

test("project rows retain list semantics", () => {
  document.body.innerHTML = renderToStaticMarkup(<ProjectList />);
  expect(document.querySelectorAll("ul > li")).toHaveLength(2);
  expect(document.querySelector("ul > div")).toBeNull();
});
