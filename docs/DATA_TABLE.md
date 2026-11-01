# Data Table

Import the shared interface from `@/components/ui/data-table`. It uses TanStack
Table v9, Base UI primitives, the shared Mira theme, and Hugeicons.

## Ownership

- `DataTable`: shared presentation for a compatible table instance.
- `ClientDataTable`: owns client filtering, sorting, faceting and pagination. It
  accepts the complete data set, with internal or externally controlled state.
- `ServerDataTable`: accepts one already processed page and the filtered total
  `rowCount`. All processing is manual. State is required and externally owned.
  It never fetches, sorts, filters, or slices the supplied page.

All wrappers require `label`, `data`, `columns`, and `getRowId`. Row IDs must be
unique and stable across the full data set, including server pages. Keep data
and column definitions referentially stable when their contents have not changed.
These are interactive React components, including the server-data wrapper; the
name does not mean a React Server Component.

## Client table

```tsx
import {
  ClientDataTable,
  createDataTableColumnHelper,
  DataTableColumnHeader,
} from "@/components/ui/data-table";

type Task = { id: string; title: string; status: string };
const helper = createDataTableColumnHelper<Task>();
const columns = helper.columns([
  helper.accessor("title", {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
  }),
  helper.accessor("status", { header: "Status", filterFn: "includesAny" }),
]);

<ClientDataTable
  label="Tasks"
  data={tasks}
  columns={columns}
  getRowId={(task) => task.id}
  initialState={{ pagination: { pageSize: 25 } }}
  selectable
  search={{ columnId: "title", placeholder: "Filter tasks…" }}
  filters={[
    {
      columnId: "status",
      title: "Status",
      options: [
        { value: "todo", label: "Todo" },
        { value: "done", label: "Done" },
      ],
    },
  ]}
/>;
```

Text filters default to `includesString`. Faceted filters use string column
values and string option values, and require `filterFn: "includesAny"` on their
columns. Multiple values in a facet are ORed; different column filters are ANDed.
Custom TanStack filter/sort functions can be supplied directly in column defs.
The shared registry also includes `text`, `alphanumeric`, `basic`, and `datetime`
sort functions. No global declaration merging is required.

For a controlled client table:

```tsx
const [state, setState] = useState(() => createDataTableState());
<ClientDataTable {...props} state={state} onStateChange={setState} />;
```

`onStateChange` receives a value or functional updater, like a React state setter.
With controlled state it is required. `initialState` applies only to internal
state on mount. Do not switch between controlled and uncontrolled ownership.

## Server table

```tsx
const [state, setState] = useState(() => createDataTableState());
const { pagination, sorting, columnFilters } = state;

// Your data source observes these three query slices, cancels stale requests,
// handles errors and passes only a matching response back to the table.
const result = useTaskQuery({ pagination, sorting, columnFilters });

<ServerDataTable
  label="Tasks"
  columns={columns}
  data={result.rows}
  rowCount={result.filteredTotal}
  getRowId={(task) => task.id}
  state={state}
  onStateChange={setState}
  loading={result.loading}
  error={result.safeErrorMessage}
  onRetry={result.retry}
  search={{ columnId: "title" }}
  filters={filters}
  selectable
/>;
```

`rowCount` is a finite nonnegative integer representing all matching records
across pages, not the size of the current page. Pagination is zero-based; page
size must be a positive finite integer. Translate sorting and filter state into
your endpoint's supported query parameters in the app, with server-side
validation and authorization. Never pass raw provider error objects as UI text.

The app owns request cancellation, debouncing, persistence, and reconciliation
when totals change or deleting the last row makes a page invalid. If necessary,
update the page index and refetch. The wrapper does not issue implicit requests.
Do not refetch on changes to `rowSelection` or `columnVisibility`.

Server facet counts are optional `count` values in each filter option, supplied
by the app for the current query. Unknown counts are omitted. Page-local counts
are never presented as server-wide totals. Client counts are computed from the
full local data, including the other active column filters.

The docs server example is a cancellable, delayed local simulation. It does not
connect to an HTTP endpoint or persist changes.

## State behavior

`createDataTableState(initial?)` creates defaults for `pagination`, `sorting`,
`columnFilters`, `columnVisibility`, and `rowSelection`. The first page is index
zero and the default page size is ten.

- Sorting and filtering changes reset the page index atomically to zero.
- A page-size change resets the page index to zero.
- Filtering clears selection. Paging and sorting preserve selected IDs.
- The header checkbox selects or deselects the current page only; mixed
  selections use an indeterminate checkbox.
- The selection count counts selected IDs across pages. It does not claim that
  unloaded server records are available. Do not derive a cross-page bulk action
  from `getSelectedRowModel()` alone: only loaded rows exist in that model.
- Client refreshes remove selected IDs absent from the complete data set. Server
  selection survives page refreshes; the app must remove deleted or invalid IDs
  before bulk operations. `__selection` is reserved when `selectable` is true.
- Client pages are clamped after the data set shrinks. Server pages remain app-owned.

## Customize or replace parts

The default wrappers accept:

- `search`, `filters`, `columnLabels`, `actions`, `pageSizes` and `selectable`.
- `loading`, `error`, `onRetry`, `emptyContent`, `className` and `label`.
- `labels`: partial override of `defaultDataTableLabels`, including pagination,
  selection count and total formatting functions. Pass matching labels to column
  headers and row-action triggers created in your column definitions as well.
- `toolbar(table)` and `pagination(table)`: render replacements; return `null` to
  hide a part.

```tsx
<ClientDataTable
  {...props}
  labels={{ empty: "Nincs adat", resetFilters: "Szűrők törlése" }}
  toolbar={(table) => (
    <DataTableToolbar
      table={table}
      search={{ columnId: "title" }}
      actions={<Button onClick={createTask}>New task</Button>}
    />
  )}
/>
```

`DataTableToolbar`, `DataTableFacetedFilter`, `DataTableColumnHeader`,
`DataTableViewOptions`, `DataTablePagination`, `DataTableRowActions`, and
`createDataTableSelectionColumn` are separately exported. Consumers with their
own compatible TanStack instance may pass it to `DataTable` and compose these
controls themselves using the exported `dataTableFeatures` and feature types.

`DataTableRowActions` accepts the original record and action definitions with
stable `id`, `label`, `onSelect`, optional `icon`, `disabled`, and
`variant: "destructive"`. Async operations and feedback remain app-owned. For
nested/grouped menus or custom confirmations, compose the shared DropdownMenu
primitives directly in an actions column.

Loading and errors hide stale body rows. Pagination is disabled while loading or
an error is displayed; search and filters remain available. Empty filtered
results and an empty data set have separate messages. The table scrolls within
its container on small screens; toolbars and pagination wrap. It uses native
HTML table semantics and Base UI keyboard interactions, not spreadsheet arrow-key
navigation, row virtualization, inline editing, column resizing or drag ordering.
