// 서비스 자체의 공개 주소. 백엔드 주소(NEXT_PUBLIC_API_BASE_URL)와는 별개다.
// OG·canonical·sitemap은 절대 URL이어야 하는데, 서버 렌더링 시점에는 window.location이
// 없으므로 자기 도메인을 명시적으로 알려줘야 한다.
//
// 배포 도메인이 확정되기 전까지는 localhost로 동작한다. 배포 후 .env에
// NEXT_PUBLIC_SITE_URL만 채우면 메타데이터·robots·sitemap이 함께 갱신된다.
// 서버에서만 평가되는 곳(metadata / robots.ts / sitemap.ts)에서만 import한다.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const SITE_NAME = "DevTime";

export const SITE_DESCRIPTION =
  "개발자를 위한 학습 타이머와 대시보드. 공부 시간을 기록하고 통계와 랭킹으로 성장을 확인하세요.";

// 공유 카드 이미지. app/opengraph-image.png가 이 경로로 서빙된다.
// 파일 컨벤션만으로는 부족한데, 페이지가 openGraph를 정의하는 순간 루트에서
// 주입된 images까지 통째로 교체되기 때문이다(얕은 병합). 그래서 명시적으로 참조한다.
export const OG_IMAGE = {
  url: "/opengraph-image.png",
  width: 1200,
  height: 630,
  alt: "DevTime — 개발자를 위한 학습 타이머와 대시보드",
} as const;
