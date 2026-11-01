import { expect, test } from "vite-plus/test";
import {
  alignVariants,
  breakpoints,
  gapVariants,
  justifyVariants,
  responsiveClasses,
} from "@/lib/spacing";

test("scalar values resolve to the base class", () => {
  expect(responsiveClasses(4, gapVariants)).toEqual(["gap-4"]);
});

test("responsive maps resolve in breakpoint order, whatever the key order", () => {
  expect(responsiveClasses({ "2xl": 12, md: 6, base: 2 }, gapVariants)).toEqual([
    "gap-2",
    "md:gap-6",
    "2xl:gap-12",
  ]);
});

test("undefined values and empty maps produce no classes", () => {
  expect(responsiveClasses(undefined, gapVariants)).toEqual([]);
  expect(responsiveClasses({}, gapVariants)).toEqual([]);
  expect(responsiveClasses({ sm: undefined }, gapVariants)).toEqual([]);
});

test("every variant map covers every breakpoint with the right prefix", () => {
  for (const variants of [gapVariants, alignVariants, justifyVariants]) {
    for (const breakpoint of breakpoints) {
      const prefix = breakpoint === "base" ? "" : `${breakpoint}:`;
      for (const value of Object.values(variants[breakpoint])) {
        expect(value.startsWith(prefix)).toBe(true);
        if (breakpoint === "base") expect(value).not.toContain(":");
      }
    }
  }
});

test("align and justify use the same value set at every breakpoint", () => {
  for (const breakpoint of breakpoints) {
    expect(Object.keys(alignVariants[breakpoint])).toEqual(Object.keys(alignVariants.base));
    expect(Object.keys(justifyVariants[breakpoint])).toEqual(Object.keys(justifyVariants.base));
    expect(Object.keys(gapVariants[breakpoint])).toEqual(Object.keys(gapVariants.base));
  }
});
