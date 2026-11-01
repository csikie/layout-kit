// @vitest-environment jsdom
import { act, createElement, useState } from "react";
import { createRoot } from "react-dom/client";
import { expect, test } from "vite-plus/test";
import {
  ClientDataTable,
  createDataTableColumnHelper,
  createDataTableState,
} from "@/components/ui/data-table/index";

type Item = { id: string; title: string; priority: string };
const helper = createDataTableColumnHelper<Item>();
const columns = helper.columns([
  helper.accessor("title", { header: "Title" }),
  helper.accessor("priority", { header: "Priority", filterFn: "includesAny" }),
]);
const data = [
  { id: "a", title: "Alpha", priority: "low" },
  { id: "b", title: "Beta", priority: "high" },
  { id: "c", title: "Gamma", priority: "low" },
];
const getRowId = (item: Item) => item.id;
function Fixture() {
  const [state, setState] = useState(() =>
    createDataTableState({
      pagination: { pageIndex: 1, pageSize: 1 },
      sorting: [{ id: "title", desc: true }],
      columnFilters: [{ id: "title", value: "a" }],
      columnVisibility: { priority: false },
      rowSelection: { a: true },
    }),
  );
  return createElement(
    "div",
    null,
    createElement(
      "button",
      { onClick: () => setState(createDataTableState()) },
      "Reset table state",
    ),
    createElement("output", { "data-testid": "state" }, JSON.stringify(state)),
    createElement(ClientDataTable<Item>, {
      label: "Controlled records",
      data,
      columns,
      getRowId,
      state,
      onStateChange: setState,
      selectable: true,
      search: { columnId: "title", placeholder: "Search records" },
    }),
  );
}

test("external reset restores every controlled table slice and its visible controls", async () => {
  (
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true;
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  try {
    await act(async () => root.render(createElement(Fixture)));
    expect(container.querySelectorAll("tbody tr")).toHaveLength(1);
    expect(
      container.querySelector<HTMLInputElement>('input[placeholder="Search records"]')?.value,
    ).toBe("a");
    expect(
      [...container.querySelectorAll("th")].some((head) => head.textContent === "Priority"),
    ).toBe(false);
    await act(async () => (container.querySelector("button") as HTMLButtonElement).click());
    expect(JSON.parse(container.querySelector("output")!.textContent!)).toEqual(
      createDataTableState(),
    );
    expect(container.querySelectorAll("tbody tr")).toHaveLength(3);
    expect(
      container.querySelector<HTMLInputElement>('input[placeholder="Search records"]')?.value,
    ).toBe("");
    expect(
      [...container.querySelectorAll("th")].some((head) => head.textContent === "Priority"),
    ).toBe(true);
    expect(container.querySelector('[aria-sort="descending"]')).toBeNull();
    expect(container.querySelector('[role="checkbox"][aria-checked="true"]')).toBeNull();
    expect(container.textContent).toContain("0 of 3 row(s) selected");
    expect(container.textContent).toContain("Rows per page10Page 1 of 1");
    expect(container.querySelector("tbody tr")?.textContent).toContain("Alpha");
  } finally {
    await act(async () => root.unmount());
    container.remove();
  }
});
