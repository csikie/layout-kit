import type { NextConfig } from "next";

// The docs site is a static export (out/).
const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  reactCompiler: true,
  agentRules: false,
};

export default nextConfig;
