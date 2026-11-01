# Layout Kit

Six typed React layout primitives for the space between your components:
**Stack, Row, Col, Grid, GridItem, and Page**. They are distributed as a
[shadcn registry](https://ui.shadcn.com/docs/registry), so the CLI copies the
source into your project and you own the code.

This repository is a single Next.js app that is both the documentation site and
the registry source. There is no npm package.

## Install in your project

Requirements: an existing shadcn project (a `components.json` and a `cn` helper
at your utils alias), Tailwind CSS 4, and React 19.

1. Register the namespace in your `components.json`:

   ```json
   {
     "registries": {
       "@layout-kit": "https://<docs-site>/r/{name}.json"
     }
   }
   ```

2. Add everything, or only what you need:

   ```bash
   npx shadcn@latest add @layout-kit/layout
   npx shadcn@latest add @layout-kit/page @layout-kit/grid
   ```

`@layout-kit/layout` installs seven files: `lib/spacing.ts` and
`components/ui/{stack,row,col,grid,grid-item,page}.tsx`. Imports are rewritten to
your aliases.

| Item             | Type           | Contents                                               |
| ---------------- | -------------- | ------------------------------------------------------ |
| `layout`         | bundle         | Every primitive below                                  |
| `layout-spacing` | `registry:lib` | Shared vocabulary; added automatically as a dependency |
| `stack`          | `registry:ui`  | Vertical flex container                                |
| `row`            | `registry:ui`  | Horizontal flex container                              |
| `col`            | `registry:ui`  | Flex child with grow, shrink, and self                 |
| `grid`           | `registry:ui`  | CSS grid with responsive columns                       |
| `grid-item`      | `registry:ui`  | Responsive column span                                 |
| `page`           | `registry:ui`  | Page frame: header, actions, body, aside               |

## API summary

```tsx
import { Col } from "@/components/ui/col";
import { Grid } from "@/components/ui/grid";
import { GridItem } from "@/components/ui/grid-item";
import { Page } from "@/components/ui/page";
import { Row } from "@/components/ui/row";
import { Stack } from "@/components/ui/stack";
```

Every primitive renders one `div` (Page.Header renders a `header`) with Tailwind
classes, accepts the native props of that element, and merges `className` last
through `cn`, so `<Stack gap={4} className="gap-2">` ends up with `gap-2`.

`Responsive<T>` is a single value or a mobile-first map of `base`, `sm`, `md`,
`lg`, `xl`, and `2xl`.

| Component  | Props                                                                                                                                                     | Defaults                                      |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| `Stack`    | `gap`, `align`, `justify` (all `Responsive`)                                                                                                              | `gap 4`, `align "stretch"`, `justify "start"` |
| `Row`      | `gap`, `align`, `justify` (all `Responsive`), `wrap`                                                                                                      | `gap 4`, `align "center"`, `justify "start"`  |
| `Col`      | `grow`, `shrink`, `self`                                                                                                                                  | `false`, `true`, `"auto"`                     |
| `Grid`     | `cols`, `gap`, `align` (all `Responsive`)                                                                                                                 | `cols 1`, `gap 4`, `align "stretch"`          |
| `GridItem` | `span` (`Responsive<1–6 \| 12 \| "full">`)                                                                                                                | `1`                                           |
| `Page`     | `size`, `gutter`; `Page.Header` `title`/`description`/`metadata`/`actions`; `Page.Body` `aside`/`asideWidth`/`asidePosition`/`asideLabel`; `Page.Actions` | `size "lg"`, `asidePosition "end"`            |

Value sets, shared by every primitive through `lib/spacing.ts`:

- `Gap`: `0 | 1 | 2 | 3 | 4 | 6 | 8 | 12`
- `Align`: `"start" | "center" | "end" | "stretch" | "baseline"`
- `Justify`: `"start" | "center" | "end" | "between" | "around" | "evenly"`

### Design decision: Stack vs. Col

Earlier versions had two vertical containers: `Stack` (gap only) and `Col`
(gap, align, justify, grow, shrink). They overlapped. Now the roles are split:

- **Stack and Row are containers.** They own `gap`, `align`, and `justify` and
  accept exactly the same values; only the axis and the `align` default differ.
- **Col is a flex child.** It says how one region shares space inside a Row or
  Stack (`grow`, `shrink`, `self`) and sets `min-w-0` so text can truncate. It is
  not a container: to space its children, nest a Stack inside it.

```tsx
<Row gap={4} align="start">
  <Col shrink={false} className="w-44">
    …
  </Col>
  <Col grow>
    <Stack gap={2}>…</Stack>
  </Col>
</Row>
```

### Page

`Page.Body asidePosition="start"` mirrors the grid template, so the content
always gets the flexible track; DOM order stays content-first. Empty slots render
nothing: `aside={false}`, `metadata={0}`, or `description=""` produce no wrapper
and no stray text.

## Repository layout

```
app/                 docs pages (Next.js App Router)
  globals.css        shadcn preset tokens (base-mira / olive / hugeicons) plus the docs font tokens; the only stylesheet
components/ui/       shadcn components + the six layout primitives (registry source)
components/ui/data-table/, components/ui/app-breadcrumb/   shared composite UI used by the docs
components/docs|demos|shell/   docs chrome, live demos, app shell
lib/spacing.ts       shared layout vocabulary (registry:lib)
lib/utils.ts         cn
lib/examples/        code samples; imports.ts holds the single import prefix
registry.json        registry items, pointing straight at components/ui and lib
scripts/build-registry.ts   injects homepage and runs `shadcn build` into public/r
public/r/            generated registry JSON (gitignored)
tests/               vitest (jsdom): layout/, ui/, docs/, registry.test.ts
docs/                guides for the data table and breadcrumb
```

There is no separate `registry/` folder: the files the docs render are the files
the registry ships, so they cannot drift.

## Development

This project uses [Vite+](https://viteplus.dev) (`vp`) with bun.

```bash
vp install              # install dependencies, set up the pre-commit hook
vp run dev              # build the registry (localhost homepage) and start next dev
vp check                # format, lint, and type-aware lint
vp run test             # vitest
vp run typecheck        # next typegen + tsc
vp run registry:build   # regenerate public/r (needs NEXT_PUBLIC_SITE_URL)
vp run build            # registry:build + next build, static export to out/ (cached Vite Task)
vp run preview          # serve out/ locally with wrangler dev, as Cloudflare will
```

The pre-commit hook runs `vp staged` (`vp check --fix` on staged files).

## Environment variables

| Name                   | Required          | Purpose                                                                                                    |
| ---------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | production builds | Public origin of the site. Used for the install instructions and injected as `homepage` into the registry. |

Copy `.env.example` to `.env.local` for local production builds. `vp run dev`
falls back to `http://localhost:3000`; `vp run build` fails fast when the variable
is missing. The committed `registry.json` has no `homepage`; the build script adds
it from the same variable.

## Deployment

The site is a Next.js static export (`out/`) served by Cloudflare Workers
Static Assets at https://layout.csikie.com, configured in `wrangler.jsonc`. There
is no Worker script, so every request, including registry downloads, is a free
static asset request. Response headers (security headers, registry CORS and
cache rules) live in `public/_headers`; `next.config.ts` `headers()` does not
apply to static exports.

CI deploys every push to `main` after check, test, typecheck, and build pass.
It needs two repository secrets, `CLOUDFLARE_API_TOKEN` (an API token from the
"Edit Cloudflare Workers" template, limited to the `csikie.com` zone) and
`CLOUDFLARE_ACCOUNT_ID`. `vp run deploy` deploys `out/` by hand with the same
configuration.

## License

[MIT](./LICENSE) © Erik Csiki-Gecse ([@csikie](https://github.com/csikie)). You may use,
copy, modify, and distribute the code, provided the copyright and license
notice stay in every copy or substantial portion.
