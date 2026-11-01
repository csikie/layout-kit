import type { DataTableQuery } from "@/components/ui/data-table";

export interface Task {
  id: string;
  title: string;
  label: string;
  status: string;
  priority: string;
}
export const statuses = [
  { value: "backlog", label: "Backlog" },
  { value: "todo", label: "Todo" },
  { value: "in-progress", label: "In progress" },
  { value: "done", label: "Done" },
  { value: "canceled", label: "Canceled" },
];
export const priorities = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];
const titles = [
  "Define the foundations for the next release",
  "Document the component composition patterns",
  "Review keyboard navigation across overlays",
  "Simplify the workspace onboarding flow",
  "Align empty states with the design system",
  "Make the task list easier to scan",
  "Test responsive behavior on smaller screens",
  "Polish the final details before handoff",
  "Connect the table to a paginated endpoint",
  "Check sorting and filtering together",
  "Add a practical example to the documentation",
  "Improve error recovery for slow connections",
];
export const initialTasks: Task[] = Array.from({ length: 100 }, (_, index) => ({
  id: `TASK-${String(1001 + index)}`,
  title: titles[index % titles.length]!,
  label: ["Feature", "Documentation", "Bug"][index % 3]!,
  status: statuses[index % statuses.length]!.value,
  priority: priorities[index % priorities.length]!.value,
}));

/** Demo-only server processing. The shared UI package knows nothing about this data source. */
export function queryTasks(tasks: Task[], query: DataTableQuery) {
  let matching = tasks.filter((task) =>
    query.columnFilters.every((filter) => {
      const value = task[filter.id as keyof Task];
      if (value === undefined) return false;
      return Array.isArray(filter.value)
        ? filter.value.includes(value)
        : value.toLowerCase().includes(String(filter.value).toLowerCase());
    }),
  );
  matching = [...matching].sort((left, right) => {
    for (const sort of query.sorting) {
      const a = left[sort.id as keyof Task] ?? "";
      const b = right[sort.id as keyof Task] ?? "";
      const compared = a.localeCompare(b, undefined, { numeric: true });
      if (compared) return sort.desc ? -compared : compared;
    }
    return 0;
  });
  const rowCount = matching.length;
  const start = query.pagination.pageIndex * query.pagination.pageSize;
  return { data: matching.slice(start, start + query.pagination.pageSize), rowCount };
}
