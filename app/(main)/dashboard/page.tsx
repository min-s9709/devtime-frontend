"use client";

import StatCard from "@/components/dashboard/stat-card";
import StudyHeatmap from "@/components/dashboard/study-heatmap";
import StudyLogTable from "@/components/dashboard/study-log-table";
import WeekdayChart from "@/components/dashboard/weekday-chart";
import { useStudyHeatmap } from "@/hooks/queries/use-study-heatmap";
import { useStudyStats } from "@/hooks/queries/use-study-stats";
import { durationSegments } from "@/utils/format-time";

export default function Dashboard() {
  const { stats, isLoading, isError } = useStudyStats();
  const { heatmap } = useStudyHeatmap();

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center text-body text-gray-500">
        통계를 불러오는 중...
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="flex h-full w-full items-center justify-center text-body text-gray-500">
        통계를 불러오지 못했어요.
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4 py-10">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        {/* 좌측 지표 카드 2x2 */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            label="누적 공부 시간"
            segments={durationSegments(stats.totalStudyTime)}
          />
          <StatCard
            label="누적 공부 일수"
            segments={[{ value: String(stats.consecutiveDays), unit: "일째" }]}
          />
          <StatCard
            label="하루 평균 공부 시간"
            segments={durationSegments(stats.averageDailyStudyTime)}
          />
          <StatCard
            label="목표 달성률"
            segments={[
              {
                value: String(Math.round(stats.taskCompletionRate)),
                unit: "%",
              },
            ]}
          />
        </div>

        {/* 우측 요일별 차트 */}
        <WeekdayChart weekdayStudyTime={stats.weekdayStudyTime} />
      </div>

      {/* 공부 시간 바다 (히트맵) */}
      {heatmap && <StudyHeatmap heatmap={heatmap} />}

      {/* 학습 기록 목록 (페이지네이션 + 상세 모달) */}
      <StudyLogTable />
    </div>
  );
}
