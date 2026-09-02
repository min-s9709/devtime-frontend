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
  // deps의 isFetchingNextPage는 페이지를 붙인 뒤에도 sentinel이 화면에 남아 있을 때
  // 감시를 다시 걸어 이어받기 위한 것이다(observe 직후 현재 교차 상태가 한 번 통보된다).
  // 그 통보는 요청이 진행 중일 때도 오는데, fetchNextPage는 기본값 cancelRefetch:true라
  // 다시 부르면 진행 중 요청을 취소하고 새로 시작한다. 그래서 이중으로 막는다.
  // (isFetchingNextPage 가드만으로는 리렌더 전 짧은 틈이 남아 cancelRefetch:false도 함께 둔다)
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) {
          fetchNextPage({ cancelRefetch: false });
        }
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
