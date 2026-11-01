"use client";

import type { RowData } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableFacetedFilter } from "./faceted-filter";
import { DataTableViewOptions } from "./view-options";
import type { DataTableViewProps } from "./types";
import { defaultDataTableLabels } from "./labels";

function DataTableToolbar<T extends RowData>({
  table,
  search,
  filters = [],
  actions,
  columnLabels,
  labels: overrides,
}: Pick<
  DataTableViewProps<T>,
  "table" | "search" | "filters" | "actions" | "columnLabels" | "labels"
>) {
  const labels = { ...defaultDataTableLabels, ...overrides };
  const searchColumn = search ? table.getColumn(search.columnId) : undefined;
  const searchValue = searchColumn?.getFilterValue();
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        {searchColumn && (
          <Input
            className="w-full sm:w-60"
            aria-label={search?.placeholder ?? labels.search}
            placeholder={search?.placeholder ?? labels.search}
            value={typeof searchValue === "string" ? searchValue : ""}
            onChange={(event) => searchColumn.setFilterValue(event.target.value)}
          />
        )}
        {filters.map((filter) => {
          const column = table.getColumn(filter.columnId);
          return column ? (
            <DataTableFacetedFilter
              key={filter.columnId}
              column={column}
              title={filter.title}
              options={filter.options}
              server={table.options.manualFiltering}
              labels={labels}
            />
          ) : null;
        })}
        {table.state.columnFilters.length > 0 && (
          <Button variant="ghost" onClick={() => table.resetColumnFilters(true)}>
            {labels.resetFilters}
          </Button>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <DataTableViewOptions table={table} columnLabels={columnLabels} labels={labels} />
        {actions}
      </div>
    </div>
  );
}

export { DataTableToolbar };
