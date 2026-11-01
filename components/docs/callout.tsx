import type { ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function Callout({
  title,
  children,
  variant = "default",
  className,
}: {
  title: string;
  children: ReactNode;
  variant?: "default" | "destructive";
  className?: string;
}) {
  return (
    <Alert variant={variant} className={className}>
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
}
