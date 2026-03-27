import type { NextConfig } from "next";

const repoName = "my-prep";

const nextConfig: NextConfig = {
  output: "export",
  basePath: `/${repoName}`,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
