// Builds the shadcn registry into public/r.
//
// registry.json is committed without a "homepage"; this script injects it from
// NEXT_PUBLIC_SITE_URL (the same value lib/site.ts uses) into a temporary copy,
// then runs `shadcn build` against that copy. Pass --dev to fall back to
// localhost when the variable is unset.
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import nextEnv from "@next/env";
import { resolveSiteUrl } from "../lib/site";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dev = process.argv.includes("--dev");

// Load .env* files the same way `next build` / `next dev` will.
nextEnv.loadEnvConfig(root, dev);

let homepage: string;
try {
  homepage = resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL, { strict: !dev });
} catch (error) {
  console.error(`registry:build: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}

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
