import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PropDefinition } from "@/lib/primitives";
import { cn } from "@/lib/utils";
import { surfaceClassName } from "./typography";

export function PropsTable({ props }: { props: PropDefinition[] }) {
  return (
    <div className={cn(surfaceClassName, "overflow-hidden")}>
      <Table className="[&_code]:font-mono [&_code]:text-[0.72rem]">
        <TableHeader className="bg-muted/60">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[40%] h-9 px-4 align-middle font-mono text-[0.65rem] font-normal tracking-[0.12em] text-muted-foreground uppercase">
              Prop
            </TableHead>
            <TableHead className="h-9 px-4 align-middle font-mono text-[0.65rem] font-normal tracking-[0.12em] text-muted-foreground uppercase">
              Type
            </TableHead>
            <TableHead className="w-28 h-9 px-4 align-middle font-mono text-[0.65rem] font-normal tracking-[0.12em] text-muted-foreground uppercase">
              Default
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.map((prop) => (
            <TableRow key={prop.name}>
              <TableCell className="px-4 py-3 align-top">
                <code className="font-semibold text-foreground">{prop.name}</code>
                <p className="mt-[0.3rem] max-w-104 text-[0.74rem] leading-[1.65] whitespace-normal text-muted-foreground">
                  {prop.description}
                </p>
              </TableCell>
              <TableCell className="px-4 py-3 align-top">
                <code className="whitespace-normal text-sidebar-primary">{prop.type}</code>
              </TableCell>
              <TableCell className="px-4 py-3 align-top">
                {prop.defaultValue ? (
                  <code>{prop.defaultValue}</code>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
