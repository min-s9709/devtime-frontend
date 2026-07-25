import { updateTimer } from "@/apis/timers";
import { useTimerStore } from "@/store/use-timer-store";
import { useEffect } from "react";

const HEARTBEAT_INTERVAL_MS = 10 * 60 * 1000; // 10분

// 타이머 상태 중간 업데이트(폴링).
// - running 중 10분마다 현재까지의 일자별 경과를 PUT /api/timers/{timerId}로 동기화
// - paused/idle로 바뀌면 effect cleanup이 인터벌을 정리해 폴링이 멈춘다
// - 다시 재생하면 status가 running으로 바뀌며 새 인터벌이 시작된다(재생 시점부터 10분)
export function useTimerHeartbeat() {
  const status = useTimerStore((s) => s.status);
  const timerId = useTimerStore((s) => s.timerId);

  useEffect(() => {
    if (status !== "running" || !timerId) return;

    const id = setInterval(() => {
      updateTimer(timerId, {
        splitTimes: useTimerStore.getState().getSplitTimesSnapshot(),
      }).catch((error) => {
        // 동기화 실패는 UI를 막지 않고 다음 주기/일시정지/종료 때 재반영된다.
        console.error("타이머 폴링 동기화 실패:", error);
      });
    }, HEARTBEAT_INTERVAL_MS);

    return () => clearInterval(id);
  }, [status, timerId]);
}
