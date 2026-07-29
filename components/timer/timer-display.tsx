"use client";

import TimerSeperator from "@/assets/icons/timer-seperator.svg";
import { useTimerStore } from "@/store/use-timer-store";
import { sumSplits } from "@/utils/day-splits";
import { formatElapsed } from "@/utils/format-time";
import { Fragment, useEffect, useState } from "react";

// 경과 시간을 HH:MM:SS 세그먼트로 보여주는 타이머 표시부.
// 시간의 원천은 useTimerStore이며, 이 컴포넌트는 값을 "소유"하지 않고 매 렌더마다
// 파생 계산만 한다. 상태(running/paused/idle)와 재생 제어는 각각 timer-bootstrap의
// 복구, timer-controls의 버튼이 담당한다.
export default function TimerDisplay() {
  // 시계 원천값. baseMs=일자별 확정 누적치 합(ms), anchorMs=현재 running 구간의
  // 시작 시각. 자세한 의미는 store/use-timer-store.ts 참고.
  const status = useTimerStore((s) => s.status);
  const baseMs = useTimerStore((s) => sumSplits(s.splits));
  const anchorMs = useTimerStore((s) => s.anchorMs);

  // now는 리렌더마다 현재 시각을 반영하기 위한 값일 뿐, 경과 시간을 누적하지 않는다.
  // 경과값은 아래에서 (baseMs + now - anchorMs)로 그때그때 파생하므로, 이 state는
  // "다시 계산하도록 리렌더를 트리거"하는 역할만 한다.
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    // running일 때만 시계가 흐르므로 그때만 갱신 루프를 돈다.
    // (paused/idle이면 elapsedMs가 baseMs로 고정이라 리렌더가 필요 없다.)
    if (status !== "running") return;

    const rerender = () => setNow(Date.now());
    const id = setInterval(rerender, 1000);
    document.addEventListener("visibilitychange", rerender); // 탭 복귀 시 즉시 갱신

    // 탭을 떠날 때(새로고침·닫기) 진행분을 baseMs로 접어 paused로 저장한다.
    // → localStorage에 정확한 누적치가 동기 반영되고, 재방문 시 오프라인 gap 없이
    //   그 시점 시간에서 복구된다.
    const foldOnLeave = () => useTimerStore.getState().pause();
    window.addEventListener("pagehide", foldOnLeave);

    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", rerender);
      window.removeEventListener("pagehide", foldOnLeave);
    };
  }, [status]);

  // 화면에 표시할 총 경과 시간(ms).
  // - running: 확정 누적치(baseMs)에 현재 흐르는 구간의 길이(now - anchorMs)를 더한다.
  // - paused/idle: 흐르는 구간이 없으므로 baseMs 그대로.
  // 구간 길이는 0으로 클램프한다: resume 직후 첫 tick(최대 1초) 전까지는 now가
  // stale이라 (now - anchorMs)가 음수일 수 있는데, 그 동안은 baseMs(정지 시점 값)를
  // 그대로 보여줘야 하기 때문이다. 이후 tick에서 now가 갱신되며 자연히 증가한다.
  const runningMs =
    status === "running" && anchorMs ? Math.max(0, now - anchorMs) : 0;
  const elapsedMs = baseMs + runningMs;
  // ms를 2자리 시/분/초 문자열로 분해(utils/format-time.ts).
  const { hours, minutes, seconds } = formatElapsed(elapsedMs);

  const units = [
    { label: "HOURS", value: hours },
    { label: "MINUTES", value: minutes },
    { label: "SECONDS", value: seconds },
  ] as const;

  return (
    <div className="flex items-center gap-6">
      {units.map((unit, index) => (
        <Fragment key={unit.label}>
          <div className="flex flex-col items-center gap-6 rounded-xl border border-primary-light-30 bg-primary-light-10 px-12 py-8">
            {/* 7세그먼트 LED 느낌: "88"을 흐리게 깔아 꺼진 세그먼트 잔상을 만들고,
                그 위에 실제 값을 겹쳐 켜진 세그먼트처럼 보이게 한다. 두 span의
                자릿수/폰트가 같아야 정확히 겹친다. */}
            <div className="relative inline-block font-digital text-8xl leading-none">
              {/* 꺼진 세그먼트 잔상 (스크린리더에는 숨김) */}
              <span aria-hidden className="text-primary-10">
                88
              </span>
              {/* 실제 값 — absolute로 잔상 위에 정확히 포갠다 */}
              <span className="absolute inset-0 text-primary">{unit.value}</span>
            </div>
            <span className="text-caption font-semibold uppercase tracking-[0.35em] text-primary">
              {unit.label}
            </span>
          </div>
          {index < units.length - 1 && (
            <TimerSeperator className="mb-10 h-14 w-3 text-primary" />
          )}
        </Fragment>
      ))}
    </div>
  );
}
