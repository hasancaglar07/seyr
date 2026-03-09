import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@seyir/contracts", "@seyir/ui"],
  outputFileTracingRoot: path.join(process.cwd(), "../../"),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "seyrdijital.com",
      },
      {
        protocol: "https",
        hostname: "www.seyrdijital.com",
      },
      {
        protocol: "https",
        hostname: "admin.seyrdijital.com",
      },
    ],
  },
};

export default nextConfig;
