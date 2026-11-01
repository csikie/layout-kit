import { expect, test } from "vite-plus/test";
import { Col } from "@/components/ui/col";
import { Row } from "@/components/ui/row";
import { Stack } from "@/components/ui/stack";
import { classes, render } from "./render";

test("Stack renders a vertical flex container with default classes", () => {
  const stack = render(<Stack>content</Stack>);
  expect(stack.tagName).toBe("DIV");
  expect(stack.dataset.slot).toBe("stack");
  expect(classes(stack)).toEqual(
    expect.arrayContaining(["flex", "flex-col", "gap-4", "items-stretch", "justify-start"]),
  );
  expect(stack.textContent).toBe("content");
});

test("Row renders a horizontal flex container with default classes", () => {
  const row = render(<Row />);
  expect(row.dataset.slot).toBe("row");
  expect(classes(row)).toEqual(
    expect.arrayContaining([
      "flex",
      "flex-row",
      "flex-nowrap",
      "gap-4",
      "items-center",
      "justify-start",
    ]),
  );
  expect(classes(render(<Row wrap />))).toContain("flex-wrap");
});

test("Stack and Row accept the same scalar align, justify, and gap values", () => {
  for (const Component of [Stack, Row]) {
    const element = render(<Component gap={8} align="baseline" justify="between" />);
    expect(classes(element)).toEqual(
      expect.arrayContaining(["gap-8", "items-baseline", "justify-between"]),
    );
  }
});

test("Stack and Row accept responsive gap, align, and justify maps", () => {
  for (const Component of [Stack, Row]) {
    const element = render(
      <Component
        gap={{ base: 2, md: 6, "2xl": 12 }}
        align={{ base: "start", lg: "center" }}
        justify={{ sm: "between" }}
      />,
    );
    expect(classes(element)).toEqual(
      expect.arrayContaining([
        "gap-2",
        "md:gap-6",
        "2xl:gap-12",
        "items-start",
        "lg:items-center",
        "sm:justify-between",
      ]),
    );
    expect(classes(element)).not.toContain("gap-4");
  }
});

test("className wins over the matching prop through cn conflict resolution", () => {
  const stack = render(<Stack gap={4} className="gap-2" />);
  expect(classes(stack)).toContain("gap-2");
  expect(classes(stack)).not.toContain("gap-4");

  const row = render(<Row align="center" className="items-end" />);
  expect(classes(row)).toContain("items-end");
  expect(classes(row)).not.toContain("items-center");
});

test("native div props pass through", () => {
  const stack = render(<Stack id="s" role="list" aria-label="Items" />);
  expect(stack.id).toBe("s");
  expect(stack.getAttribute("role")).toBe("list");
  expect(stack.getAttribute("aria-label")).toBe("Items");
});

test("Col is a flex child with explicit grow, shrink, and self", () => {
  const col = render(<Col />);
  expect(col.dataset.slot).toBe("col");
  expect(classes(col)).toEqual(
    expect.arrayContaining(["min-w-0", "grow-0", "shrink", "self-auto"]),
  );
  expect(classes(col)).not.toContain("flex");

  const rail = render(<Col grow shrink={false} self="center" />);
  expect(classes(rail)).toEqual(expect.arrayContaining(["grow", "shrink-0", "self-center"]));
  expect(classes(rail)).not.toContain("grow-0");
});

test("Col className overrides its defaults", () => {
  const col = render(<Col className="shrink-0" />);
  expect(classes(col)).toContain("shrink-0");
  expect(classes(col)).not.toContain("shrink");
});
