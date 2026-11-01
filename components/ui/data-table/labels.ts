const defaultDataTableLabels = {
  search: "Search rows…",
  resetFilters: "Reset filters",
  view: "View",
  columns: "Toggle columns",
  ascending: "Ascending",
  descending: "Descending",
  clearSorting: "Clear sorting",
  hideColumn: "Hide column",
  actions: "Open row actions",
  selectRow: "Select row",
  selectPage: "Select all rows on this page",
  rowsPerPage: "Rows per page",
  firstPage: "Go to first page",
  previousPage: "Go to previous page",
  nextPage: "Go to next page",
  lastPage: "Go to last page",
  clearFilter: "Clear filter",
  filterSearch: "Search options…",
  noOptions: "No matching options.",
  loading: "Loading rows…",
  error: "Unable to load rows.",
  retry: "Try again",
  empty: "No data yet",
  noResults: "No results found",
  noResultsDescription: "Try adjusting or clearing your filters.",
  page: (page: number, count: number) => `Page ${page} of ${count}`,
  selected: (count: number, total: number) => `${count} of ${total} row(s) selected`,
  total: (count: number) => `${count} row(s)`,
};
type DataTableLabels = typeof defaultDataTableLabels;

export { defaultDataTableLabels };
export type { DataTableLabels };
