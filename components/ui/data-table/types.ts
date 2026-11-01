import type { ReactNode } from "react";
import type { RowData, Updater } from "@tanstack/react-table";
import type { DataTableColumn, DataTableInstance } from "./features";
import type { DataTableInitialState, DataTableState } from "./state";
import type { DataTableLabels } from "./labels";

interface DataTableFilterOption {
  value: string;
  label: string;
  icon?: ReactNode;
  /** Server-wide count. Omit when unknown; page-local counts are never shown as totals. */
  count?: number;
}
interface DataTableFilter {
  columnId: string;
  title: string;
  options: DataTableFilterOption[];
}
interface DataTableSearch {
  columnId: string;
  placeholder?: string;
}
interface DataTableViewProps<T extends RowData> {
  table: DataTableInstance<T>;
  label: string;
  search?: DataTableSearch;
  filters?: DataTableFilter[];
  columnLabels?: Record<string, string>;
  labels?: Partial<DataTableLabels>;
  pageSizes?: number[];
  selectable?: boolean;
  loading?: boolean;
  /** Safe display message from the app. Do not pass raw provider errors. */
  error?: string;
  onRetry?: () => void;
  className?: string;
  actions?: ReactNode;
  toolbar?: (table: DataTableInstance<T>) => ReactNode;
  pagination?: (table: DataTableInstance<T>) => ReactNode;
  emptyContent?: ReactNode;
}
interface DataTableBaseProps<T extends RowData> extends Omit<DataTableViewProps<T>, "table"> {
  data: T[];
  columns: DataTableColumn<T>[];
  /** Stable unique ID across every page, filter, sort and refresh. */
  getRowId: (row: T) => string;
}
type DataTableStateChange = (updater: Updater<DataTableState>) => void;
type ClientDataTableProps<T extends RowData> = DataTableBaseProps<T> & {
  initialState?: DataTableInitialState;
} & (
    | { state: DataTableState; onStateChange: DataTableStateChange }
    | { state?: undefined; onStateChange?: DataTableStateChange }
  );
type ServerDataTableProps<T extends RowData> = DataTableBaseProps<T> & {
  state: DataTableState;
  onStateChange: DataTableStateChange;
  /** Total matching rows across all pages, after the server applies the current filters. */
  rowCount: number;
};

export type {
  DataTableFilterOption,
  DataTableFilter,
  DataTableSearch,
  DataTableViewProps,
  DataTableBaseProps,
  DataTableStateChange,
  ClientDataTableProps,
  ServerDataTableProps,
};
