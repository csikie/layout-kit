import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vite-plus/test";
import {
  ClientDataTable,
  ServerDataTable,
  createDataTableState,
  updateDataTableState,
  createDataTableColumnHelper,
  type DataTableState,
} from "@/components/ui/data-table";

interface RecordRow {
  id: string;
  title: string;
  category: string;
  score: number;
}
const helper = createDataTableColumnHelper<RecordRow>();
const columns = helper.columns([
  helper.accessor("title", { header: "Title" }),
  helper.accessor("category", { header: "Category", filterFn: "includesAny" }),
  helper.accessor("score", { header: "Score" }),
]);
const data: RecordRow[] = [
  { id: "a", title: "Alpha", category: "open", score: 2 },
  { id: "b", title: "Beta", category: "closed", score: 10 },
  { id: "c", title: "Gamma", category: "open", score: 1 },
];
const base = { label: "Records", columns, getRowId: (row: RecordRow) => row.id };
const noop = () => {};
function renderClient(state: DataTableState, rows = data) {
  return renderToStaticMarkup(
    createElement(ClientDataTable<RecordRow>, {
      ...base,
      data: rows,
      state,
      onStateChange: noop,
    }),
  );
}

describe("query state transitions", () => {
  test("resets the page atomically on sorting and preserves selected row IDs", () => {
    const state = createDataTableState({ pagination: { pageIndex: 4 }, rowSelection: { a: true } });
    const next = updateDataTableState(state, "sorting", () => [{ id: "title", desc: true }]);
    expect(next.pagination).toEqual({ pageIndex: 0, pageSize: 10 });
    expect(next.rowSelection).toEqual({ a: true });
    expect(state.pagination.pageIndex).toBe(4);
  });
  test("clears selection on filter changes but preserves it across pages", () => {
    const state = createDataTableState({ rowSelection: { a: true } });
    const page = updateDataTableState(state, "pagination", { pageIndex: 1, pageSize: 10 });
    expect(page.rowSelection).toEqual({ a: true });
    const filtered = updateDataTableState(page, "columnFilters", [
      { id: "category", value: ["open"] },
    ]);
    expect(filtered.rowSelection).toEqual({});
    expect(filtered.pagination.pageIndex).toBe(0);
  });
  test("page size changes return to page one without resetting unrelated state", () => {
    const state = createDataTableState({
      pagination: { pageIndex: 3 },
      columnVisibility: { category: false },
    });
    const next = updateDataTableState(state, "pagination", (previous) => ({
      ...previous,
      pageSize: 25,
    }));
    expect(next.pagination).toEqual({ pageIndex: 0, pageSize: 25 });
    expect(next.columnVisibility).toEqual({ category: false });
  });
});

describe("public table wrappers", () => {
  test("client processing filters, sorts numerically, and then paginates", () => {
    const state = createDataTableState({
      pagination: { pageSize: 1 },
      columnFilters: [{ id: "category", value: ["open"] }],
      sorting: [{ id: "score", desc: false }],
    });
    const html = renderClient(state);
    expect(html).toContain("Gamma");
    expect(html).not.toContain("Alpha");
    expect(html).not.toContain("Beta");
    expect(html).toContain("Page 1 of 2");
    const numeric = renderClient(createDataTableState({ sorting: [{ id: "score", desc: false }] }));
    expect(numeric.indexOf("Gamma")).toBeLessThan(numeric.indexOf("Alpha"));
    expect(numeric.indexOf("Alpha")).toBeLessThan(numeric.indexOf("Beta"));
  });
  test("server wrapper preserves server order, filtering and page contents", () => {
    const state = createDataTableState({
      pagination: { pageIndex: 2, pageSize: 2 },
      sorting: [{ id: "title", desc: true }],
      columnFilters: [{ id: "title", value: "no local matches" }],
    });
    const html = renderToStaticMarkup(
      createElement(ServerDataTable<RecordRow>, {
        ...base,
        data: data.slice(0, 2),
        rowCount: 12,
        state,
        onStateChange: noop,
      }),
    );
    expect(html).toContain("Alpha");
    expect(html).toContain("Beta");
    expect(html.indexOf("Alpha")).toBeLessThan(html.indexOf("Beta"));
    expect(html).toContain("Page 3 of 6");
  });
  test("loading and errors never expose stale rows as the current result", () => {
    for (const status of [{ loading: true }, { error: "Safe error message" }]) {
      const html = renderToStaticMarkup(
        createElement(ServerDataTable<RecordRow>, {
          ...base,
          ...status,
          data,
          rowCount: 3,
          state: createDataTableState(),
          onStateChange: noop,
          onRetry: noop,
        }),
      );
      expect(html).not.toContain("Alpha");
      expect(html).not.toContain("Beta");
      expect(html).toContain(status.loading ? "Loading rows" : "Safe error message");
      if (status.error) {
        const body = html.slice(html.indexOf("<tbody"), html.indexOf("</tbody>"));
        expect(body).toContain('data-slot="empty"');
        expect(body).toContain('role="alert"');
        expect(body).toContain("Safe error message");
        expect(body).toContain("Try again");
        expect(html.split("Safe error message")).toHaveLength(2);
      }
    }
  });
  test("empty results use zero pages and localized text", () => {
    const html = renderToStaticMarkup(
      createElement(ClientDataTable<RecordRow>, {
        ...base,
        data: [],
        labels: { empty: "Nincs adat", page: (page, count) => `${page}/${count}` },
      }),
    );
    expect(html).toContain("Nincs adat");
    expect(html).toContain("0/0");
  });
  test("column visibility and custom slots use the same controlled instance", () => {
    const html = renderToStaticMarkup(
      createElement(ClientDataTable<RecordRow>, {
        ...base,
        data,
        state: createDataTableState({ columnVisibility: { category: false } }),
        onStateChange: noop,
        toolbar: (table) => createElement("span", null, `Custom rows: ${table.getRowCount()}`),
        pagination: () => null,
      }),
    );
    expect(html).toContain("Custom rows: 3");
    expect(html).not.toContain(">Category<");
    expect(html).not.toContain("Rows per page");
  });
});

test("invalid pagination and server totals fail with useful diagnostics", () => {
  for (const pagination of [
    { pageIndex: -1, pageSize: 10 },
    { pageIndex: 0, pageSize: 0 },
    { pageIndex: 0, pageSize: Infinity },
  ]) {
    expect(() => renderClient(createDataTableState({ pagination }))).toThrow("pageIndex");
  }
  expect(() =>
    renderToStaticMarkup(
      createElement(ServerDataTable<RecordRow>, {
        ...base,
        data,
        rowCount: -1,
        state: createDataTableState(),
        onStateChange: noop,
      }),
    ),
  ).toThrow("rowCount");
});
