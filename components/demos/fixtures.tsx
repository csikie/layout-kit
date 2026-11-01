import type { ReactNode } from "react";
import { Stack } from "@/components/ui/stack";
import { Row } from "@/components/ui/row";
import { Grid } from "@/components/ui/grid";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/** A labelled slot used to make spacing visible in abstract examples. */
export function Box({
  children,
  tone,
  className,
}: {
  children: ReactNode;
  tone?: "muted";
  className?: string;
}) {
  return (
    <Row
      gap={0}
      justify="center"
      className={cn(
        "min-h-12 rounded-[0.4rem] border px-3 py-2 font-mono text-[0.68rem] tracking-[0.03em]",
        tone === "muted"
          ? "border-dashed bg-muted text-muted-foreground"
          : "border-sidebar-primary/45 bg-[color-mix(in_oklch,var(--primary),var(--background)_78%)] text-foreground",
        className,
      )}
    >
      {children}
    </Row>
  );
}

export function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-primary font-medium text-primary-foreground",
        size === "sm" && "size-6 text-[0.6rem]",
        size === "md" && "size-8 text-xs",
        size === "lg" && "size-12 text-sm",
      )}
    >
      {initials}
    </span>
  );
}

export function Field({
  id,
  label,
  placeholder,
  type = "text",
  defaultValue,
}: {
  id: string;
  label: string;
  placeholder?: string;
  type?: string;
  defaultValue?: string;
}) {
  return (
    <Stack gap={2}>
      <label htmlFor={id} className="text-xs font-medium">
        {label}
      </label>
      <Input id={id} type={type} placeholder={placeholder} defaultValue={defaultValue} />
    </Stack>
  );
}

export function Sparkline({ values }: { values: number[] }) {
  const max = Math.max(...values);
  return (
    <Row align="end" className="h-9 gap-[3px]" aria-hidden="true">
      {values.map((value, index) => (
        <span
          key={index}
          className="flex-1 rounded-t-[2px] bg-sidebar-primary/45 last:bg-sidebar-primary"
          style={{ height: `${Math.max(12, (value / max) * 100)}%` }}
        />
      ))}
    </Row>
  );
}

export function Stat({
  label,
  value,
  delta,
  trend,
}: {
  label: string;
  value: string;
  delta: string;
  trend: number[];
}) {
  return (
    <Stack gap={3}>
      <Row justify="between" align="start">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-xs font-medium text-sidebar-primary">{delta}</span>
      </Row>
      <span className="text-[1.6rem] leading-[1.1] font-semibold tracking-[-0.04em]">{value}</span>
      <Sparkline values={trend} />
    </Stack>
  );
}

export function BarChart({ values }: { values: number[] }) {
  const max = Math.max(...values);
  return (
    <Grid gap={2} align="end" className="h-44 grid-flow-col grid-cols-none pt-4" aria-hidden="true">
      {values.map((value, index) => (
        <span
          key={index}
          className="rounded-t-[3px] bg-[color-mix(in_oklch,var(--sidebar-primary),var(--background)_35%)] nth-[3n]:bg-sidebar-primary"
          style={{ height: `${(value / max) * 100}%` }}
        />
      ))}
    </Grid>
  );
}

export const stats = [
  { label: "Revenue", value: "$48,920", delta: "+12.4%", trend: [4, 6, 5, 8, 7, 9, 11] },
  { label: "Active users", value: "3,214", delta: "+3.1%", trend: [6, 5, 7, 7, 8, 9, 9] },
  { label: "Conversion", value: "4.8%", delta: "+0.6%", trend: [3, 4, 4, 5, 4, 6, 7] },
  { label: "Churn", value: "1.2%", delta: "−0.3%", trend: [8, 7, 7, 6, 5, 5, 4] },
];

export const people = [
  { name: "Mara Okafor", role: "Design lead", action: "approved the spacing audit", time: "2m" },
  { name: "Jonas Lindqvist", role: "Engineer", action: "opened PR #412 · Page aside", time: "18m" },
  { name: "Priya Natarajan", role: "Product", action: "commented on Dashboard v2", time: "1h" },
  { name: "Theo Marchetti", role: "Engineer", action: "shipped Grid responsive map", time: "3h" },
];
