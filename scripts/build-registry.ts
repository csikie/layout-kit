// Builds the shadcn registry into public/r.
//
// registry.json is committed without a "homepage"; this script injects the
// site origin from lib/site.ts into a temporary copy, then runs `shadcn build`
// against that copy. Pass --dev to point the registry at the local dev server.
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { developmentSiteUrl, productionSiteUrl } from "../lib/site";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dev = process.argv.includes("--dev");

const homepage = dev ? developmentSiteUrl : productionSiteUrl;

const registry = JSON.parse(readFileSync(join(root, "registry.json"), "utf8")) as Record<
  string,
  unknown
>;
const { $schema, name, ...rest } = registry;

const tempDir = join(root, "node_modules", ".cache", "layout-kit-registry");
const tempRegistry = join(tempDir, "registry.json");
mkdirSync(tempDir, { recursive: true });
writeFileSync(tempRegistry, `${JSON.stringify({ $schema, name, homepage, ...rest }, null, 2)}\n`);

const output = join(root, "public", "r");
rmSync(output, { recursive: true, force: true });

try {
  execFileSync(
    join(root, "node_modules", ".bin", "shadcn"),
    ["build", relative(root, tempRegistry), "--output", relative(root, output), "--cwd", root],
    { stdio: "inherit", cwd: root },
  );
} finally {
  rmSync(tempDir, { recursive: true, force: true });
}

console.log(`Registry built into ${relative(root, output)} with homepage ${homepage}`);
