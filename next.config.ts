import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  async rewrites() {
    return [
      {
        source: '/teacher-login',
        destination: '/teacher_login',
      },
    ];
  },
};

export default nextConfig;
