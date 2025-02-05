import type { NextConfig } from "next";

const nextConfig: NextConfig = ({
  devIndicators: {
    appIsrStatus: false
  },
  reactStrictMode: true,
});

export default nextConfig;
