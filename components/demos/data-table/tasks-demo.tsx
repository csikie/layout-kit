"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ClientDataTable,
  ServerDataTable,
  createDataTableState,
  type DataTableFilter,
} from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { taskColumns, columnLabels, type TaskAction } from "./columns";
import { initialTasks, statuses, priorities, type Task } from "./tasks";
import { useDemoSource } from "./use-demo-source";
import { Row } from "@/components/ui/row";
import { Stack } from "@/components/ui/stack";

const filters: DataTableFilter[] = [
  { columnId: "status", title: "Status", options: statuses },
  { columnId: "priority", title: "Priority", options: priorities },
];
const getRowId = (task: Task) => task.id;

export function TasksDemo({ mode }: { mode: "client" | "controlled" | "server" }) {
  const [instance, setInstance] = useState(0);
  // A full demo reset also restores records and local control state, not only table state.
  return (
    <TasksDemoInstance
      key={instance}
      mode={mode}
      onReset={() => setInstance((value) => value + 1)}
    />
  );
}

function TasksDemoInstance({
  mode,
  onReset,
}: {
  mode: "client" | "controlled" | "server";
  onReset: () => void;
}) {
  const [tasks, setTasks] = useState(initialTasks);
  const [state, setState] = useState(() => createDataTableState());
  const [notice, setNotice] = useState("");
  const sequence = useRef(2000);
  const columns = useMemo(
    () =>
      taskColumns((action: TaskAction, task: Task) => {
        if (action === "delete") {
          setTasks((previous) => previous.filter((item) => item.id !== task.id));
          setState((previous) => ({
            ...previous,
            rowSelection: Object.fromEntries(
              Object.entries(previous.rowSelection).filter(([id]) => id !== task.id),
            ),
          }));
        } else if (action === "complete") {
          setTasks((previous) =>
            previous.map((item) => (item.id === task.id ? { ...item, status: "done" } : item)),
          );
        } else {
          const id = `TASK-${++sequence.current}`;
          setTasks((previous) => [{ ...task, id }, ...previous]);
        }
        setNotice(
          `${task.id}: ${action === "complete" ? "marked complete" : action === "delete" ? "deleted" : "duplicated"} in this demo.`,
        );
      }),
    [],
  );
  const addTask = () => {
    const id = `TASK-${++sequence.current}`;
    setTasks((previous) => [
      {
        id,
        title: "A new idea, ready to take shape",
        label: "Feature",
        status: "todo",
        priority: "medium",
      },
      ...previous,
    ]);
    setState((previous) => ({ ...previous, pagination: { ...previous.pagination, pageIndex: 0 } }));
    setNotice(`${id} added to this demo.`);
  };
  const common = {
    columns,
    getRowId,
    selectable: true,
    filters,
    columnLabels,
    search: { columnId: "title", placeholder: "Filter tasks…" },
    actions: <Button onClick={addTask}>Add sample task</Button>,
  };
  return (
    <Stack className="gap-5">
      <Row align="end" justify="between" wrap>
        <div>
          <h2 className="text-xl font-medium tracking-tight">
            A little structure. A clear next step.
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your team’s work, with room to focus. {tasks.length} tasks in this local demo.
          </p>
        </div>
        {mode === "controlled" && (
          <Button variant="outline" onClick={onReset}>
            Reset table state
          </Button>
        )}
      </Row>
      {mode === "server" ? (
        <ServerTasks tasks={tasks} state={state} onStateChange={setState} common={common} />
      ) : mode === "controlled" ? (
        <ClientDataTable
          {...common}
          label="Controlled tasks"
          data={tasks}
          state={state}
          onStateChange={setState}
        />
      ) : (
        <ClientDataTable {...common} label="Client tasks" data={tasks} />
      )}
      <p role="status" className="min-h-4 text-xs text-muted-foreground">
        {notice || "Changes stay in this demo and reset when you switch examples."}
      </p>
      {mode !== "client" && (
        <details className="rounded-md border p-3 text-xs">
          <summary className="cursor-pointer font-medium">Controlled table state</summary>
          <pre className="mt-3 overflow-auto text-muted-foreground">
            {JSON.stringify(state, null, 2)}
          </pre>
        </details>
      )}
    </Stack>
  );
}

function ServerTasks({
  tasks,
  state,
  onStateChange,
  common,
}: {
  tasks: Task[];
  state: ReturnType<typeof createDataTableState>;
  onStateChange: React.Dispatch<React.SetStateAction<ReturnType<typeof createDataTableState>>>;
  common: Pick<
    React.ComponentProps<typeof ClientDataTable<Task>>,
    "columns" | "getRowId" | "selectable" | "filters" | "columnLabels" | "search" | "actions"
  >;
}) {
  const source = useDemoSource(tasks, state);
  const lastPage = Math.max(0, Math.ceil(source.rowCount / state.pagination.pageSize) - 1);
  useEffect(() => {
    // The app reconciles a server page after a deletion changes the matching total.
    if (!source.loading && !source.error && state.pagination.pageIndex > lastPage) {
      onStateChange((previous) => ({
        ...previous,
        pagination: { ...previous.pagination, pageIndex: lastPage },
      }));
    }
  }, [source.loading, source.error, state.pagination.pageIndex, lastPage, onStateChange]);
  return (
    <>
      <Alert>
        <AlertTitle>Simulated server · 450 ms latency</AlertTitle>
        <AlertDescription>
          Only the current page is passed to the table. This local data source demonstrates request
          cancellation and recovery; it is not a live API.
        </AlertDescription>
      </Alert>
      <div>
        <Button variant="outline" onClick={source.simulateError} disabled={source.loading}>
          Simulate request error
        </Button>
      </div>
      <ServerDataTable
        {...common}
        label="Server tasks"
        data={source.data}
        rowCount={source.rowCount}
        state={state}
        onStateChange={onStateChange}
        loading={source.loading}
        error={source.error}
        onRetry={source.retry}
      />
    </>
  );
}
