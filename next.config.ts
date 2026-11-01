import type { NextConfig } from "next";

// The site is a static export (out/) served by Cloudflare Workers Static
// Assets. Response headers live in public/_headers, because next.config
// headers() does not apply to static exports.
const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  reactCompiler: true,
  // AGENTS.md at the repository root owns agent guidance.
  agentRules: false,
};

export default nextConfig;
