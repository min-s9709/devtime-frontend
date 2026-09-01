"use client";

import { useRankings } from "@/hooks/queries/use-rankings";
import { RankingSortBy } from "@/types/request";
import { useEffect, useRef } from "react";
import RankingCard from "./ranking-card";

interface RankingListProps {
  sortBy: RankingSortBy;
}

export default function RankingList({ sortBy }: RankingListProps) {
  const {
    rankings,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isError,
  } = useRankings(sortBy);

  const sentinelRef = useRef<HTMLDivElement>(null);

  // 목록 바닥의 sentinel이 보이면 다음 페이지를 이어 붙인다.
  // 이미 요청 중이면 fetchNextPage가 알아서 무시하므로 별도 가드는 두지 않는다.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) fetchNextPage();
      },
      { rootMargin: "200px" }, // 바닥에 닿기 전에 미리 당겨와 끊김을 줄인다
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  if (isPending) {
    return (
      <div className="flex w-full items-center justify-center py-20 text-body text-gray-500">
        랭킹을 불러오는 중...
      </div>
    );
  }

  if (isError || !rankings) {
    return (
      <div className="flex w-full items-center justify-center py-20 text-body text-gray-500">
        랭킹을 불러오지 못했어요.
      </div>
    );
  }

  if (rankings.length === 0) {
    return (
      <div className="flex w-full items-center justify-center py-20 text-body text-gray-500">
        아직 랭킹에 오른 유저가 없어요.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {rankings.map((item) => (
        <RankingCard key={item.userId} item={item} />
      ))}

      {/* 무한스크롤 트리거 */}
      <div ref={sentinelRef} aria-hidden />

      {isFetchingNextPage && (
        <p className="py-4 text-center text-body-sm text-gray-400">
          불러오는 중...
        </p>
      )}
    </div>
  );
}
