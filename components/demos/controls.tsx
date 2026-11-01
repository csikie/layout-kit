"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Row } from "@/components/ui/row";
import { Eyebrow } from "@/components/docs/typography";

export function OptionControl<T extends string>({
  label,
  value,
  options,
  onChange,
  hint,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
  hint?: string;
}) {
  return (
    <Row gap={3} wrap>
      <Eyebrow>{label}</Eyebrow>
      <ToggleGroup
        aria-label={label}
        value={[value]}
        onValueChange={(values) => {
          if (values[0]) onChange(values[0] as T);
        }}
        variant="outline"
        size="sm"
      >
        {options.map((option) => (
          <ToggleGroupItem key={option} value={option}>
            {option}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </Row>
  );
}
