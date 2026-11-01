import {
  functionalUpdate,
  type Updater,
  type PaginationState,
  type SortingState,
  type ColumnFiltersState,
  type ColumnVisibilityState,
  type RowSelectionState,
} from "@tanstack/react-table";

interface DataTableQuery {
  pagination: PaginationState;
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
}
interface DataTableState extends DataTableQuery {
  columnVisibility: ColumnVisibilityState;
  rowSelection: RowSelectionState;
}
type DataTableInitialState = Partial<Omit<DataTableState, "pagination">> & {
  pagination?: Partial<PaginationState>;
};
function createDataTableState(initial: DataTableInitialState = {}): DataTableState {
  return {
    sorting: [],
    columnFilters: [],
    columnVisibility: {},
    rowSelection: {},
    ...initial,
    pagination: { pageIndex: 0, pageSize: 10, ...initial.pagination },
  };
}

/** Reset the page atomically with a query change; IDs retain selection across pages. */
function updateDataTableState<K extends keyof DataTableState>(
  state: DataTableState,
  key: K,
  updater: Updater<DataTableState[K]>,
): DataTableState {
  const value = functionalUpdate(updater, state[key]);
  const next = { ...state, [key]: value };
  if (key === "sorting" || key === "columnFilters") {
    next.pagination = { ...state.pagination, pageIndex: 0 };
  }
  if (key === "columnFilters") next.rowSelection = {};
  if (key === "pagination" && next.pagination.pageSize !== state.pagination.pageSize) {
    next.pagination = { ...next.pagination, pageIndex: 0 };
  }
  return next;
}

export { createDataTableState, updateDataTableState };
export type { DataTableQuery, DataTableState, DataTableInitialState };
