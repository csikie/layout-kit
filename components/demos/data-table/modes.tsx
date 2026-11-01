"use client";

import { useState, type ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TasksDemo } from "./tasks-demo";
import { Stack } from "@/components/ui/stack";

export type TableMode = "client" | "controlled" | "server";
const modes: { value: TableMode; label: string }[] = [
  { value: "client", label: "Client" },
  { value: "controlled", label: "Controlled client" },
  { value: "server", label: "Server" },
];

export function DataTableModes({ code }: { code: Record<TableMode, ReactNode> }) {
  const [mode, setMode] = useState<TableMode>("client");
  return (
    <Stack gap={8}>
      <Tabs value={mode} onValueChange={(value) => setMode(value as TableMode)}>
        <TabsList>
          {modes.map((item) => (
            <TabsTrigger key={item.value} value={item.value}>
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {modes.map((item) => (
          <TabsContent key={item.value} value={item.value} className="mt-6">
            {mode === item.value && <TasksDemo key={item.value} mode={item.value} />}
          </TabsContent>
        ))}
      </Tabs>
      <Stack gap={3}>
        <h3 className="text-sm font-semibold tracking-tight">
          {mode === "server" ? "Server-owned data" : "Client-owned data"}
        </h3>
        {code[mode]}
      </Stack>
    </Stack>
  );
}
