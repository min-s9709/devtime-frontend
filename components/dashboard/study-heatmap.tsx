"use client";

import { GetStudyHeatmapResponse } from "@/types/response";
import { cn } from "@/utils/cn";
import { formatKoreanDuration } from "@/utils/format-time";
import HeatMap from "@uiw/react-heat-map";
import { useEffect, useMemo, useRef, useState } from "react";

// 기록이 없는 날의 셀 색.
const EMPTY_COLOR = "var(--color-gray-50)";

// colorLevel(0~5) → 파란색 6단계 (옅음 → 짙음).
// 0: 0~2h · 1: 2~4h · 2: 4~6h · 3: 6~8h · 4: 8~10h · 5: 10h 초과
const LEVEL_COLORS = [
  "var(--color-gray-100)",
  "var(--color-indigo-light)",
  "var(--color-primary-light)", // #78b0ff
  "var(--color-primary)", // #4c79ff
  "#2b5fd9",
  "var(--color-indigo)", // #023e99
];

const WEEK_LABELS = ["일", "월", "화", "수", "목", "금", "토"];
const MONTH_LABELS = [
  "1월",
  "2월",
  "3월",
  "4월",
  "5월",
  "6월",
  "7월",
  "8월",
  "9월",
  "10월",
  "11월",
  "12월",
];

const MIN_RECT_SIZE = 11; // 컨테이너가 좁을 때의 최소 셀 크기 (이하로는 가로 스크롤)
const SPACE = 3;
const LEFT_PAD = 28; // weekLabels가 있을 때 라이브러리 기본 좌측 여백
const TOP_PAD = 20; // 상단 월 라벨 영역 (라이브러리 기본값)
const DAYS_PER_WEEK = 7;
const WEEKS = 52; // 오늘 기준 1년(52주) 표시

type HeatmapCell = GetStudyHeatmapResponse["heatmap"][number];

// "2026-08-03" → 로컬 자정 Date (UTC 파싱으로 인한 하루 밀림 방지)
const parseLocalDate = (iso: string) => {
  const [year, month, day] = iso.slice(0, 10).split("-").map(Number);
  return new Date(year, month - 1, day);
};

// 라이브러리 내부 키 포맷(getDateToString)과 동일한 "YYYY/M/D"(패딩 없음)로 맞춘다.
const toDateKey = (date: Date) =>
  `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;

const startOfWeek = (date: Date) => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  result.setDate(result.getDate() - result.getDay());
  return result;
};

interface StudyHeatmapProps {
  heatmap: HeatmapCell[];
  className?: string;
}

interface TooltipState {
  x: number;
  y: number;
  above: boolean; // 셀 위(true)/아래(false) 중 어디에 띄울지
  text: string;
}

// 위쪽 공간이 이보다 좁으면 툴팁을 셀 아래로 뒤집는다 (툴팁 높이 + 여백 대략치).
const TOOLTIP_FLIP_THRESHOLD = 34;

/**
 * 일자별 공부량 히트맵 ("공부 시간 바다"). GitHub 잔디 스타일로, 오늘 기준 1년(52주)을
 * 열=주 / 행=요일 격자로 그린다. @uiw/react-heat-map 위에 얹었으며, 라이브러리의
 * 비직관적인 동작 몇 가지를 우회하고 있어 주의가 필요하다:
 *
 *   1. 격자는 width에 맞춰 주 열 개수(gridNum)를 정한다.
 *      → 폭을 꽉 채우려면 컨테이너 너비를 재서 셀 크기와 width를 직접 계산해야 한다.
 *   2. 격자는 startDate의 "주 시작"부터 오른쪽으로 그리고 endDate 이후는 잘라낸다.
 *      → 오늘 주를 맨 오른쪽에 두려면 startDate = 오늘의 주 − 51주로 잡는다.
 *   3. rectRender는 데이터 없는 셀 포함 모든 셀에 호출된다(빈 셀은 count 없음).
 *      → 색/툴팁을 우리 데이터(cellByKey)로 직접 계산해 "기록 없음"까지 처리한다.
 *   4. SVG에 height를 안 넣어 기본 150px로 잘린다. → height도 직접 계산해 넘긴다.
 */
export default function StudyHeatmap({
  heatmap,
  className,
}: StudyHeatmapProps) {
  const wrapperRef = useRef<HTMLDivElement>(null); // 툴팁 위치 기준 (스크롤 안 되는 래퍼)
  const containerRef = useRef<HTMLDivElement>(null); // 폭 측정용 (가로 스크롤 컨테이너)
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  // 오늘 기준으로 축을 잡는다. 렌더 중 Date.now() 호출을 피하려고 1회만 캡처한다.
  const [now] = useState(() => Date.now());

  const { cellByKey, startDate, endDate } = useMemo(() => {
    // 날짜 → 셀 조회용 맵 (rectRender에서 colorLevel·공부 시간 참조)
    const cellByKey = new Map<string, HeatmapCell>();
    heatmap.forEach((cell) => {
      cellByKey.set(toDateKey(parseLocalDate(cell.date)), cell);
    });

    // 오늘이 속한 주가 맨 오른쪽에 오도록, 그 주부터 좌측으로 52주를 표시한다.
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const startDate = startOfWeek(today);
    startDate.setDate(startDate.getDate() - (WEEKS - 1) * 7);
    const endDate = today;

    return { cellByKey, startDate, endDate };
  }, [heatmap, now]);

  // 컨테이너 너비를 측정해 52주가 폭을 꽉 채우도록 셀 크기를 계산한다.
  const [containerWidth, setContainerWidth] = useState(0);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => setContainerWidth(el.clientWidth);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // cellSpan = 셀 하나가 차지하는 폭(셀 + 간격). 52주가 컨테이너를 꽉 채우도록 역산한다.
  // 너무 좁아 최소 크기 미만이 되면 최소로 고정 → width가 컨테이너를 넘겨 가로 스크롤이 생긴다. (quirk #1)
  const cellSpan = containerWidth
    ? Math.max(
        MIN_RECT_SIZE + SPACE,
        Math.floor((containerWidth - LEFT_PAD) / WEEKS),
      )
    : MIN_RECT_SIZE + SPACE;
  const rectSize = cellSpan - SPACE; // 간격을 뺀 실제 셀 한 변
  const width = LEFT_PAD + WEEKS * cellSpan; // 이 폭에 맞춰 라이브러리가 52열을 그린다
  const height = TOP_PAD + DAYS_PER_WEEK * cellSpan + SPACE; // 7행이 안 잘리도록 높이 명시 (quirk #4)
  const rectRadius = Math.max(2, Math.round(rectSize / 5)); // 셀 크기에 비례한 모서리 라운드

  // 호버한 셀의 화면 위치를 래퍼 기준 좌표로 바꿔 툴팁을 셀 중앙 위(공간 부족 시 아래)에 띄운다.
  const showTooltip = (
    event: React.MouseEvent<SVGRectElement>,
    text: string,
  ) => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const wrapperRect = wrapper.getBoundingClientRect();
    const cellRect = event.currentTarget.getBoundingClientRect();
    // 셀 위쪽 여백이 부족하면(맨 윗행 등) 툴팁이 잘리므로 셀 아래로 뒤집는다.
    const above = cellRect.top - wrapperRect.top >= TOOLTIP_FLIP_THRESHOLD;
    setTooltip({
      x: cellRect.left - wrapperRect.left + cellRect.width / 2,
      y: (above ? cellRect.top : cellRect.bottom) - wrapperRect.top,
      above,
      text,
    });
  };

  return (
    <section
      className={cn(
        "flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-1",
        className,
      )}
    >
      <h2 className="text-title font-semibold text-gray-400">공부 시간 바다</h2>

      {/* 바깥 래퍼(relative)는 클리핑하지 않아 툴팁이 안 잘린다. 스크롤/클리핑은 안쪽 div가 담당. */}
      <div ref={wrapperRef} className="relative">
        <div ref={containerRef} className="overflow-x-auto">
          <HeatMap
            startDate={startDate}
            endDate={endDate}
            width={width}
            height={height}
            rectSize={rectSize}
            space={SPACE}
            legendCellSize={0} // 기본 범례 숨김 (아래에서 커스텀 범례로 대체)
            weekLabels={WEEK_LABELS}
            monthLabels={MONTH_LABELS}
            rectProps={{ rx: rectRadius }}
            style={{ color: "var(--color-gray-400)", fontSize: 10 }} // 월/요일 라벨 색·크기
            // 모든 셀(빈 셀 포함)에 호출된다. 색·툴팁을 우리 데이터로 직접 계산한다. (quirk #3)
            rectRender={(rectProps, data) => {
              // data.date는 라이브러리 포맷("YYYY/M/D"). cellByKey에 있으면 기록 있는 날.
              const cell = cellByKey.get(data.date);
              const seconds = cell ? Math.round(cell.studyTimeHours * 3600) : 0;
              const hasRecord = seconds > 0;
              // colorLevel 0~5를 팔레트 인덱스 범위로 안전하게 클램프.
              const level = Math.min(
                Math.max(cell?.colorLevel ?? 0, 0),
                LEVEL_COLORS.length - 1,
              );
              const fill = hasRecord ? LEVEL_COLORS[level] : EMPTY_COLOR;
              const text = hasRecord
                ? formatKoreanDuration(seconds, { withSeconds: true })
                : "기록 없음";

              return (
                <rect
                  {...rectProps}
                  fill={fill}
                  onMouseEnter={(event) => showTooltip(event, text)}
                  onMouseLeave={() => setTooltip(null)}
                />
              );
            }}
          />
        </div>

        {tooltip && (
          <span
            role="tooltip"
            className={cn(
              "pointer-events-none absolute z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-800 px-2.5 py-1.5 text-caption font-medium text-white shadow-1",
              tooltip.above && "-translate-y-full",
            )}
            style={{
              left: tooltip.x,
              top: tooltip.above ? tooltip.y - 6 : tooltip.y + 6,
            }}
          >
            {tooltip.text}
          </span>
        )}
      </div>

      {/* 범례: Shallow → Deep */}
      <div className="flex items-center gap-2 text-caption font-medium text-gray-400">
        <span>Shallow</span>
        <div className="flex gap-0.5">
          {LEVEL_COLORS.map((color) => (
            <span
              key={color}
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <span className="font-semibold text-indigo">Deep</span>
      </div>
    </section>
  );
}
