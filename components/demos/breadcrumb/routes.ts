import type { BreadcrumbRoute } from "@/components/ui/app-breadcrumb";

export interface DemoData {
  project: { name: string };
  task: { title: string };
}
export const demoData: DemoData = {
  project: { name: "Atlas" },
  task: { title: "Review the component library" },
};
export const demoRoutes: BreadcrumbRoute<DemoData>[] = [
  { path: "/", label: "Home" },
  { path: "/workspace", label: "Workspace" },
  { path: "/workspace/projects", label: "Projects" },
  {
    id: "project",
    path: "/workspace/projects/:projectId",
    label: ({ data }) => data?.project.name,
    fallbackLabel: "Project unavailable",
  },
  { path: "/workspace/projects/:projectId/tasks", label: "Tasks" },
  {
    path: "/workspace/projects/:projectId/tasks/:taskId",
    label: ({ data }) => data?.task.title,
    fallbackLabel: "Task unavailable",
  },
  { path: "/workspace/projects/:projectId/tasks/:taskId/activity", label: "Activity" },
  { path: "/reports/:projectId/weekly", parentId: "project", label: "Weekly report" },
  { path: "/files", label: "Files" },
  { path: "/files/*filePath", label: ({ params }) => params.filePath },
];
export const scenarios = [
  { value: "nested", label: "Nested", path: "/workspace/projects/atlas/tasks/task-42/activity" },
  { value: "hierarchy", label: "Custom hierarchy", path: "/reports/atlas/weekly" },
  { value: "unknown", label: "Unknown route", path: "/workspace/project-settings/a-new-section" },
  { value: "files", label: "Catch-all", path: "/files/design/system/tokens.json" },
];
