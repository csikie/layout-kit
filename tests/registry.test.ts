import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "vite-plus/test";
import registry from "@/registry.json";

const root = join(import.meta.dirname, "..");
const namespace = "@layout-kit";

const primitives = ["stack", "row", "col", "grid", "grid-item", "page"] as const;

type Item = (typeof registry.items)[number] & { registryDependencies?: string[] };
const items = registry.items as Item[];

function item(name: string) {
  const found = items.find((entry) => entry.name === name);
  if (!found) throw new Error(`Missing registry item "${name}"`);
  return found;
}

/** Registry lib items keyed by the import specifier their file answers to. */
const libItemsBySpecifier = new Map<string, string>(
  items
    .filter((entry) => entry.type === "registry:lib")
    .flatMap((entry) =>
      entry.files.map((file) => [`@/${file.path.replace(/\.tsx?$/, "")}`, entry.name] as const),
    ),
);

function libImports(source: string) {
  return [...source.matchAll(/from\s+"(@\/lib\/[\w-]+)"/g)].map((match) => match[1]!);
}

test("registry.json carries no committed homepage (the build injects it)", () => {
  expect(registry).not.toHaveProperty("homepage");
  expect(JSON.stringify(registry)).not.toContain("localhost");
});

test("every layout primitive file is published as its own registry:ui item", () => {
  for (const name of primitives) {
    const entry = item(name);
    expect(entry.type).toBe("registry:ui");
    expect(entry.files).toEqual([{ path: `components/ui/${name}.tsx`, type: "registry:ui" }]);
  }
});

test("every registry file exists on disk", () => {
  for (const entry of items) {
    for (const file of entry.files) {
      expect(() => readFileSync(join(root, file.path))).not.toThrow();
    }
  }
});

test("registryDependencies match each file's @/lib imports", () => {
  for (const entry of items.filter((candidate) => candidate.files.length > 0)) {
    const expected = new Set<string>();
    for (const file of entry.files) {
      for (const specifier of libImports(readFileSync(join(root, file.path), "utf8"))) {
        // @/lib/utils (cn) is part of every shadcn project and is not a registry item.
        if (specifier === "@/lib/utils") continue;
        const dependency = libItemsBySpecifier.get(specifier);
        expect(dependency, `${file.path} imports unpublished ${specifier}`).toBeDefined();
        expected.add(`${namespace}/${dependency}`);
      }
    }
    expect(new Set(entry.registryDependencies ?? []), entry.name).toEqual(expected);
  }
});

test("registry files only import React, their own lib items, or @/lib/utils", () => {
  for (const entry of items) {
    for (const file of entry.files) {
      const source = readFileSync(join(root, file.path), "utf8");
      for (const [, specifier] of source.matchAll(/from\s+"([^"]+)"/g)) {
        expect(
          specifier === "react" ||
            specifier === "@/lib/utils" ||
            libItemsBySpecifier.has(specifier!),
          `${file.path} imports ${specifier}`,
        ).toBe(true);
      }
    }
  }
});

test("the layout bundle installs every primitive", () => {
  expect(item("layout").registryDependencies).toEqual(
    primitives.map((name) => `${namespace}/${name}`),
  );
});
