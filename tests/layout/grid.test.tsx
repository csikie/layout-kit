import { expect, test } from "vite-plus/test";
import { Grid } from "@/components/ui/grid";
import { GridItem } from "@/components/ui/grid-item";
import { classes, render } from "./render";

test("Grid renders default classes and data-slot", () => {
  const grid = render(<Grid />);
  expect(grid.dataset.slot).toBe("grid");
  expect(classes(grid)).toEqual(
    expect.arrayContaining(["grid", "min-w-0", "grid-cols-1", "gap-4", "items-stretch"]),
  );
});

test("Grid cols accept a scalar or a responsive map", () => {
  expect(classes(render(<Grid cols={3} />))).toContain("grid-cols-3");
  expect(classes(render(<Grid cols={{ base: 1, sm: 2, lg: 4, "2xl": 12 }} />))).toEqual(
    expect.arrayContaining(["grid-cols-1", "sm:grid-cols-2", "lg:grid-cols-4", "2xl:grid-cols-12"]),
  );
});

test("Grid gap and align are responsive", () => {
  const grid = render(<Grid gap={{ base: 2, md: 8 }} align={{ base: "start", xl: "end" }} />);
  expect(classes(grid)).toEqual(
    expect.arrayContaining(["gap-2", "md:gap-8", "items-start", "xl:items-end"]),
  );
});

test("Grid className resolves conflicts with props", () => {
  const grid = render(<Grid gap={4} className="gap-2" cols={2} />);
  expect(classes(grid)).toContain("gap-2");
  expect(classes(grid)).not.toContain("gap-4");
});

test("GridItem spans one column by default", () => {
  const item = render(<GridItem />);
  expect(item.dataset.slot).toBe("grid-item");
  expect(classes(item)).toEqual(expect.arrayContaining(["min-w-0", "col-span-1"]));
});

test("GridItem span accepts a scalar or a responsive map", () => {
  expect(classes(render(<GridItem span="full" />))).toContain("col-span-full");
  expect(classes(render(<GridItem span={{ base: "full", md: 6, "2xl": 4 }} />))).toEqual(
    expect.arrayContaining(["col-span-full", "md:col-span-6", "2xl:col-span-4"]),
  );
  const overridden = render(<GridItem span={2} className="col-span-3" />);
  expect(classes(overridden)).toContain("col-span-3");
  expect(classes(overridden)).not.toContain("col-span-2");
});
