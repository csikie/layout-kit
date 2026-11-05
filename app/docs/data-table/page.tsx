import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { Callout } from "@/components/docs/callout";
import { CodeBlock } from "@/components/docs/code-block";
import { DocHeader, DocLayout, DocPagination, Section } from "@/components/docs/doc-page";
import { PropsTable } from "@/components/docs/props-table";
import { DataTableModes } from "@/components/demos/data-table/modes";
import type { PropDefinition } from "@/lib/primitives";
import { uiImport, uiImportPrefix } from "@/lib/examples/imports";
import { Stack } from "@/components/ui/stack";
import { ProseList } from "@/components/docs/typography";

export const metadata: Metadata = pageMetadata({
  title: "React Data Table with TanStack Table",
  description:
    "Build React data tables with TanStack Table, sorting, filtering, pagination, and row selection. Explore client and server-controlled examples.",
  path: "/docs/data-table",
});

const clientCode = `${uiImport("data-table", "ClientDataTable", "createDataTableColumnHelper")}

const helper = createDataTableColumnHelper<Task>();
const columns = helper.columns([
  helper.accessor("title", { header: "Title" }),
  helper.accessor("status", { header: "Status", filterFn: "includesAny" }),
]);

export function Tasks({ tasks }: { tasks: Task[] }) {
  return (
    <ClientDataTable
      label="Tasks"
      columns={columns}
      data={tasks}
      getRowId={(task) => task.id}
      search={{ columnId: "title", placeholder: "Filter tasks…" }}
      filters={[{ columnId: "status", title: "Status", options: statuses }]}
      selectable
    />
  );
}`;

const controlledCode = `${uiImport("data-table", "ClientDataTable", "createDataTableState")}

export function Tasks({ tasks }: { tasks: Task[] }) {
  // Own the state when you need to persist it, sync it to the URL, or reset it.
  const [state, setState] = useState(() => createDataTableState({ pagination: { pageSize: 20 } }));
  return (
    <ClientDataTable
      label="Tasks"
      columns={columns}
      data={tasks}
      getRowId={(task) => task.id}
      state={state}
      onStateChange={setState}
      selectable
    />
  );
}`;

const serverCode = `${uiImport("data-table", "ServerDataTable", "createDataTableState")}

export function Tasks() {
  const [state, setState] = useState(() => createDataTableState());
  // Your app fetches on pagination, sorting, and columnFilters changes.
  // Cancel stale requests and hand the matching response back to the table.
  const result = useTasksQuery(state);

  return (
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
    />
  );
}`;

const columnsCode = `import {
  createDataTableColumnHelper,
  DataTableColumnHeader,
  DataTableRowActions,
} from "${uiImportPrefix}/data-table";

const helper = createDataTableColumnHelper<Task>();

export const columns = helper.columns([
  helper.accessor("id", { header: "Task", enableSorting: false, enableHiding: false }),
  helper.accessor("title", {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
    cell: ({ row }) => <span className="truncate">{row.original.title}</span>,
  }),
  // Faceted columns use the shared multi-value filter.
  helper.accessor("status", {
    filterFn: "includesAny",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
  }),
  helper.display({
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        row={row.original}
        label={\`Actions for \${row.original.id}\`}
        actions={[
          { id: "complete", label: "Mark complete", onSelect: completeTask },
          { id: "delete", label: "Delete", variant: "destructive", onSelect: deleteTask },
        ]}
      />
    ),
  }),
]);`;

const composeCode = `${uiImport("data-table", "DataTableToolbar")}

<ClientDataTable
  {...props}
  // Replace a part without replacing the table. Return null to hide it.
  toolbar={(table) => (
    <DataTableToolbar
      table={table}
      search={{ columnId: "title" }}
      actions={<Button onClick={createTask}>New task</Button>}
    />
  )}
  pagination={null}
  emptyContent={<EmptyState onCreate={createTask} />}
/>`;

const sharedProps: PropDefinition[] = [
  { name: "label", type: "string", description: "Accessible name for the table region." },
  {
    name: "columns",
    type: "DataTableColumn<T>[]",
    description: "Built with createDataTableColumnHelper.",
  },
  {
    name: "data",
    type: "T[]",
    description: "Rows for the current view. With ServerDataTable, only the current page.",
  },
  {
    name: "getRowId",
    type: "(row: T) => string",
    description: "Stable unique ID across every page, filter, sort, and refresh.",
  },
  {
    name: "search",
    type: "{ columnId; placeholder? }",
    description: "Text filter bound to one column.",
  },
  {
    name: "filters",
    type: "DataTableFilter[]",
    description: "Faceted filters. Options may carry a server-wide count.",
  },
  {
    name: "columnLabels",
    type: "Record<string, string>",
    description: "Names shown in the column visibility menu.",
  },
  {
    name: "selectable",
    type: "boolean",
    defaultValue: "false",
    description: "Adds the selection column.",
  },
  { name: "pageSizes", type: "number[]", description: "Choices for rows per page." },
  {
    name: "labels",
    type: "Partial<DataTableLabels>",
    description: "Override any visible string for localization.",
  },
  {
    name: "actions",
    type: "ReactNode",
    description: "Rendered at the end of the default toolbar.",
  },
  {
    name: "toolbar",
    type: "(table) => ReactNode",
    description: "Replace the toolbar. Return null to hide it.",
  },
  {
    name: "pagination",
    type: "(table) => ReactNode",
    description: "Replace the pagination. Return null to hide it.",
  },
  {
    name: "emptyContent",
    type: "ReactNode",
    description: "Shown when there are no rows and no active filters.",
  },
  { name: "loading", type: "boolean", description: "Shows the loading row and disables controls." },
  {
    name: "error",
    type: "string",
    description: "Safe display message. Never pass raw provider errors.",
  },
  {
    name: "onRetry",
    type: "() => void",
    description: "Enables the retry action in the error state.",
  },
];

const ownershipProps: PropDefinition[] = [
  {
    name: "state",
    type: "DataTableState",
    description:
      "pagination, sorting, columnFilters, columnVisibility, and rowSelection. Required for ServerDataTable.",
  },
  {
    name: "onStateChange",
    type: "(updater) => void",
    description: "Receives a value or functional updater, like React's setState.",
  },
  {
    name: "initialState",
    type: "DataTableInitialState",
    description: "ClientDataTable only. Seeds uncontrolled state.",
  },
  {
    name: "rowCount",
    type: "number",
    description:
      "ServerDataTable only. Total matching rows across all pages after server filtering.",
  },
];

const toc = [
  { id: "examples", title: "Examples" },
  { id: "columns", title: "Defining columns" },
  { id: "compose", title: "Composing parts" },
  { id: "behavior", title: "Behavior" },
  { id: "api", title: "Props" },
];

export default function DataTablePage() {
  return (
    <DocLayout toc={toc}>
      <DocHeader
        eyebrow="Shared UI"
        category="Table"
        title="Data Table"
        description="One shared surface, two ways to own your data. Ready-to-use tables with composable controls for the details that make yours different."
        chips={["TanStack Table v9", "Base UI", "Client + server"]}
      />

      <Section
        id="examples"
        eyebrow="In practice"
        title="Three ownership models, one table."
        lede="The client table manages its own state. The controlled client table lets your app own state for persistence or URL sync. The server table hands pagination, sorting, and filtering to your API and shows only the current page."
      >
        <DataTableModes
          code={{
            client: <CodeBlock code={clientCode} title="tasks.tsx" />,
            controlled: <CodeBlock code={controlledCode} title="tasks.tsx" />,
            server: <CodeBlock code={serverCode} title="tasks.tsx" />,
          }}
        />
      </Section>

      <Section
        id="columns"
        eyebrow="Columns"
        title="Defining columns"
        lede="The column helper is a thin wrapper over TanStack's, typed to the shared feature set. Sortable headers, faceted filters, and row actions are ordinary column definitions."
      >
        <CodeBlock code={columnsCode} title="columns.tsx" />
      </Section>

      <Section
        id="compose"
        eyebrow="Composition"
        title="Defaults where you need them. Space where you don't."
        lede="Pass search, filters, columnLabels, actions, pageSizes, and labels to configure the defaults. Replace toolbar or pagination with a render function, or return null to hide one. DataTable, DataTableToolbar, DataTableFacetedFilter, DataTableColumnHeader, DataTableViewOptions, DataTablePagination, and DataTableRowActions are all exported for custom compositions."
      >
        <CodeBlock code={composeCode} title="custom toolbar" />
      </Section>

      <Section id="behavior" eyebrow="Guarantees" title="Behavior">
        <ProseList>
          <li>
            Sorting, filter, and page size changes reset to page one. Filtering clears selection.
          </li>
          <li>
            Page changes preserve selected IDs. The header checkbox selects the current page only.
          </li>
          <li>
            With server data, option counts must come from the API. The table never presents counts
            from one page as global totals.
          </li>
          <li>
            The app owns authorization, persistence, request cancellation, and server page
            reconciliation after deletes or changing totals.
          </li>
          <li>Row action callbacks receive your original record, never a table row.</li>
        </ProseList>
        <Callout className="mt-6" title="Use stable row IDs">
          Selection and reconciliation key on getRowId. Index-based IDs break the moment a filter or
          sort changes.
        </Callout>
      </Section>

      <Section
        id="api"
        eyebrow="Reference"
        title="Props"
        lede="ClientDataTable and ServerDataTable share the view props below. The second table lists what differs between the two."
      >
        <Stack gap={6}>
          <PropsTable props={sharedProps} />
          <PropsTable props={ownershipProps} />
        </Stack>
      </Section>

      <DocPagination href="/docs/data-table" />
    </DocLayout>
  );
}
