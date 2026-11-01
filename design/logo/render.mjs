// Rebuild exports using the repository's existing sharp dependency; no install.
// Run from the repository root: node design/logo/render.mjs
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const directory = path.dirname(fileURLToPath(import.meta.url));
const light = await fs.readFile(path.join(directory, "mark.svg"));
const dark = await fs.readFile(path.join(directory, "mark-dark.svg"));
const raster = (svg, size) => sharp(svg).resize(size, size).png().toBuffer();

await fs.writeFile(path.join(directory, "icon-512.png"), await raster(light, 512));
await fs.writeFile(path.join(directory, "favicon-32.png"), await raster(light, 32));
await sharp(await raster(light, 180))
  .flatten({ background: "#ffffff" })
  .removeAlpha()
  .png()
  .toFile(path.join(directory, "apple-touch-icon.png"));

// Marks are composited at native pixel dimensions, never enlarged thumbnails.
const width = 800;
const height = 480;
const centers = [64, 184, 344, 604];
const sizes = [16, 32, 64, 180];
const panels = [
  { top: 0, background: "#ffffff", foreground: "#0c0c09", svg: light, label: "LIGHT / PAPER" },
  { top: 240, background: "#0c0c09", foreground: "#ffffff", svg: dark, label: "DARK / INK" },
];
const composites = [];
for (const panel of panels) {
  const labels = sizes
    .map(
      (size, index) => `<text x="${centers[index]}" y="220" text-anchor="middle">${size} px</text>`,
    )
    .join("");
  const backdrop = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="240">
    <rect width="800" height="240" fill="${panel.background}"/>
    <g fill="${panel.foreground}" font-family="Arial,sans-serif" font-size="11">
      <text x="16" y="20">${panel.label}</text>${labels}
    </g></svg>`;
  composites.push({ input: Buffer.from(backdrop), left: 0, top: panel.top });
  for (const [index, size] of sizes.entries()) {
    composites.push({
      input: await raster(panel.svg, size),
      left: centers[index] - size / 2,
      top: panel.top + 110 - size / 2,
    });
  }
}
await sharp({ create: { width, height, channels: 3, background: "#ffffff" } })
  .composite(composites)
  .removeAlpha()
  .png()
  .toFile(path.join(directory, "preview.png"));
console.log(`Rendered exports with sharp ${sharp.versions.sharp}, librsvg ${sharp.versions.rsvg}.`);
