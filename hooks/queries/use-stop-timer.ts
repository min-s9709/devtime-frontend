import { stopTimer } from "@/apis/timers";
import { timerKeys } from "@/constants/query-keys";
import { resetTimerSession } from "@/store/reset-timer-session";
import { useTimerStore } from "@/store/use-timer-store";
import type { StopTimerRequest } from "@/types/request";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// 타이머 종료/세션 확정(POST /api/timers/{timerId}/stop).
// 성공 시 로컬 상태·저장분을 비우고 캐시를 제거한다. 모달 닫기는 호출부 onSuccess로.
export const useStopTimer = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: StopTimerRequest) => {
      const timerId = useTimerStore.getState().timerId;
      if (!timerId) throw new Error("종료할 타이머가 없습니다.");
      return stopTimer(timerId, payload);
    },
    onSuccess: () => {
      resetTimerSession();
      // 종료된 타이머가 부트스트랩에서 다시 복구되지 않도록 캐시 제거.
      queryClient.removeQueries({ queryKey: timerKeys.active });
    },
  });

  return { stopTimer: mutate, isPending };
};
