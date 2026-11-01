"use client";

import { useEffect, useMemo, useState } from "react";
import type { DataTableQuery } from "@/components/ui/data-table";
import { queryTasks, type Task } from "./tasks";

export function useDemoSource(tasks: Task[], query: DataTableQuery) {
  const [attempt, setAttempt] = useState(0);
  const [fail, setFail] = useState(false);
  const { pagination, sorting, columnFilters } = query;
  const request = useMemo(
    () => ({ tasks, pagination, sorting, columnFilters, attempt, fail }),
    [tasks, pagination, sorting, columnFilters, attempt, fail],
  );
  const [result, setResult] = useState<{
    data: Task[];
    rowCount: number;
    request?: typeof request;
    error?: string;
  }>({ data: [], rowCount: tasks.length });
  useEffect(() => {
    let active = true;
    const timeout = window.setTimeout(() => {
      if (!active) return;
      if (request.fail)
        setResult((previous) => ({
          ...previous,
          request,
          data: [],
          error: "The simulated request failed. Try again to recover.",
        }));
      else setResult({ ...queryTasks(request.tasks, request), request });
    }, 450);
    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, [request]);
  const loading = result.request !== request;
  return {
    data: loading ? [] : result.data,
    rowCount: result.rowCount,
    error: loading ? undefined : result.error,
    loading,
    retry: () => {
      setFail(false);
      setAttempt((value) => value + 1);
    },
    simulateError: () => setFail(true),
  };
}
