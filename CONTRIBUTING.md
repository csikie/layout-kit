# Contributing

Thanks for helping improve Layout Kit.

Pull requests are welcome. The maintainer ([@csikie](https://github.com/csikie))
reviews and merges every change; `main` only accepts changes through a pull
request. By contributing you agree that your contribution is licensed under the
[MIT License](./LICENSE).

## Setup

```bash
vp install
cp .env.example .env.local   # only needed for production builds
vp run dev
```

`vp install` also installs the pre-commit hook, which runs `vp check --fix` on
staged files.

## Before you open a pull request

Run the same steps as CI:

```bash
vp check
vp run test
vp run typecheck
NEXT_PUBLIC_SITE_URL=https://example.com vp run build
```

`vp run preview` serves the static export from `out/` through `wrangler dev`.

## Changing a layout primitive

- Shared types and variant maps (`Gap`, `Align`, `Justify`, `Breakpoint`,
  `Responsive<T>`, `responsiveClasses`) belong in `lib/spacing.ts`. Props specific
  to one component stay in its file and are exported from it.
- Write every Tailwind class out in full. Tailwind cannot see class names built
  with template strings.
- Registry files may only import `react`, `@/lib/utils`, and registry lib files.
  If you add a lib import, add the matching `registryDependencies` entry;
  `tests/registry.test.ts` fails otherwise.
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
