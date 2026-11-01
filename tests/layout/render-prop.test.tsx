import { act, createRef, type Ref } from "react";
import { createRoot } from "react-dom/client";
import { expect, test, vi } from "vite-plus/test";
import { Col } from "@/components/ui/col";
import { Grid } from "@/components/ui/grid";
import { GridItem } from "@/components/ui/grid-item";
import { Page } from "@/components/ui/page";
import { Row } from "@/components/ui/row";
import { Stack } from "@/components/ui/stack";
import { classes, render } from "./render";

const primitives = [
  ["stack", Stack],
  ["row", Row],
  ["col", Col],
  ["grid", Grid],
  ["grid-item", GridItem],
  ["page", Page],
  ["page-actions", Page.Actions],
  ["page-body", Page.Body],
] as const;

test("every primitive renders a div by default and swaps it through render", () => {
  for (const [slot, Component] of primitives) {
    const fallback = render(<Component />);
    expect(fallback.tagName, slot).toBe("DIV");
    expect(fallback.dataset.slot, slot).toBe(slot);

    const swapped = render(<Component render={<section />} />);
    expect(swapped.tagName, slot).toBe("SECTION");
    expect(swapped.dataset.slot, slot).toBe(slot);
  }
});

test("render keeps the primitive's classes and merges the className override", () => {
  const list = render(
    <Stack render={<ul />} gap={2} className="gap-3 pl-4">
      <li>One</li>
    </Stack>,
  );
  expect(list.tagName).toBe("UL");
  expect(classes(list)).toEqual(expect.arrayContaining(["flex", "flex-col", "gap-3", "pl-4"]));
  expect(classes(list)).not.toContain("gap-2");
  expect(list.querySelector("li")?.textContent).toBe("One");
});

test("render passes element props through and keeps the primitive's children", () => {
  const link = render(
    <GridItem render={<a href="/docs" />} span={2}>
      Docs
    </GridItem>,
  );
  expect(link.tagName).toBe("A");
  expect(link.getAttribute("href")).toBe("/docs");
  expect(classes(link)).toContain("col-span-2");
  expect(link.textContent).toBe("Docs");
});

test("Page.Header can opt into a header element", () => {
  const header = render(<Page.Header render={<header />} title="Orders" />);
  expect(header.tagName).toBe("HEADER");
  expect(header.dataset.slot).toBe("page-header");
  expect(header.querySelector("h1")?.textContent).toBe("Orders");
});

test("refs and event handlers reach the rendered element", () => {
  const host = document.createElement("div");
  document.body.append(host);
  const root = createRoot(host);
  const ref = createRef<HTMLElement>();
  const onClick = vi.fn();

  // The ref prop is typed for the default div; at runtime it follows the rendered element.
  const rowRef = ref as Ref<HTMLDivElement>;
  act(() => root.render(<Row ref={rowRef} render={<nav />} onClick={onClick} />));

  expect(ref.current?.tagName).toBe("NAV");
  ref.current!.click();
  expect(onClick).toHaveBeenCalledOnce();

  act(() => root.unmount());
  host.remove();
});
