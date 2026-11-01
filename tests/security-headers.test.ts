import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "vite-plus/test";
import nextConfig from "@/next.config";

const root = join(import.meta.dirname, "..");

/** Parses a Cloudflare `_headers` file into `{ pattern: { header: value } }`. */
function parseHeadersFile(source: string) {
  const rules: Record<string, Record<string, string>> = {};
  let current: Record<string, string> | undefined;
  for (const line of source.split("\n")) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    if (!/^\s/.test(line)) {
      current = rules[line.trim()] = {};
      continue;
    }
    const separator = line.indexOf(":");
    if (!current || separator === -1) throw new Error(`Malformed _headers line: ${line}`);
    current[line.slice(0, separator).trim()] = line.slice(separator + 1).trim();
  }
  return rules;
}

const rules = parseHeadersFile(readFileSync(join(root, "public/_headers"), "utf8"));

test("the site is a static export, so headers come from public/_headers", () => {
  expect(nextConfig.output).toBe("export");
  expect(nextConfig).not.toHaveProperty("headers");
});

test("every route sends the security headers", () => {
  expect(rules["/*"]).toMatchObject({
    "Content-Security-Policy": "frame-ancestors 'none'",
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
  });
  expect(rules["/*"]!["Permissions-Policy"]).toContain("camera=()");
  expect(rules["/*"]!["Strict-Transport-Security"]).toMatch(/^max-age=\d+$/);
});

test("registry items are readable cross-origin and revalidate", () => {
  expect(rules["/r/*"]).toMatchObject({ "Access-Control-Allow-Origin": "*" });
  expect(rules["/r/*"]!["Cache-Control"]).toContain("must-revalidate");
  expect(rules["/r/*"]!["Cache-Control"]).not.toContain("immutable");
});

test("only content-hashed build assets are cached as immutable", () => {
  expect(rules["/_next/static/*"]!["Cache-Control"]).toContain("immutable");
  expect(Object.keys(rules).length).toBeLessThanOrEqual(100);
});
