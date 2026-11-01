# Layout Kit mark

## Chosen concept: Keyed Block

Two equal, stepped blocks compose one square silhouette. The continuous stepped
gap represents the space between layout primitives; the blocks suggest a header,
body, and aside without drawing a dashboard. The pieces are rotational counterparts,
so neither is an ornamental container. The result feels assembled and architectural.
The existing Inter wordmark and its lime period remain separate and unchanged.

This was the strongest direction at favicon size: only two solid shapes, no tiny
cells, and a distinctive stepped gap. On the 32-unit grid, the gap is 4 units,
the narrowest limb is 8 units, and the outside inset is 2 units. At 16 px these
become a crisp 2 px gap, 4 px limbs, and 1 px inset. All path vertices are integers
and even coordinates. There are no strokes, embedded images, filters, gradients,
fonts, external resources, or editor metadata in the production SVGs.

## Three concepts considered

The built-in image-generation tool produced one raster exploration per direction.
These are exploratory references, not production artwork or color references.
The chosen idea was redrawn by hand, with equal pieces and a consistent gap.

1. **Open Frame** (`concepts/01-open-frame.png`): an ink L-shaped page frame
   with a separate lime header. Spacious, but reads more like a letter or crop tool.
2. **Offset Course** (`concepts/02-offset-course.png`): three horizontal blocks
   with different lengths and offsets. Expresses Stack and Row, but resembles a
   menu/alignment icon and has a weaker square silhouette.
3. **Keyed Block** (`concepts/03-keyed-block.png`): two interlocking stepped
   pieces. Selected for its compact silhouette and clear negative space at 16 px.

The exact exploration prompts are retained in `concepts/prompts.md`.

## Colors

| Role             | Authoritative color         | Computed sRGB hex fallback |
| ---------------- | --------------------------- | -------------------------- |
| Light-theme lime | `oklch(0.841 0.238 128.85)` | `#9AE600`                  |
| Dark-theme lime  | `oklch(0.768 0.233 130.85)` | `#7CCF00`                  |
| Ink              | `oklch(0.153 0.006 107.1)`  | `#0C0C09`                  |
| Paper            | `oklch(1 0 0)` / white      | `#FFFFFF`                  |

Conversion: OKLCH → OKLab → linear sRGB using the standard OKLab matrices,
then the sRGB transfer function, channel clipping to [0,1], and rounding to the
nearest 8-bit integer. Both lime colors are outside sRGB (negative blue channel),
so their hex values are clipped fallbacks, not exact colorimetric equivalents.
Color-managed browsers may gamut-map the authoritative OKLCH colors differently.

Each colored SVG path has a hex presentation fallback. CSS repeats the hex before
the authoritative OKLCH declaration, allowing older renderers to retain the hex.
The supplied PNGs use those sRGB fallbacks, as rendered by librsvg. In the dark
variant the structural piece is paper white and the accent uses dark-theme lime;
the geometry is identical. Both marks have transparent backgrounds and gaps.

## Files

| File                            | Purpose                                                          |
| ------------------------------- | ---------------------------------------------------------------- |
| `mark.svg`                      | Light-theme mark, transparent, `viewBox="0 0 32 32"`             |
| `mark-dark.svg`                 | Dark-background mark, identical geometry                         |
| `favicon.svg`                   | Adaptive SVG; embedded `prefers-color-scheme: dark` media query  |
| `icon-512.png`                  | 512 × 512 light mark, transparent RGBA                           |
| `apple-touch-icon.png`          | 180 × 180 light mark on opaque white, RGB                        |
| `favicon-32.png`                | 32 × 32 light fallback, transparent RGBA                         |
| `preview.png`                   | Native-size 16, 32, 64, 180 px marks on white and ink; 800 × 480 |
| `concepts/01-open-frame.png`    | Generated raster exploration 1                                   |
| `concepts/02-offset-course.png` | Generated raster exploration 2                                   |
| `concepts/03-keyed-block.png`   | Generated raster exploration 3                                   |
| `concepts/prompts.md`           | Exact image-generation prompts                                   |
| `render.mjs`                    | Reproducible exports using the existing `sharp` dependency       |
| `README.md`                     | Concept rationale, palette, usage, and verification              |

## Usage and rendering

Use `mark.svg` on white/light surfaces and `mark-dark.svg` on ink/dark surfaces.
Preserve the square aspect ratio and built-in inset. Minimum recommended size:
16 × 16 CSS pixels. Give an inline decorative mark `aria-hidden="true"` when
adjacent to the wordmark; give a standalone linked image the accessible name
"Layout Kit". The SVG files contain no visible text.

Once copied to the site's public asset location, the adaptive favicon is suitable
for `<link rel="icon" type="image/svg+xml" href="/favicon.svg">`.
This delivery does not wire assets into the site or replace the placeholder.

Rasterizer: the repository's existing **sharp 0.35.5 / librsvg 2.63.2**.
Rebuild from the repository root with `node design/logo/render.mjs`.
No dependencies were installed or changed. The script writes only within this
directory. The PNG preview uses Arial for its size labels, not for the mark.

Verified: SVG XML parsing, identical two-path geometry across variants, square
viewBoxes, native 16 px legibility on both backgrounds, PNG dimensions, opaque
RGB Apple icon, and solid fills/transparent gaps at 16 and 32 px. The preview
was inspected visually. The favicon's media-query rules were inspected statically;
browser/OS favicon selection and caching were not exercised. Application tests,
build, `vp install`, and `vp check` were not run because this task is restricted to
standalone design assets and those commands can write outside this directory.
