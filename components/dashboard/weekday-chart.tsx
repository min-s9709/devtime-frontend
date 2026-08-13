"use client";

import { GetStudyStatsResponse } from "@/types/response";
import { cn } from "@/utils/cn";
import { formatCompactDuration } from "@/utils/format-time";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

const AXIS_DIVISIONS = 3; // 세로축 기준선 개수
// 세로축 눈금 후보(초 단위): 5분 ~ 24시간
const STEP_CANDIDATES = [
  300, 600, 900, 1800, 3600, 7200, 10800, 21600, 43200, 86400,
];

type WeekdayStudyTime = GetStudyStatsResponse["weekdayStudyTime"];

// 차트 표시 순서: 일요일 시작 (S M T W T F S)
const DAYS: { key: keyof WeekdayStudyTime; label: string }[] = [
  { key: "Sunday", label: "S" },
  { key: "Monday", label: "M" },
  { key: "Tuesday", label: "T" },
  { key: "Wednesday", label: "W" },
  { key: "Thursday", label: "T" },
  { key: "Friday", label: "F" },
  { key: "Saturday", label: "S" },
];

interface WeekdayChartProps {
  weekdayStudyTime: WeekdayStudyTime;
  className?: string;
}

// 요일별 공부 시간 평균 막대 차트.
export default function WeekdayChart({
  weekdayStudyTime,
  className,
}: WeekdayChartProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  // 데이터 최댓값에 맞춰 "깔끔한" 세로축 최댓값과 기준선을 계산한다.
  const { axisMax, ticks, values } = useMemo(() => {
    const values = DAYS.map(({ key }) => (weekdayStudyTime[key] ?? 0) / 1000);
    const dataMax = Math.max(0, ...values);

    // step * 기준선개수 가 데이터 최댓값을 덮는 가장 작은 눈금 단위 선택
    const step =
      STEP_CANDIDATES.find((s) => s * AXIS_DIVISIONS >= dataMax) ??
      STEP_CANDIDATES[STEP_CANDIDATES.length - 1];
    const axisMax = step * AXIS_DIVISIONS;

    // 위→아래 순서의 눈금 값 (예: [3h, 2h, 1h])
    const ticks = Array.from(
      { length: AXIS_DIVISIONS },
      (_, i) => step * (AXIS_DIVISIONS - i),
    );

    return { axisMax, ticks, values };
  }, [weekdayStudyTime]);

  return (
    <section
      className={cn(
        "flex flex-col gap-6 rounded-2xl bg-primary p-6 text-white",
        className,
      )}
    >
      <h2 className="text-title font-bold">요일별 공부 시간 평균</h2>

      <div className="flex flex-1 gap-4">
        {/* 세로축 눈금 라벨 */}
        <div className="relative w-12 shrink-0 text-caption font-medium text-white/50">
          {ticks.map((tick) => (
            <span
              key={tick}
              className="absolute right-0 -translate-y-1/2"
              style={{ top: `${(1 - tick / axisMax) * 100}%` }}
            >
              {formatCompactDuration(tick)}
            </span>
          ))}
        </div>

        {/* 플롯 영역 */}
        <div className="relative flex-1">
          {/* 기준선 */}
          {ticks.map((tick) => (
            <span
              key={tick}
              className="absolute inset-x-0 border-t border-white/25"
              style={{ top: `${(1 - tick / axisMax) * 100}%` }}
            />
          ))}

          {/* 막대 */}
          <div className="relative flex h-50 items-end gap-3">
            {DAYS.map(({ key, label }, index) => {
              const seconds = values[index];
              const fillPercent = Math.min(100, (seconds / axisMax) * 100);
              const isHovered = hovered === index;

              return (
                <div
                  key={`${key}-${label}`}
                  className="relative flex h-full flex-1 justify-center"
                  onMouseEnter={() => setHovered(index)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {/* 트랙 (배경) */}
                  <div className="relative h-full w-full max-w-8 overflow-hidden rounded-md bg-primary-light-30">
                    {/* 값 채움 */}
                    <motion.div
                      className="absolute inset-x-0 bottom-0 rounded-sm bg-white"
                      initial={{ height: 0 }}
                      animate={{ height: `${fillPercent}%` }}
                      transition={{
                        duration: 0.6,
                        delay: index * 0.05,
                        ease: "easeOut",
                      }}
                    />
                  </div>

                  {/* 툴팁 */}
                  {isHovered && (
                    <span
                      role="tooltip"
                      className="pointer-events-none absolute z-10 -translate-y-2 whitespace-nowrap rounded-lg bg-gray-800 px-2.5 py-1.5 text-caption font-medium text-white shadow-1"
                      style={{ bottom: `${fillPercent}%` }}
                    >
                      {formatCompactDuration(seconds)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* 요일 라벨 */}
          <div className="mt-3 flex gap-3">
            {DAYS.map(({ key, label }, index) => (
              <div
                key={`${key}-label`}
                className="flex flex-1 justify-center"
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-caption font-semibold transition-colors",
                    hovered === index
                      ? "bg-white text-primary"
                      : "bg-white/20 text-white",
                  )}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
