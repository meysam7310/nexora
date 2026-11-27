
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    agentFeedback: true,
  },

  cacheComponents: false,
  partialPrefetching: false,
};

export default nextConfig;

import("@opennextjs/cloudflare").then((m) =>
  m.initOpenNextCloudflareForDev()
);
