import TimerSeperator from "@/assets/icons/timer-seperator.svg";
import { Fragment } from "react";

// TODO: useTimerStore의 경과 시간을 h/m/s로 포맷해 주입
const TIMER_UNITS = [
  { label: "HOURS", value: "00" },
  { label: "MINUTES", value: "00" },
  { label: "SECONDS", value: "00" },
] as const;

export default function TimerDisplay() {
  return (
    <div className="flex items-center gap-6">
      {TIMER_UNITS.map((unit, index) => (
        <Fragment key={unit.label}>
          <div className="flex flex-col items-center gap-6 rounded-xl border border-primary-light-30 bg-primary-light-10 px-12 py-8">
            <div className="relative inline-block font-digital text-8xl leading-none">
              {/* 꺼진 세그먼트 잔상 */}
              <span aria-hidden className="text-primary-10">
                88
              </span>
              {/* 실제 값 */}
              <span className="absolute inset-0 text-primary">{unit.value}</span>
            </div>
            <span className="text-caption font-semibold uppercase tracking-[0.35em] text-primary">
              {unit.label}
            </span>
          </div>
          {index < TIMER_UNITS.length - 1 && (
            <TimerSeperator className="mb-10 h-14 w-3 text-primary" />
          )}
        </Fragment>
      ))}
    </div>
  );
}
