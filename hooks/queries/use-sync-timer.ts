import { updateTimer } from "@/apis/timers";
import { useTimerStore } from "@/store/use-timer-store";
import { useMutation } from "@tanstack/react-query";

// 현재까지의 일자별 경과를 서버에 동기화한다(PUT /api/timers/{timerId}).
// 일시정지 시점 반영과 폴링(heartbeat)에서 공용으로 쓴다.
export const useSyncTimer = () => {
  const { mutate } = useMutation({
    mutationFn: (timerId: string) =>
      updateTimer(timerId, {
        splitTimes: useTimerStore.getState().getSplitTimesSnapshot(),
      }),
    onError: (error) => {
      // 동기화 실패해도 로컬 상태는 유지된다(다음 동기화/종료 때 재반영).
      console.error("타이머 동기화 실패:", error);
    },
  });

  return { syncTimer: mutate };
};
