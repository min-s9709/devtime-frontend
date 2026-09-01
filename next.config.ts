import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // MinIO(localhost)는 사설/루프백 IP라 next/image의 SSRF 방어에 막힌다.
    // 로컬 개발에서만 허용하고, 운영에서는 방어를 유지한다.
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
    remotePatterns: [
      // 로컬 개발용 S3(MinIO)에서 내려오는 프로필 이미지.
      // LocalStack은 객체를 메모리에만 보관해 컨테이너 재시작마다 업로드 이미지가
      // 사라졌고(= next/image의 upstream 404 원인), 그래서 MinIO로 교체했다.
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
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
