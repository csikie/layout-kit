<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Built-in Commands vs Scripts

`vp <name>` runs a built-in command. `vp run <name>` runs a `package.json` script or a `vite.config.ts` task. Scripts cannot overwrite built-ins, so `vp dev` and `vp run dev` may do different things. Check `package.json` and `vite.config.ts` first, and run `vp run <name>` when the project defines a script or task with that name.

## Running Scripts

Run TypeScript and JavaScript files with `vpx <file>`, for example `vpx ./scripts/seed.ts --dry-run`. It handles enums, decorators, JSX, and tsconfig `paths`, so do not add `tsx` or `ts-node` to run scripts. `vpx --watch <file>` reruns the file when a file it uses changes, in place of `tsx watch`. `vp node <file>` runs plain Node.js.

## Tool Versions

Run `vp toolchain` to show versions and relationships in the active Vite+
release. Add a tool name to select part of the graph. For example, run
`vp toolchain vite`. Use `--global` to ignore the local `vite-plus` package. Use
`vp why <package>` to show the package-manager dependency graph.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->

# Project notes for agents

- One Next.js app is both the docs site and the shadcn registry source. There is
  no package build and nothing is published to npm.
- `registry.json` points directly at `components/ui/*.tsx` and `lib/spacing.ts`.
  Registry files may only import `react`, `@/lib/utils`, or other registry lib
  files; `tests/registry.test.ts` enforces this and checks `registryDependencies`.
- Shared layout types and variant maps live in `lib/spacing.ts`. Component-specific
  props stay in, and are exported from, their component files.
- Tailwind classes must appear verbatim in source. Never build class names with
  template strings; add explicit entries to the variant maps instead.
- Code samples on the docs site build their import lines with
  `lib/examples/imports.ts` (`uiImport`, `layoutImports`).
- `vp run build` needs `NEXT_PUBLIC_SITE_URL` (see `.env.example`) and writes a
  static export to `out/`. Nothing may need a server at request time: no
  `headers()`/rewrites in `next.config.ts`, no dynamic route handlers, and
  metadata routes are `force-static`. Response headers belong in
  `public/_headers` (Cloudflare Workers Static Assets, see `wrangler.jsonc`).
- Keep the shadcn preset (base-mira / olive / hugeicons) and `app/globals.css`
  colour tokens unchanged; the only docs additions there are the `--font-serif`
  and `--font-mono` tokens. `app/globals.css` is the only stylesheet: style the
  docs with Tailwind utilities and lay them out with the kit's own primitives
  (Stack, Row, Col, Grid, GridItem, Page). `tests/conventions.test.ts` rejects
  other `.css` files and `<div className="flex|grid ...">` in docs, shell, and
  demo code. Shared docs typography lives in `components/docs/typography.tsx`.
- Custom breakpoints are written in rem (`min-[72rem]:`), so Tailwind orders
  them correctly next to `sm:`/`lg:`.
- Theme switching uses `next-themes` (`components/shell/providers.tsx`).
- Files in `components/ui/` and `hooks/` declare without `export` and end with
  `export { ... }` / `export type { ... }`; barrels re-export with
  `export ... from`. `tests/conventions.test.ts` enforces this.
- Every `app/**/page.tsx` sets its metadata with `pageMetadata` from
  `lib/metadata.ts` (canonical URL, Open Graph, Twitter). New docs pages go in
  `lib/navigation.ts`; the sidebar, breadcrumb (`lib/breadcrumbs.ts`) and
  sitemap derive from it.
- Shiki modules (`lib/highlight.ts`, `components/docs/code-block.tsx`) are
  `server-only`. Add `"use client"` only to modules that use hooks, event
  handlers or browser APIs.
