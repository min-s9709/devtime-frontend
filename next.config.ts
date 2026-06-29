import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // LocalStack(localhost)은 사설/루프백 IP라 next/image의 SSRF 방어에 막힌다.
    // 로컬 개발에서만 허용하고, 운영에서는 방어를 유지한다.
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
    remotePatterns: [
      // 로컬 개발용 S3(LocalStack)에서 내려오는 프로필 이미지
      {
        protocol: "http",
        hostname: "localhost",
        port: "4566",
        pathname: "/**",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;
