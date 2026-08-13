import { cn } from "@/utils/cn";

// 숫자와 단위로 이루어진 값 조각. (예: 12 "시간", 40 "분")
export interface StatSegment {
  value: string;
  unit: string;
}

interface StatCardProps {
  label: string;
  segments: StatSegment[];
  className?: string;
}

// 대시보드 좌측의 단일 지표 카드. (누적 공부 시간·일수·평균·달성률 등)
export default function StatCard({
  label,
  segments,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between gap-2 rounded-2xl bg-white p-5 shadow-1",
        className,
      )}
    >
      <p className="text-subtitle font-semibold text-gray-400">{label}</p>

      <p className="flex flex-wrap items-baseline gap-x-1 text-gray-400">
        {segments.map((segment) => (
          <span key={segment.unit} className="flex items-baseline gap-0.5">
            <span className="text-heading font-bold text-indigo">
              {segment.value}
            </span>
            <span className="text-body font-medium">{segment.unit}</span>
          </span>
        ))}
      </p>
    </div>
  );
}
