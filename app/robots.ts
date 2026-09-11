import { SITE_URL } from "@/constants/site";
import type { MetadataRoute } from "next";

// 배포 도메인이 아직 안 채워졌거나(NEXT_PUBLIC_SITE_URL 미설정) 프리뷰 배포면
// 전체를 막는다. 프리뷰가 공개 URL로 뜨면 실제 도메인과 중복 색인되고,
// 도메인이 없으면 아래 sitemap 주소가 localhost로 나가 어차피 쓸모가 없다.
const isConfigured = !SITE_URL.includes("localhost");
const isPreview = process.env.VERCEL_ENV === "preview";
const isIndexable = isConfigured && !isPreview;

export default function robots(): MetadataRoute.Robots {
  if (!isIndexable) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // 비공개 페이지는 robots.txt로 막지 않는다. 여기서 차단하면 크롤러가
      // 페이지에 진입하지 못해 HTML 안의 noindex 태그를 읽지 못하고,
      // 외부 링크가 걸리면 내용 없이 URL만 색인될 수 있다.
      // JSON을 반환해 태그를 심을 자리가 없는 API만 막는다.
      disallow: "/api/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
