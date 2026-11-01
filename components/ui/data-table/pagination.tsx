"use client";

import { useId } from "react";
import type { RowData } from "@tanstack/react-table";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowLeftDoubleIcon,
  ArrowRightDoubleIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import type { DataTableViewProps } from "./types";
import { defaultDataTableLabels } from "./labels";

function DataTablePagination<T extends RowData>({
  table,
  pageSizes = [10, 20, 25, 50],
  selectable,
  loading,
  labels: overrides,
}: Pick<DataTableViewProps<T>, "table" | "pageSizes" | "selectable" | "loading" | "labels">) {
  const labels = { ...defaultDataTableLabels, ...overrides };
  const id = useId();
  const { pageIndex, pageSize } = table.state.pagination;
  const pageCount = table.getPageCount();
  const sizes = [...new Set([...pageSizes, pageSize])]
    .filter((size) => Number.isInteger(size) && size > 0)
    .sort((a, b) => a - b);
  const selectedCount = Object.values(table.state.rowSelection).filter(Boolean).length;
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
      <div role="status" className="text-muted-foreground">
        {selectable
          ? labels.selected(selectedCount, table.getRowCount())
          : labels.total(table.getRowCount())}
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor={id}>{labels.rowsPerPage}</label>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => {
              if (value) table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger id={id} disabled={loading}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {sizes.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <span aria-live="polite">
          {labels.page(pageCount === 0 ? 0 : pageIndex + 1, pageCount)}
        </span>
        <div className="flex items-center gap-1">
          {[
            {
              label: labels.firstPage,
              icon: ArrowLeftDoubleIcon,
              click: () => table.setPageIndex(0),
              disabled: !table.getCanPreviousPage(),
            },
            {
              label: labels.previousPage,
              icon: ArrowLeft01Icon,
              click: () => table.previousPage(),
              disabled: !table.getCanPreviousPage(),
            },
            {
              label: labels.nextPage,
              icon: ArrowRight01Icon,
              click: () => table.nextPage(),
              disabled: !table.getCanNextPage(),
            },
            {
              label: labels.lastPage,
              icon: ArrowRightDoubleIcon,
              click: () => table.setPageIndex(Math.max(0, pageCount - 1)),
              disabled: !table.getCanNextPage(),
            },
          ].map((item) => (
            <Button
              key={item.label}
              variant="outline"
              size="icon"
              aria-label={item.label}
              disabled={loading || item.disabled || pageCount === 0}
              onClick={item.click}
            >
              <HugeiconsIcon icon={item.icon} />
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

export { DataTablePagination };
