import type React from "react";
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

test("Page.Header titleAs picks the heading level and keeps the title styling", () => {
  const header = render(<Page.Header title="Orders" titleAs="h3" />);
  const title = header.querySelector('[data-slot="page-title"]')!;
  expect(title.tagName).toBe("H3");
  expect(classes(title)).toContain("text-2xl");
  expect(header.querySelector("h1")).toBeNull();
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

  expect(classes(body)).toEqual(
    expect.arrayContaining([
      "[--page-aside-width:16rem]",
      "lg:grid-cols-[minmax(0,1fr)_var(--page-aside-width)]",
    ]),
  );
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
  expect(classes(body)).toEqual(
    expect.arrayContaining([
      "[--page-aside-width:24rem]",
      "lg:grid-cols-[var(--page-aside-width)_minmax(0,1fr)]",
    ]),
  );
  expect(classes(body)).not.toContain("lg:grid-cols-[minmax(0,1fr)_var(--page-aside-width)]");
  // Content lands in the flexible second track, the aside in the fixed first track.
  expect(classes(content)).toEqual(expect.arrayContaining(["lg:col-start-2", "lg:row-start-1"]));
  expect(classes(aside)).toEqual(expect.arrayContaining(["lg:col-start-1", "lg:row-start-1"]));
  expect(classes(content).some((name) => name.includes("order"))).toBe(false);
  // DOM order stays content first for reading order.
  expect(body.firstElementChild).toBe(content);
  expect(aside.getAttribute("aria-label")).toBe("Filters");
});

test("Page.Body moves the aside beside the content at asideBreakpoint", () => {
  const body = render(
    <Page.Body aside="Summary" asideBreakpoint="xl">
      Main
    </Page.Body>,
  );
  const content = body.querySelector('[data-slot="page-content"]')!;
  const aside = body.querySelector("aside")!;

  expect(classes(body)).toContain("xl:grid-cols-[minmax(0,1fr)_var(--page-aside-width)]");
  expect(classes(body).some((name) => name.startsWith("lg:"))).toBe(false);
  expect(classes(content)).toEqual(expect.arrayContaining(["xl:col-start-1", "xl:row-start-1"]));
  expect(classes(aside)).toEqual(expect.arrayContaining(["xl:col-start-2", "xl:row-start-1"]));
  // The default collapse stacks the aside, so it stays visible below xl.
  expect(classes(aside)).not.toContain("hidden");
});

test('Page.Body asideCollapse="hide" hides the aside below the breakpoint', () => {
  const aside = render(
    <Page.Body aside="On this page" asideBreakpoint="2xl" asideCollapse="hide">
      Main
    </Page.Body>,
  ).querySelector("aside")!;
  expect(classes(aside)).toEqual(expect.arrayContaining(["hidden", "2xl:block"]));
});

test("Page.Body takes a custom aside width and aside props", () => {
  const body = render(
    <Page.Body
      aside="Contents"
      style={{ "--page-aside-width": "13rem" } as React.CSSProperties}
      asideLabel="On this page"
      asideProps={{ className: "sticky top-24", id: "toc" }}
    >
      Main
    </Page.Body>,
  );
  const aside = body.querySelector("aside")!;

  expect(body.style.getPropertyValue("--page-aside-width")).toBe("13rem");
  expect(classes(aside)).toEqual(expect.arrayContaining(["min-w-0", "sticky", "top-24"]));
  expect(aside.id).toBe("toc");
  expect(aside.getAttribute("aria-label")).toBe("On this page");
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
