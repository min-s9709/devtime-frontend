import QueryProvider from "@/apis/query-provider";
import Modal from "@/components/common/modal";
import AuthProvider from "@/components/providers/auth-provider";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/constants/site";
import "@/styles/globals.css";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  // 상대 경로(OG 이미지 등)를 절대 URL로 바꿀 때 기준이 되는 도메인.
  metadataBase: new URL(SITE_URL),
  // 하위 페이지가 title에 "랭킹"만 지정해도 "랭킹 | DevTime"으로 완성된다.
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  // 구글은 keywords를 무시한다. 국내 검색엔진 대응용으로만 남겨둔다.
  keywords: [
    "DevTime",
    "데브타임",
    "개발자 타이머",
    "공부 시간 측정",
    "학습 대시보드",
    "개발자 스터디",
  ],
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "ko_KR",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

// themeColor는 metadata가 아니라 viewport로 분리해서 내보내야 한다.
export const viewport: Viewport = {
  themeColor: "#4c79ff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="font-sans">
        <QueryProvider>
          <AuthProvider>
            {children}
            <Modal />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
