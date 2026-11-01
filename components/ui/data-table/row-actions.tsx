"use client";

import type { ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { MoreHorizontalIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface DataTableRowAction<T> {
  id: string;
  label: string;
  icon?: ReactNode;
  variant?: "default" | "destructive";
  disabled?: boolean;
  onSelect: (row: T) => void;
}
function DataTableRowActions<T>({
  row,
  actions,
  label = "Open row actions",
}: {
  row: T;
  actions: DataTableRowAction<T>[];
  label?: string;
}) {
  if (!actions.length) return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label={label} />}>
        <HugeiconsIcon icon={MoreHorizontalIcon} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          {actions.map((action) => (
            <DropdownMenuItem
              key={action.id}
              variant={action.variant}
              disabled={action.disabled}
              onClick={() => action.onSelect(row)}
            >
              {action.icon}
              {action.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { DataTableRowActions };
export type { DataTableRowAction };
