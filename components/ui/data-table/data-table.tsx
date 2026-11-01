"use client";

import { flexRender, type RowData } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { DataTableToolbar } from "./toolbar";
import { DataTablePagination } from "./pagination";
import type { DataTableViewProps } from "./types";
import { defaultDataTableLabels } from "./labels";

/** Shared presentation. Data ownership and row-model processing belong to the wrappers. */
function DataTable<T extends RowData>(props: DataTableViewProps<T>) {
  const { table, label, loading, error, onRetry, className, toolbar, pagination, emptyContent } =
    props;
  const labels = { ...defaultDataTableLabels, ...props.labels };
  const rows = table.getRowModel().rows;
  const colSpan = Math.max(1, table.getVisibleLeafColumns().length);
  const filtered = table.state.columnFilters.length > 0;
  return (
    <section
      aria-label={label}
      aria-busy={loading || undefined}
      className={cn("flex min-w-0 flex-col gap-4", className)}
    >
      {toolbar ? toolbar(table) : <DataTableToolbar {...props} />}
      <div className="min-w-0 overflow-hidden rounded-md border">
        <Table aria-label={label}>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    aria-sort={
                      header.column.getCanSort()
                        ? header.column.getIsSorted() === "asc"
                          ? "ascending"
                          : header.column.getIsSorted() === "desc"
                            ? "descending"
                            : "none"
                        : undefined
                    }
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={colSpan}>
                  <div role="status" className="flex flex-col gap-3 p-4">
                    <span className="sr-only">{labels.loading}</span>
                    {[0, 1, 2].map((i) => (
                      <Skeleton key={i} className="h-8 w-full" />
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ) : !error && rows.length ? (
              rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={colSpan}>
                  <Empty role={error ? "alert" : "status"} className="whitespace-normal">
                    <EmptyHeader>
                      <EmptyTitle>
                        {error ? labels.error : filtered ? labels.noResults : labels.empty}
                      </EmptyTitle>
                      {error && <EmptyDescription>{error}</EmptyDescription>}
                      {!error &&
                        (emptyContent ??
                          (filtered && (
                            <EmptyDescription>{labels.noResultsDescription}</EmptyDescription>
                          )))}
                    </EmptyHeader>
                    {error && onRetry && (
                      <EmptyContent>
                        <Button variant="outline" onClick={onRetry}>
                          {labels.retry}
                        </Button>
                      </EmptyContent>
                    )}
                  </Empty>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {pagination ? (
        pagination(table)
      ) : (
        <DataTablePagination {...props} loading={loading || Boolean(error)} />
      )}
    </section>
  );
}

export { DataTable };
