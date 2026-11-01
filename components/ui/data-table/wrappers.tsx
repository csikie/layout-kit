"use client";

import { useEffect, useMemo, useState } from "react";
import { useTable, type RowData, type Updater } from "@tanstack/react-table";
import { DataTable } from "./data-table";
import { dataTableFeatures } from "./features";
import { createDataTableSelectionColumn } from "./selection";
import { createDataTableState, updateDataTableState, type DataTableState } from "./state";
import type { ClientDataTableProps, ServerDataTableProps } from "./types";

function useDataTable<T extends RowData>(
  props: ClientDataTableProps<T> | ServerDataTableProps<T>,
  server: boolean,
) {
  const [internal, setInternal] = useState(() =>
    createDataTableState("initialState" in props ? props.initialState : undefined),
  );
  const state = props.state ?? internal;
  if (
    !Number.isInteger(state.pagination.pageIndex) ||
    state.pagination.pageIndex < 0 ||
    !Number.isInteger(state.pagination.pageSize) ||
    state.pagination.pageSize <= 0
  ) {
    throw new Error(
      "Data Table requires a nonnegative pageIndex and a positive finite integer pageSize.",
    );
  }
  if ("rowCount" in props && (!Number.isInteger(props.rowCount) || props.rowCount < 0)) {
    throw new Error("ServerDataTable requires a finite nonnegative integer rowCount.");
  }
  if (props.selectable && props.columns.some((column) => column.id === "__selection")) {
    throw new Error("__selection is reserved when Data Table selectable is enabled.");
  }
  const change = (updater: Updater<DataTableState>) => {
    if (props.state === undefined) setInternal(updater);
    props.onStateChange?.(updater);
  };
  const update = <K extends keyof DataTableState>(key: K, updater: Updater<DataTableState[K]>) => {
    change((previous) => updateDataTableState(previous, key, updater));
  };
  const columns = useMemo(
    () =>
      props.selectable
        ? [createDataTableSelectionColumn<T>(props.labels), ...props.columns]
        : props.columns,
    [props.columns, props.labels, props.selectable],
  );
  const table = useTable({
    features: dataTableFeatures,
    data: props.data,
    columns,
    getRowId: props.getRowId,
    state,
    defaultColumn: { filterFn: "includesString" },
    onSortingChange: (updater) => update("sorting", updater),
    onColumnFiltersChange: (updater) => update("columnFilters", updater),
    onPaginationChange: (updater) => update("pagination", updater),
    onColumnVisibilityChange: (updater) => update("columnVisibility", updater),
    onRowSelectionChange: (updater) => update("rowSelection", updater),
    enableRowSelection: props.selectable ?? false,
    manualFiltering: server,
    manualSorting: server,
    manualPagination: server,
    rowCount: "rowCount" in props ? props.rowCount : undefined,
    autoResetPageIndex: false,
  });
  const maxPage = Math.max(0, table.getPageCount() - 1);
  const availableIds = useMemo(
    () => (server ? null : new Set(props.data.map(props.getRowId))),
    [server, props.data, props.getRowId],
  );
  useEffect(() => {
    // The app owns server request/response reconciliation. Never fetch a different page implicitly.
    const invalidSelection =
      availableIds && Object.keys(state.rowSelection).some((id) => !availableIds.has(id));
    if (!server && (state.pagination.pageIndex > maxPage || invalidSelection)) {
      change((previous) => ({
        ...previous,
        pagination: {
          ...previous.pagination,
          pageIndex: Math.min(previous.pagination.pageIndex, maxPage),
        },
        rowSelection: Object.fromEntries(
          Object.entries(previous.rowSelection).filter(([id]) => availableIds?.has(id)),
        ),
      }));
    }
  });
  return table;
}

function ClientDataTable<T extends RowData>(props: ClientDataTableProps<T>) {
  const table = useDataTable(props, false);
  return <DataTable {...props} table={table} />;
}

function ServerDataTable<T extends RowData>(props: ServerDataTableProps<T>) {
  const table = useDataTable(props, true);
  return <DataTable {...props} table={table} />;
}

export { ClientDataTable, ServerDataTable };
