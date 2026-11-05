# Search and AI discovery release checks

The site is a static export. Repository changes prepare its public content;
indexing, crawler access at the CDN, and search recommendations need separate
production evidence.

## Local verification

```bash
vp check
vp test
vp run typecheck
vp run build
vpx scripts/verify-seo.mjs
```

If the local sandbox prevents Turbopack's helper from binding a port,
`vp run build --webpack` verifies the same static export with Webpack. The
project's default build remains Turbopack.

The export check covers all navigation pages, metadata, canonical URLs, social
images, headings, JSON-LD, internal docs links, assets, sitemap, robots, and the
documentation index. Guide samples are rendered from their typechecked demo
source. `vp node scripts/render-social-image.mjs` rebuilds `public/og.png` from
`design/social/og.svg` using the sharp installation provided by Next.js.

## After deployment

- Verify the production HTML and response headers for the home page, all three
  guides, a primitive page, robots.txt, sitemap.xml, llms.txt, and og.png.
- Check HTTP-to-HTTPS redirects, extension/trailing-slash canonicalization, and
  an unknown URL returning HTTP 404. Do not redirect unrelated URLs to home.
- In Cloudflare, inspect AI Crawl Control, WAF rules, and crawler logs. A robots
  allowance does not bypass an edge challenge. Do not disable site-wide security
  to allow a crawler. A spoofed user agent alone does not verify crawler access.
- Permit the search crawlers relevant to the intended audience, including
  OAI-SearchBot. Training crawlers are a separate policy choice; this change does
  not alter the existing wildcard allowance in robots.txt.
- Check mobile rendering, keyboard navigation, anchor actions, and code copying.
- Measure Lighthouse performance and accessibility against the deployed pages.
  Use field data for Core Web Vitals when sufficient traffic becomes available;
  a local measurement is not field evidence.

## Discovery and measurement

Per the owner's requested sequence, add Search Console after this work is
deployed. Submit the sitemap and inspect representative URLs, canonical
selection, indexing, and any available AI-search inclusion controls. Also
consider Bing Webmaster Tools for discovery and diagnostics.

Track search impressions, queries, clicks, and referrals from AI services.
Record dated, repeatable searches with unbranded prompts, such as “React layout
primitives for shadcn” or “typed Tailwind Stack and Row components”. A single
model response is not proof of broad visibility or a stable recommendation.

Keep the public README, installation commands, compatibility statements, and
examples consistent with the implementation. Publish real usage examples when
available. Never invent adoption numbers, reviews, benchmarks, or endorsements.

`llms.txt` is an optional navigation aid generated from the same navigation as
the sitemap. It is not a ranking guarantee or a replacement for the HTML docs.

## Official references

- [Google: optimizing for generative AI search](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- [OpenAI: search and training crawlers](https://developers.openai.com/api/docs/bots)
- [Cloudflare: manage AI crawlers](https://developers.cloudflare.com/ai-crawl-control/features/manage-ai-crawlers/)
