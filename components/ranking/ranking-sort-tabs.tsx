"use client";

import { RankingSortBy } from "@/types/request";
import { cn } from "@/utils/cn";

// 기획상 정렬 기준은 '누적 학습 시간'(기본)과 '일 평균 학습 시간' 두 가지뿐이다.
const TABS: { value: RankingSortBy; label: string }[] = [
  { value: "total", label: "총 학습 시간" },
  { value: "avg", label: "일 평균 학습 시간" },
];

interface RankingSortTabsProps {
  value: RankingSortBy;
  onChange: (sortBy: RankingSortBy) => void;
}

export default function RankingSortTabs({
  value,
  onChange,
}: RankingSortTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="랭킹 정렬 기준"
      className="inline-flex gap-1 rounded-xl bg-white p-2 w-fit"
    >
      {TABS.map((tab) => {
        const isSelected = tab.value === value;

        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onChange(tab.value)}
            className={cn(
              "cursor-pointer rounded-lg px-4 py-2 text-subtitle transition-colors",
              isSelected
                ? "bg-primary-10 font-bold text-indigo"
                : "font-medium text-gray-400 hover:text-gray-600",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
