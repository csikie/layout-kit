import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { GuideSlug } from "@/lib/guides";
import { layoutFiles, layoutImports, uiImport, type LayoutExport } from "./imports";

/** Display the actual, typechecked demo source; normalize installed import paths. */
export function guideSource(slug: GuideSlug): string {
  return readFileSync(
    join(process.cwd(), "components/demos/guides", `${slug}.tsx`),
    "utf8",
  ).replace(
    /import\s*\{([^}]+)\}\s*from\s*"@\/components\/ui\/([^"]+)";/g,
    (_, names: string, file: string) => {
      const exports = names
        .split(",")
        .map((name) => name.trim())
        .filter(Boolean);
      return Object.values(layoutFiles).includes(file as (typeof layoutFiles)[LayoutExport])
        ? layoutImports(...(exports as LayoutExport[]))
        : uiImport(file, ...exports);
    },
  );
}
