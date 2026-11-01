"use client";

import { useCallback, useId, useState, useSyncExternalStore } from "react";
import type { RowData } from "@tanstack/react-table";
import { HugeiconsIcon } from "@hugeicons/react";
import { AddCircleIcon } from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent, PopoverTitle } from "@/components/ui/popover";
import type { DataTableResolvedColumn } from "./features";
import type { DataTableFilterOption } from "./types";
import { defaultDataTableLabels, type DataTableLabels } from "./labels";

function DataTableFacetedFilter<T extends RowData>({
  column,
  title,
  options,
  server = false,
  labels: overrides,
}: {
  column: DataTableResolvedColumn<T>;
  title: string;
  options: DataTableFilterOption[];
  server?: boolean;
  labels?: Partial<DataTableLabels>;
}) {
  const [query, setQuery] = useState("");
  const id = useId();
  const labels = { ...defaultDataTableLabels, ...overrides };
  // Column identities stay stable across updates, including in memoized callers.
  // Subscribe explicitly instead of relying on an unrelated parent render.
  const columnFilters = useSyncExternalStore(
    useCallback(
      (onChange: () => void) => column.table.atoms.columnFilters.subscribe(onChange).unsubscribe,
      [column],
    ),
    () => column.table.atoms.columnFilters.get(),
    () => column.table.atoms.columnFilters.get(),
  );
  const value = columnFilters.find((filter) => filter.id === column.id)?.value;
  const selected = new Set<string>(Array.isArray(value) ? value : []);
  const counts = server ? undefined : column.getFacetedUniqueValues();
  const visibleOptions = options.filter((option) =>
    option.label.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
  );
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" />}>
        <HugeiconsIcon icon={AddCircleIcon} data-icon="inline-start" />
        {title}
        {selected.size > 0 && <Badge variant="secondary">{selected.size}</Badge>}
      </PopoverTrigger>
      <PopoverContent align="start" className="w-60">
        <PopoverTitle>{title}</PopoverTitle>
        <Input
          aria-label={`${title}: ${labels.filterSearch}`}
          placeholder={labels.filterSearch}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div
          className="flex max-h-64 flex-col gap-1 overflow-y-auto"
          role="group"
          aria-label={title}
        >
          {visibleOptions.map((option, index) => {
            const count = server ? option.count : (counts?.get(option.value) ?? 0);
            return (
              <label
                key={option.value}
                htmlFor={`${id}-${index}`}
                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 hover:bg-accent"
              >
                <Checkbox
                  id={`${id}-${index}`}
                  aria-label={option.label}
                  checked={selected.has(option.value)}
                  onCheckedChange={(checked) => {
                    const next = new Set(selected);
                    if (checked) next.add(option.value);
                    else next.delete(option.value);
                    column.setFilterValue(next.size ? [...next] : undefined);
                  }}
                />
                {option.icon}
                <span className="flex-1">{option.label}</span>
                {count !== undefined && <span className="text-muted-foreground">{count}</span>}
              </label>
            );
          })}
          {!visibleOptions.length && (
            <p role="status" className="p-2 text-muted-foreground">
              {labels.noOptions}
            </p>
          )}
        </div>
        {selected.size > 0 && (
          <Button variant="ghost" onClick={() => column.setFilterValue(undefined)}>
            {labels.clearFilter}
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
}

export { DataTableFacetedFilter };
