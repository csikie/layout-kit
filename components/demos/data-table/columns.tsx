import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkCircle02Icon,
  CircleIcon,
  Clock01Icon,
  CancelCircleIcon,
  ArrowUp01Icon,
  ArrowDown01Icon,
  MinusSignIcon,
} from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import {
  createDataTableColumnHelper,
  DataTableColumnHeader,
  DataTableRowActions,
  type DataTableColumn,
} from "@/components/ui/data-table";
import { statuses, priorities, type Task } from "./tasks";
import { Row } from "@/components/ui/row";

export type TaskAction = "complete" | "duplicate" | "delete";
const helper = createDataTableColumnHelper<Task>();
export const columnLabels = { id: "Task", title: "Title", status: "Status", priority: "Priority" };
const statusIcons = {
  backlog: Clock01Icon,
  todo: CircleIcon,
  "in-progress": Clock01Icon,
  done: CheckmarkCircle02Icon,
  canceled: CancelCircleIcon,
};
const priorityIcons = { low: ArrowDown01Icon, medium: MinusSignIcon, high: ArrowUp01Icon };

export function taskColumns(
  onAction: (action: TaskAction, task: Task) => void,
): DataTableColumn<Task>[] {
  return helper.columns([
    helper.accessor("id", {
      header: "Task",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => <span className="font-mono text-muted-foreground">{row.original.id}</span>,
    }),
    helper.accessor("title", {
      header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
      cell: ({ row }) => (
        <Row gap={2} className="min-w-64 max-w-lg">
          <Badge variant="outline">{row.original.label}</Badge>
          <span className="truncate">{row.original.title}</span>
        </Row>
      ),
    }),
    helper.accessor("status", {
      filterFn: "includesAny",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => (
        <span className="inline-flex min-w-28 items-center gap-2">
          <HugeiconsIcon
            className="size-3.5 text-muted-foreground"
            icon={statusIcons[row.original.status as keyof typeof statusIcons] ?? CircleIcon}
          />
          {statuses.find((item) => item.value === row.original.status)?.label}
        </span>
      ),
    }),
    helper.accessor("priority", {
      filterFn: "includesAny",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Priority" />,
      cell: ({ row }) => (
        <span className="inline-flex min-w-20 items-center gap-2">
          <HugeiconsIcon
            className="size-3.5 text-muted-foreground"
            icon={
              priorityIcons[row.original.priority as keyof typeof priorityIcons] ?? MinusSignIcon
            }
          />
          {priorities.find((item) => item.value === row.original.priority)?.label}
        </span>
      ),
    }),
    helper.display({
      id: "actions",
      enableHiding: false,
      enableSorting: false,
      cell: ({ row }) => (
        <DataTableRowActions
          row={row.original}
          label={`Actions for ${row.original.id}`}
          actions={[
            {
              id: "complete",
              label: "Mark complete",
              disabled: row.original.status === "done",
              onSelect: (task) => onAction("complete", task),
            },
            {
              id: "duplicate",
              label: "Duplicate",
              onSelect: (task) => onAction("duplicate", task),
            },
            {
              id: "delete",
              label: "Delete",
              variant: "destructive",
              onSelect: (task) => onAction("delete", task),
            },
          ]}
        />
      ),
    }),
  ]);
}
