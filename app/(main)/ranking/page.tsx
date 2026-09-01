"use client";

import RankingList from "@/components/ranking/ranking-list";
import RankingSortTabs from "@/components/ranking/ranking-sort-tabs";
import { RankingSortBy } from "@/types/request";
import { useState } from "react";

export default function Ranking() {
  // 기획상 기본 정렬 기준은 '누적 학습 시간'(total)이다.
  const [sortBy, setSortBy] = useState<RankingSortBy>("total");

  return (
    <div className="flex w-full flex-col gap-4 py-10">
      <RankingSortTabs value={sortBy} onChange={setSortBy} />
      <RankingList sortBy={sortBy} />
    </div>
  );
}
