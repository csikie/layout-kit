"use client";

import type { RowData } from "@tanstack/react-table";
import { HugeiconsIcon } from "@hugeicons/react";
import { Settings02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import type { DataTableInstance } from "./features";
import { defaultDataTableLabels, type DataTableLabels } from "./labels";

function DataTableViewOptions<T extends RowData>({
  table,
  columnLabels = {},
  labels: overrides,
}: {
  table: DataTableInstance<T>;
  columnLabels?: Record<string, string>;
  labels?: Partial<DataTableLabels>;
}) {
  const labels = { ...defaultDataTableLabels, ...overrides };
  const columns = table.getAllLeafColumns().filter((column) => column.getCanHide());
  if (!columns.length) return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        <HugeiconsIcon icon={Settings02Icon} data-icon="inline-start" />
        {labels.view}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{labels.columns}</DropdownMenuLabel>
          {columns.map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              checked={column.getIsVisible()}
              onCheckedChange={(checked) => column.toggleVisibility(checked)}
            >
              {columnLabels[column.id] ??
                (typeof column.columnDef.header === "string" ? column.columnDef.header : column.id)}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { DataTableViewOptions };
