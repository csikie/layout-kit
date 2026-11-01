import type { RowData } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import type { DataTableColumn } from "./features";
import { defaultDataTableLabels, type DataTableLabels } from "./labels";

function createDataTableSelectionColumn<T extends RowData>(
  overrides?: Partial<DataTableLabels>,
): DataTableColumn<T> {
  const labels = { ...defaultDataTableLabels, ...overrides };
  return {
    id: "__selection",
    enableSorting: false,
    enableHiding: false,
    header: ({ table }) => (
      <Checkbox
        aria-label={labels.selectPage}
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
        onCheckedChange={(checked) => table.toggleAllPageRowsSelected(checked)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label={labels.selectRow}
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onCheckedChange={(checked) => row.toggleSelected(checked)}
      />
    ),
  };
}

export { createDataTableSelectionColumn };
