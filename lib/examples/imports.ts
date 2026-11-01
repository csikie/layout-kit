// Every code sample on the site imports from the paths the shadcn CLI creates.
// Change the prefix here and every example, usage block, and snippet follows.

/** Where `shadcn add` places registry:ui items in a default project. */
const uiImportPrefix = "@/components/ui";

const layoutFiles = {
  Stack: "stack",
  Row: "row",
  Col: "col",
  Grid: "grid",
  GridItem: "grid-item",
  Page: "page",
} as const;

type LayoutExport = keyof typeof layoutFiles;

/** `import { A, B } from "@/components/ui/<file>";` */
function uiImport(file: string, ...names: string[]): string {
  return `import { ${names.join(", ")} } from "${uiImportPrefix}/${file}";`;
}

/** One import line per layout primitive file, in a stable order. */
function layoutImports(...names: LayoutExport[]): string {
  const byFile = new Map<string, string[]>();
  for (const name of names) {
    const file = layoutFiles[name];
    byFile.set(file, [...(byFile.get(file) ?? []), name]);
  }
  return [...byFile.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([file, fileNames]) => uiImport(file, ...fileNames))
    .join("\n");
}

export { uiImportPrefix, layoutFiles, uiImport, layoutImports };
export type { LayoutExport };
