# Contributing

Thanks for helping improve Layout Kit.

Pull requests are welcome. The maintainer ([@csikie](https://github.com/csikie))
reviews and merges every change; `main` only accepts changes through a pull
request. By contributing you agree that your contribution is licensed under the
[MIT License](./LICENSE).

## Setup

The project uses [Vite+](https://viteplus.dev) (`vp`) with bun.

```bash
vp install   # dependencies and the pre-commit hook (vp check --fix on staged files)
vp run dev   # builds the registry for localhost and starts next dev
```

## Project layout

One Next.js app is both the documentation site and the registry source, so the
files the docs render are the files the registry ships.

```
app/                      docs pages (Next.js App Router); globals.css is the only stylesheet
components/ui/            shadcn components and the six layout primitives (registry source)
components/docs|demos|shell/   docs chrome, live demos, app shell
lib/spacing.ts            shared layout vocabulary (registry:lib)
lib/primitives.ts         prop tables and notes shown on the docs
lib/examples/             code samples; imports.ts holds the import prefix
registry.json             registry items, pointing straight at components/ui and lib
scripts/build-registry.ts adds the homepage and runs `shadcn build` into public/r
tests/                    vitest (jsdom)
```

## Before you open a pull request

Run the same steps as CI:

```bash
vp check
vp run test
vp run typecheck
vp run build   # registry and static export into out/
```

## Changing a layout primitive

- Shared types and variant maps (`Gap`, `Align`, `Justify`, `Breakpoint`,
  `Responsive<T>`, `responsiveClasses`) belong in `lib/spacing.ts`. Props specific
  to one component stay in its file and are exported from it.
- Write every Tailwind class out in full. Tailwind cannot see class names built
  with template strings.
- Registry files may only import `react`, `@/lib/utils`, registry lib files, and
  `@base-ui/react`. Keep `registryDependencies` and `dependencies` in
  `registry.json` in step with the imports; `tests/registry.test.ts` checks both.
- Use the primitive's `render` prop when the element matters
  (`<Stack render={<ul />}>`) instead of a hand-written flex element.
- Add or update render tests in `tests/layout/`: default classes, `data-slot`,
  scalar and responsive values, and `className` conflict resolution.
- Update the prop table in `lib/primitives.ts` and the examples in
  `lib/examples/` and `components/demos/layout/`. Build example imports with
  `uiImport` / `layoutImports` from `lib/examples/imports.ts`.

## Adding a registry item

1. Put the file in `components/ui/` (or `lib/` for a `registry:lib`).
2. Add the item to `registry.json` and, if it belongs to the bundle, to the
   `layout` item's `registryDependencies`.
3. Run `vp run registry:build` and check the JSON in `public/r/`.

## shadcn components

The preset is fixed: `base-mira`, `olive`, `hugeicons`. Add components with
`bunx --bun shadcn@latest add <component>`; do not change the theme tokens in
`app/globals.css`.

## Commits

Use clear, imperative commit messages that explain why a change was made.
