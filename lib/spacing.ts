// Shared layout vocabulary for every layout primitive.
//
// Tailwind only generates classes it can find verbatim in source files, so every
// responsive class below is written out in full. Do not build class names with
// template strings.

const breakpoints = ["base", "sm", "md", "lg", "xl", "2xl"] as const;

/** Tailwind's default breakpoints. `base` applies at every width. */
type Breakpoint = (typeof breakpoints)[number];

/** A single value, or a partial map from breakpoint to value (mobile first). */
type Responsive<T> = T | Partial<Record<Breakpoint, T>>;

/** One class per value, per breakpoint. */
type ResponsiveVariants<T extends PropertyKey> = Record<Breakpoint, Record<T, string>>;

function isResponsiveObject<T>(value: Responsive<T>): value is Partial<Record<Breakpoint, T>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Resolves a scalar or responsive value to Tailwind classes, ordered from the
 * smallest breakpoint to the largest. Unknown keys and undefined values are skipped.
 */
function responsiveClasses<T extends PropertyKey>(
  value: Responsive<T> | undefined,
  variants: ResponsiveVariants<T>,
): string[] {
  if (value === undefined) return [];
  if (!isResponsiveObject(value)) return [variants.base[value]];

  const classes: string[] = [];
  for (const breakpoint of breakpoints) {
    const entry = value[breakpoint];
    if (entry !== undefined) classes.push(variants[breakpoint][entry]);
  }
  return classes;
}

// ------------------------------------------------------------------
// Gap
// ------------------------------------------------------------------

/** Gap on the Tailwind spacing scale (`4` is 1rem). */
type Gap = 0 | 1 | 2 | 3 | 4 | 6 | 8 | 12;

const gapVariants = {
  base: {
    0: "gap-0",
    1: "gap-1",
    2: "gap-2",
    3: "gap-3",
    4: "gap-4",
    6: "gap-6",
    8: "gap-8",
    12: "gap-12",
  },
  sm: {
    0: "sm:gap-0",
    1: "sm:gap-1",
    2: "sm:gap-2",
    3: "sm:gap-3",
    4: "sm:gap-4",
    6: "sm:gap-6",
    8: "sm:gap-8",
    12: "sm:gap-12",
  },
  md: {
    0: "md:gap-0",
    1: "md:gap-1",
    2: "md:gap-2",
    3: "md:gap-3",
    4: "md:gap-4",
    6: "md:gap-6",
    8: "md:gap-8",
    12: "md:gap-12",
  },
  lg: {
    0: "lg:gap-0",
    1: "lg:gap-1",
    2: "lg:gap-2",
    3: "lg:gap-3",
    4: "lg:gap-4",
    6: "lg:gap-6",
    8: "lg:gap-8",
    12: "lg:gap-12",
  },
  xl: {
    0: "xl:gap-0",
    1: "xl:gap-1",
    2: "xl:gap-2",
    3: "xl:gap-3",
    4: "xl:gap-4",
    6: "xl:gap-6",
    8: "xl:gap-8",
    12: "xl:gap-12",
  },
  "2xl": {
    0: "2xl:gap-0",
    1: "2xl:gap-1",
    2: "2xl:gap-2",
    3: "2xl:gap-3",
    4: "2xl:gap-4",
    6: "2xl:gap-6",
    8: "2xl:gap-8",
    12: "2xl:gap-12",
  },
} as const satisfies ResponsiveVariants<Gap>;

// ------------------------------------------------------------------
// Align (cross axis, items-*)
// ------------------------------------------------------------------

type Align = "start" | "center" | "end" | "stretch" | "baseline";

const alignVariants = {
  base: {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
    baseline: "items-baseline",
  },
  sm: {
    start: "sm:items-start",
    center: "sm:items-center",
    end: "sm:items-end",
    stretch: "sm:items-stretch",
    baseline: "sm:items-baseline",
  },
  md: {
    start: "md:items-start",
    center: "md:items-center",
    end: "md:items-end",
    stretch: "md:items-stretch",
    baseline: "md:items-baseline",
  },
  lg: {
    start: "lg:items-start",
    center: "lg:items-center",
    end: "lg:items-end",
    stretch: "lg:items-stretch",
    baseline: "lg:items-baseline",
  },
  xl: {
    start: "xl:items-start",
    center: "xl:items-center",
    end: "xl:items-end",
    stretch: "xl:items-stretch",
    baseline: "xl:items-baseline",
  },
  "2xl": {
    start: "2xl:items-start",
    center: "2xl:items-center",
    end: "2xl:items-end",
    stretch: "2xl:items-stretch",
    baseline: "2xl:items-baseline",
  },
} as const satisfies ResponsiveVariants<Align>;

// ------------------------------------------------------------------
// Justify (main axis, justify-*)
// ------------------------------------------------------------------

type Justify = "start" | "center" | "end" | "between" | "around" | "evenly";

const justifyVariants = {
  base: {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
  },
  sm: {
    start: "sm:justify-start",
    center: "sm:justify-center",
    end: "sm:justify-end",
    between: "sm:justify-between",
    around: "sm:justify-around",
    evenly: "sm:justify-evenly",
  },
  md: {
    start: "md:justify-start",
    center: "md:justify-center",
    end: "md:justify-end",
    between: "md:justify-between",
    around: "md:justify-around",
    evenly: "md:justify-evenly",
  },
  lg: {
    start: "lg:justify-start",
    center: "lg:justify-center",
    end: "lg:justify-end",
    between: "lg:justify-between",
    around: "lg:justify-around",
    evenly: "lg:justify-evenly",
  },
  xl: {
    start: "xl:justify-start",
    center: "xl:justify-center",
    end: "xl:justify-end",
    between: "xl:justify-between",
    around: "xl:justify-around",
    evenly: "xl:justify-evenly",
  },
  "2xl": {
    start: "2xl:justify-start",
    center: "2xl:justify-center",
    end: "2xl:justify-end",
    between: "2xl:justify-between",
    around: "2xl:justify-around",
    evenly: "2xl:justify-evenly",
  },
} as const satisfies ResponsiveVariants<Justify>;

export {
  breakpoints,
  responsiveClasses,
  isResponsiveObject,
  gapVariants,
  alignVariants,
  justifyVariants,
};

export type { Breakpoint, Responsive, ResponsiveVariants, Gap, Align, Justify };
