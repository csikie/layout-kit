import { expect, test } from "vite-plus/test";
import { isRenderable, Page, PageBody, PageRoot } from "@/components/ui/page";
import { classes, render } from "./render";

test("Page exposes the compound parts", () => {
  expect(Page).toBe(PageRoot);
  expect(Page.Body).toBe(PageBody);
});

test("Page root applies size and gutter classes", () => {
  const page = render(<Page />);
  expect(page.dataset.slot).toBe("page");
  expect(classes(page)).toEqual(expect.arrayContaining(["mx-auto", "max-w-7xl", "px-4"]));

  const full = render(<Page size="full" gutter={false} />);
  expect(classes(full)).toContain("max-w-none");
  expect(classes(full)).not.toContain("px-4");
});

test("Page.Header renders a div with an h1 and optional slots", () => {
  const header = render(
    <Page.Header
      title="Orders"
      description="All orders"
      metadata={<span>Beta</span>}
      actions={<button type="button">New</button>}
    />,
  );
  // A div by default, so it never competes with the app shell's banner landmark.
  expect(header.tagName).toBe("DIV");
  expect(header.dataset.slot).toBe("page-header");
  expect(header.querySelector("h1")?.textContent).toBe("Orders");
  expect(header.querySelector('[data-slot="page-description"]')?.textContent).toBe("All orders");
  expect(header.querySelector('[data-slot="page-metadata"]')?.textContent).toBe("Beta");
  expect(header.querySelector('[data-slot="page-header-actions"] button')).not.toBeNull();
});

test("Page.Header skips empty slots and never prints a bare 0", () => {
  const header = render(<Page.Header title="Orders" metadata={0} description="" actions={false} />);
  expect(header.querySelector('[data-slot="page-metadata"]')).toBeNull();
  expect(header.querySelector('[data-slot="page-description"]')).toBeNull();
  expect(header.querySelector('[data-slot="page-header-actions"]')).toBeNull();
  expect(header.textContent).toBe("Orders");
});

test("Page.Body without an aside is a single column", () => {
  const body = render(<Page.Body>Main</Page.Body>);
  expect(body.dataset.slot).toBe("page-body");
  expect(body.querySelector("aside")).toBeNull();
  expect(classes(body).some((name) => name.startsWith("lg:grid-cols-"))).toBe(false);
});

test("Page.Body aside={false} renders no aside", () => {
  const body = render(<Page.Body aside={false}>Main</Page.Body>);
  expect(body.querySelector("aside")).toBeNull();
  expect(body.hasAttribute("data-aside-position")).toBe(false);
});

test("Page.Body with the aside at the end keeps the flexible track first", () => {
  const body = render(
    <Page.Body aside="Summary" asideWidth="sm">
      Main
    </Page.Body>,
  );
  const content = body.querySelector('[data-slot="page-content"]')!;
  const aside = body.querySelector("aside")!;

  expect(classes(body)).toContain("lg:grid-cols-[minmax(0,1fr)_16rem]");
  expect(classes(content)).toEqual(expect.arrayContaining(["lg:col-start-1", "lg:row-start-1"]));
  expect(classes(aside)).toEqual(expect.arrayContaining(["lg:col-start-2", "lg:row-start-1"]));
  expect(aside.getAttribute("aria-label")).toBe("Supplementary information");
  expect(aside.dataset.slot).toBe("page-aside");
});

test("Page.Body with the aside at the start mirrors the template so content stays wide", () => {
  const body = render(
    <Page.Body aside="Filters" asidePosition="start" asideWidth="lg" asideLabel="Filters">
      Main
    </Page.Body>,
  );
  const content = body.querySelector('[data-slot="page-content"]')!;
  const aside = body.querySelector("aside")!;

  expect(body.dataset.asidePosition).toBe("start");
  expect(classes(body)).toContain("lg:grid-cols-[24rem_minmax(0,1fr)]");
  expect(classes(body)).not.toContain("lg:grid-cols-[minmax(0,1fr)_24rem]");
  // Content lands in the flexible second track, the aside in the fixed first track.
  expect(classes(content)).toEqual(expect.arrayContaining(["lg:col-start-2", "lg:row-start-1"]));
  expect(classes(aside)).toEqual(expect.arrayContaining(["lg:col-start-1", "lg:row-start-1"]));
  expect(classes(content).some((name) => name.includes("order"))).toBe(false);
  // DOM order stays content first for reading order.
  expect(body.firstElementChild).toBe(content);
  expect(aside.getAttribute("aria-label")).toBe("Filters");
});

test("Page.Actions renders a wrapping action row", () => {
  const actions = render(<Page.Actions className="gap-4" />);
  expect(actions.dataset.slot).toBe("page-actions");
  expect(classes(actions)).toContain("gap-4");
  expect(classes(actions)).not.toContain("gap-2");
});

test("isRenderable treats empty slot values as nothing", () => {
  for (const value of [null, undefined, false, true, "", 0]) {
    expect(isRenderable(value)).toBe(false);
  }
  for (const value of ["x", 1, <span key="a" />, [<span key="b" />]]) {
    expect(isRenderable(value)).toBe(true);
  }
});
