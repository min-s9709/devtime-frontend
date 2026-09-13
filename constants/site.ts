// 서비스 자체의 공개 주소. 백엔드 주소(NEXT_PUBLIC_API_BASE_URL)와는 별개다.
// OG·canonical·sitemap은 절대 URL이어야 하는데, 서버 렌더링 시점에는 window.location이
// 없으므로 자기 도메인을 명시적으로 알려줘야 한다.
// 서버에서만 평가되는 곳(metadata / robots.ts / sitemap.ts)에서만 import한다.
const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

// 배포 빌드에서 도메인이 비면 canonical·og:url·sitemap이 전부 localhost를 가리킨다.
// robots.ts가 색인은 막아주지만, 메신저 크롤러는 robots.txt를 보지 않아 공유 카드가
// 깨진 채로 나간다. 게다가 robots 차단은 조용히 실패해서 눈치채기 어렵다.
// 그래서 프로덕션 빌드는 여기서 실패시킨다(apis/api-client.ts와 같은 방식).
if (process.env.NODE_ENV === "production" && !rawSiteUrl) {
  throw new Error(
    "NEXT_PUBLIC_SITE_URL is not defined — 프로덕션 빌드에는 배포 도메인이 필요하다.",
  );
}

function normalizeSiteUrl(value: string): string {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`NEXT_PUBLIC_SITE_URL is not a valid URL: ${value}`);
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error(`NEXT_PUBLIC_SITE_URL must be http(s): ${value}`);
  }

  // 끝 슬래시를 남기면 robots.ts의 `${SITE_URL}/sitemap.xml`이 `//sitemap.xml`이 된다.
  return value.replace(/\/+$/, "");
}

// 로컬 개발에서는 localhost가 실제로 올바른 값이라 기본값을 유지한다.
// 이 값이 쓰이면 robots.ts가 전체 차단으로 응답해 로컬 빌드가 색인될 일은 없다.
export const SITE_URL = normalizeSiteUrl(rawSiteUrl ?? "http://localhost:3000");

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
