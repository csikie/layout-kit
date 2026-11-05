import { fileURLToPath } from "node:url";
import sharp from "sharp";

// Uses sharp already installed with Next.js; no network or new dependency.
const source = fileURLToPath(new URL("../design/social/og.svg", import.meta.url));
const target = fileURLToPath(new URL("../public/og.png", import.meta.url));
await sharp(source).png().toFile(target);
