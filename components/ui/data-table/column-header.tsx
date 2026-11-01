"use client";

import type { RowData } from "@tanstack/react-table";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, ArrowUp01Icon, UnfoldMoreIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { defaultDataTableLabels, type DataTableLabels } from "./labels";
import type { DataTableResolvedColumn } from "./features";

function DataTableColumnHeader<T extends RowData, TValue>({
  column,
  title,
  labels: overrides,
}: {
  column: DataTableResolvedColumn<T, TValue>;
  title: string;
  labels?: Partial<DataTableLabels>;
}) {
  const labels = { ...defaultDataTableLabels, ...overrides };
  if (!column.getCanSort() && !column.getCanHide()) return <span>{title}</span>;
  const sorted = column.getIsSorted();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="sm" />}>
        {title}
        <HugeiconsIcon
          data-icon="inline-end"
          icon={
            sorted === "asc" ? ArrowUp01Icon : sorted === "desc" ? ArrowDown01Icon : UnfoldMoreIcon
          }
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
          {column.getCanSort() && (
            <>
              <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                {labels.ascending}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                {labels.descending}
              </DropdownMenuItem>
              {sorted && (
                <DropdownMenuItem onClick={() => column.clearSorting()}>
                  {labels.clearSorting}
                </DropdownMenuItem>
              )}
            </>
          )}
          {column.getCanSort() && column.getCanHide() && <DropdownMenuSeparator />}
          {column.getCanHide() && (
            <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
              {labels.hideColumn}
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { DataTableColumnHeader };
