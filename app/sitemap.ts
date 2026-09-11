import { PATH } from "@/constants/path";
import { SITE_URL } from "@/constants/site";
import type { MetadataRoute } from "next";

// 색인 대상만 넣는다. noindex를 건 페이지를 여기에 올리면 "색인해달라"와
// "색인하지 마라"를 동시에 보내는 모순 신호가 된다.
// 로그인이 필요한 /ranking·/dashboard·/mypage와 가입 중간 단계인 /profile은 제외.
const INDEXABLE_PATHS = [PATH.HOME, PATH.LOGIN, PATH.SIGNUP] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return INDEXABLE_PATHS.map((path) => ({
    url: new URL(path, SITE_URL).toString(),
    lastModified,
    changeFrequency: "monthly",
    priority: path === PATH.HOME ? 1 : 0.7,
  }));
}
