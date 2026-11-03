# Layout Kit

Six typed React layout primitives for the space between your components:
**Stack, Row, Col, Grid, GridItem, and Page**. They ship as a
[shadcn registry](https://ui.shadcn.com/docs/registry), so the CLI copies the
source into your project and you own the code.

**Documentation and live examples: [layout.csikie.com](https://layout.csikie.com)**

```tsx
<Page>
  <Page.Header title="Orders" actions={<Button>New order</Button>} />
  <Page.Body aside={<OrderSummary />} asideWidth="sm">
    <Grid cols={{ base: 1, md: 3 }} gap={4}>
      {stats.map((stat) => (
        <StatCard key={stat.label} stat={stat} />
      ))}
    </Grid>
  </Page.Body>
</Page>
```

## Installation

Requirements: a shadcn project (`components.json` and the `cn` helper),
Tailwind CSS 4, and React 19.

1. Register the namespace in `components.json`:

   ```json
   {
     "registries": {
       "@layout-kit": "https://layout.csikie.com/r/{name}.json"
     }
   }
   ```

2. Add everything, or only what you need:

   ```bash
   npx shadcn@latest add @layout-kit/layout
   npx shadcn@latest add @layout-kit/page @layout-kit/grid
   ```

| Item             | Contents                                               |
| ---------------- | ------------------------------------------------------ |
| `layout`         | Every primitive below                                  |
| `layout-spacing` | Shared vocabulary; added automatically as a dependency |
| `stack`          | Vertical flex container                                |
| `row`            | Horizontal flex container                              |
| `col`            | Flex child with grow, shrink, and self                 |
| `grid`           | CSS grid with responsive columns                       |
| `grid-item`      | Responsive column span                                 |
| `page`           | Page frame: header, actions, body, aside               |

Files land in `components/ui/` and `lib/spacing.ts`, with imports rewritten to
your aliases. The primitives depend on `@base-ui/react`, which the CLI installs.

## The primitives

| Component  | Props                                                                                                                                                                            | Defaults                                      |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| `Stack`    | `gap`, `align`, `justify`                                                                                                                                                        | `gap 4`, `align "stretch"`, `justify "start"` |
| `Row`      | `gap`, `align`, `justify`, `wrap`                                                                                                                                                | `gap 4`, `align "center"`, `justify "start"`  |
| `Col`      | `grow`, `shrink`, `self`                                                                                                                                                         | `false`, `true`, `"auto"`                     |
| `Grid`     | `cols`, `gap`, `align`                                                                                                                                                           | `cols 1`, `gap 4`, `align "stretch"`          |
| `GridItem` | `span`                                                                                                                                                                           | `1`                                           |
| `Page`     | `size`, `gutter`; `Page.Header` `title`, `titleAs`, `description`, `metadata`, `actions`; `Page.Body` `aside`, `asideWidth`, `asidePosition`, `asideBreakpoint`, `asideCollapse` | `size "lg"`, `titleAs "h1"`                   |

- **Responsive values.** `gap`, `align`, `justify`, `cols`, and `span` take a
  single value or a mobile-first map: `cols={{ base: 1, md: 2, xl: 4 }}`.
- **Native props.** Every primitive accepts the props of its element and merges
  `className` last, so `<Stack gap={4} className="gap-2">` ends up with `gap-2`.
- **Any element.** Primitives render a `div`; `render` swaps it while keeping
  the layout classes, ref, and handlers:

  ```tsx
  <Stack render={<ul />} gap={2}>…</Stack>
  <Row render={<nav aria-label="Pagination" />} justify="between">…</Row>
  ```

- **Stack and Row are containers, Col is a flex child.** Stack and Row own
  `gap`, `align`, and `justify`. Col says how one region shares space inside
  them (`grow`, `shrink`, `self`) and sets `min-w-0` so text can truncate; nest
  a Stack inside it to space its children.
- **Page** keeps one `h1` per document (`titleAs` for nested pages), never
  competes with your app shell's `<header>`, and keeps the content first in
  reading order whichever side the aside sits on.

Shared value sets, from `lib/spacing.ts`:

- `Gap`: `0 | 1 | 2 | 3 | 4 | 6 | 8 | 12`
- `Align`: `"start" | "center" | "end" | "stretch" | "baseline"`
- `Justify`: `"start" | "center" | "end" | "between" | "around" | "evenly"`

## Contributing

Issues and pull requests are welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

[MIT](./LICENSE) © Erik Csiki-Gecse ([@csikie](https://github.com/csikie)). You
may use, copy, modify, and distribute the code, provided the copyright and
license notice stay in every copy or substantial portion.
