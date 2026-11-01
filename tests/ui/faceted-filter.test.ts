// @vitest-environment jsdom
import { act, createElement, memo } from "react";
import { createRoot, type Root } from "react-dom/client";
import { useTable } from "@tanstack/react-table";
import { afterEach, beforeEach, expect, test } from "vite-plus/test";
import { DataTableFacetedFilter } from "@/components/ui/data-table/faceted-filter";
import {
  createDataTableColumnHelper,
  dataTableFeatures,
} from "@/components/ui/data-table/features";

type Item = { id: string; priority: string };
const helper = createDataTableColumnHelper<Item>();
const columns = helper.columns([helper.accessor("priority", { filterFn: "includesAny" })]);
const data = [
  { id: "1", priority: "low" },
  { id: "2", priority: "high" },
];
const options = [
  { value: "low", label: "Low" },
  { value: "high", label: "High" },
];
// Stable columns + a memoized caller reproduce the React Compiler's call-site behavior.
const MemoizedFilter = memo(DataTableFacetedFilter<Item>);
function Fixture() {
  const table = useTable({ features: dataTableFeatures, columns, data });
  return createElement(MemoizedFilter, {
    column: table.getColumn("priority")!,
    title: "Priority",
    options,
  });
}
let root: Root;
let container: HTMLDivElement;
beforeEach(async () => {
  (
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true;
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(async () => root.render(createElement(Fixture)));
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
});
async function click(element: Element | null) {
  expect(element).not.toBeNull();
  await act(async () => (element as HTMLElement).click());
}
test("memoized facet reflects selection, multiple values and clearing without reopening", async () => {
  await click(container.querySelector("button"));
  const low = () => document.querySelector('[role="checkbox"][aria-label="Low"]');
  const high = () => document.querySelector('[role="checkbox"][aria-label="High"]');
  await click(low());
  expect(low()?.getAttribute("aria-checked")).toBe("true");
  expect(container.querySelector('[data-slot="badge"]')?.textContent).toBe("1");
  await click(high());
  expect(low()?.getAttribute("aria-checked")).toBe("true");
  expect(high()?.getAttribute("aria-checked")).toBe("true");
  expect(container.querySelector('[data-slot="badge"]')?.textContent).toBe("2");
  await click(
    [...document.querySelectorAll("button")].find(
      (button) => button.textContent === "Clear filter",
    ) ?? null,
  );
  expect(low()?.getAttribute("aria-checked")).toBe("false");
  expect(high()?.getAttribute("aria-checked")).toBe("false");
  expect(container.querySelector('[data-slot="badge"]')).toBeNull();
});
