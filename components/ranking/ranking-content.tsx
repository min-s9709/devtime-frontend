"use client";

import RankingList from "@/components/ranking/ranking-list";
import RankingSortTabs from "@/components/ranking/ranking-sort-tabs";
import { RankingSortBy } from "@/types/request";
import { useState } from "react";

// 정렬 상태를 페이지에서 분리해, 페이지가 metadata를 내보낼 수 있는
// 서버 컴포넌트로 남도록 한다.
export default function RankingContent() {
  // 기획상 기본 정렬 기준은 '누적 학습 시간'(total)이다.
  const [sortBy, setSortBy] = useState<RankingSortBy>("total");

  return (
    <>
      <RankingSortTabs value={sortBy} onChange={setSortBy} />
      <RankingList sortBy={sortBy} />
    </>
  );
}
