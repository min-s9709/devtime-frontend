import { deleteTimer } from "@/apis/timers";
import { timerKeys } from "@/constants/query-keys";
import { resetTimerSession } from "@/store/reset-timer-session";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// 타이머 초기화(DELETE /api/timers/{timerId}).
// 서버에서 지워진 뒤에만 로컬을 비운다 — 먼저 비우면 삭제 실패 시 서버에 타이머가
// 남아 다음 진입에서 되살아난다.
export const useDeleteTimer = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (timerId: string) => deleteTimer(timerId),
    onSuccess: () => {
      resetTimerSession();
      queryClient.removeQueries({ queryKey: timerKeys.active });
    },
    onError: (error) => {
      console.error("타이머 초기화 실패:", error);
    },
  });

  return { deleteTimer: mutate, isPending };
};
