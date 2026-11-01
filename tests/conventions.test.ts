import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { expect, test } from "vite-plus/test";

const root = join(import.meta.dirname, "..");

function sourceFiles(dir: string): string[] {
  return readdirSync(join(root, dir), { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.tsx?$/.test(entry.name) ? [path] : [];
  });
}

// Shared UI and hooks declare first and export at the bottom of the file:
// `export { ... }` for values and `export type { ... }` for types. Barrels
// re-export with `export { ... } from` / `export type { ... } from`.
const inlineExport =
  /^export\s+(?:default\b|async\s+function\b|function\b|const\b|let\b|var\b|class\b|interface\b|enum\b|type\s+\w+)/m;
const inlineTypeModifier = /^export\s*\{[^}]*\btype\s+\w+/m;

test.each(["components/ui", "hooks"].flatMap(sourceFiles))("%s uses trailing exports", (file) => {
  const source = readFileSync(join(root, file), "utf8");
  expect(source, relative(root, file)).not.toMatch(inlineExport);
  expect(source, relative(root, file)).not.toMatch(inlineTypeModifier);
});

function cssFiles(dir: string): string[] {
  return readdirSync(join(root, dir), { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return cssFiles(path);
    return entry.name.endsWith(".css") ? [path] : [];
  });
}

test("the docs site has no stylesheet besides the shadcn preset", () => {
  expect(["app", "components", "lib"].flatMap(cssFiles)).toEqual(["app/globals.css"]);
});

// Docs, shell, and demo code lays out with the primitives it documents: a div
// whose classes start with a flex or grid display belongs in Stack, Row, or Grid.
const rawLayoutDiv = /<div className="(?:flex|inline-flex|grid)\b/;

test.each(["app", "components/docs", "components/shell", "components/demos"].flatMap(sourceFiles))(
  "%s lays out with Stack, Row, and Grid instead of flex/grid divs",
  (file) => {
    expect(readFileSync(join(root, file), "utf8")).not.toMatch(rawLayoutDiv);
  },
);
