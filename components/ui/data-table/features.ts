import {
  columnFacetingFeature,
  columnFilteringFeature,
  columnVisibilityFeature,
  constructFilterFn,
  createColumnHelper,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
  type Column,
  type ColumnDef,
  type Row,
  type RowData,
  type ReactTable,
} from "@tanstack/react-table";

const includesAny = constructFilterFn({
  filter: (value: unknown, selected: unknown) =>
    !Array.isArray(selected) || selected.length === 0 || selected.includes(String(value)),
  autoRemove: (value: unknown) => !Array.isArray(value) || value.length === 0,
});

const dataTableFeatures = tableFeatures({
  columnFacetingFeature,
  columnFilteringFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  filterFns: { includesString: filterFn_includesString, includesAny },
  sortFns: {
    text: sortFn_text,
    alphanumeric: sortFn_alphanumeric,
    basic: sortFn_basic,
    datetime: sortFn_datetime,
  },
});

type DataTableFeatures = typeof dataTableFeatures;
type DataTableInstance<T extends RowData> = ReactTable<DataTableFeatures, T>;
type DataTableColumn<T extends RowData> = ColumnDef<DataTableFeatures, T>;
type DataTableResolvedColumn<T extends RowData, TValue = unknown> = Column<
  DataTableFeatures,
  T,
  TValue
>;
type DataTableRow<T extends RowData> = Row<DataTableFeatures, T>;
function createDataTableColumnHelper<T extends RowData>() {
  return createColumnHelper<DataTableFeatures, T>();
}

export { includesAny, dataTableFeatures, createDataTableColumnHelper };
export type {
  DataTableFeatures,
  DataTableInstance,
  DataTableColumn,
  DataTableResolvedColumn,
  DataTableRow,
};
