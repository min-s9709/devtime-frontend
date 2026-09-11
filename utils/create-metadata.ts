import { OG_IMAGE, SITE_DESCRIPTION, SITE_NAME } from "@/constants/site";
import type { Metadata } from "next";

interface CreateMetadataParams {
  /** 페이지 제목. 생략하면 사이트 기본값(DevTime)을 그대로 쓴다. */
  title?: string;
  /** 검색 결과·공유 카드에 노출될 설명. 생략 시 사이트 기본 설명. */
  description?: string;
  /** canonical과 og:url에 쓸 경로. metadataBase 기준 상대 경로를 넘긴다. */
  path: string;
  /** 로그인해야 볼 수 있는 페이지처럼 색인되면 안 되는 경우 true. */
  noIndex?: boolean;
}

// Next의 메타데이터는 얕게 병합돼서, 페이지가 openGraph를 직접 정의하면
// 루트 레이아웃의 openGraph 객체가 통째로 교체된다(siteName·locale·type 유실).
// 그래서 페이지마다 손으로 쓰지 않고 여기서 전체 객체를 조립한다.
export function createMetadata({
  title,
  description = SITE_DESCRIPTION,
  path,
  noIndex = false,
}: CreateMetadataParams): Metadata {
  // title.template은 <title>에만 적용되고 og:title에는 적용되지 않는다.
  // 공유 카드에서도 브랜드가 보이도록 여기서 직접 조합한다.
  const socialTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

  return {
    ...(title && { title }),
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "ko_KR",
      url: path,
      title: socialTitle,
      description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [OG_IMAGE],
    },
    ...(noIndex && { robots: { index: false, follow: false } }),
  };
}
