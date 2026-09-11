import RankingContent from "@/components/ranking/ranking-content";
import { PATH } from "@/constants/path";
import { createMetadata } from "@/utils/create-metadata";

// 랭킹 조회는 accessToken이 필요한 인증 API라 크롤러에게는 빈 화면이다.
// 색인되면 내용 없는 페이지가 노출되므로 noindex로 둔다.
export const metadata = createMetadata({
  title: "랭킹",
  description:
    "다른 개발자들의 누적 학습 시간과 하루 평균 학습 시간 랭킹을 확인하세요.",
  path: PATH.RANKING,
  noIndex: true,
});

export default function Ranking() {
  return (
    <div className="flex w-full flex-col gap-4 py-10">
      <RankingContent />
    </div>
  );
}
