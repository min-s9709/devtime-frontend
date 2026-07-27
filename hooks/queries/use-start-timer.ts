import { startTimer } from "@/apis/timers";
import { useSessionStore } from "@/store/use-session-store";
import { useTimerStore } from "@/store/use-timer-store";
import type { StartTimerRequest } from "@/types/request";
import { useMutation } from "@tanstack/react-query";

// 새 타이머 시작(POST /api/timers). 성공 시에만 응답의 서버 신원(timerId/studyLogId)을
// 시계에 주입하고 running으로 전환한다. 모달 닫기 등 UI는 호출부 onSuccess로.
export const useStartTimer = () => {
  const start = useTimerStore((s) => s.start);
  const setPhase = useSessionStore((s) => s.setPhase);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: StartTimerRequest) => startTimer(data),
    onSuccess: ({ timerId, studyLogId }) => {
      start({ timerId, studyLogId });
      setPhase("running");
    },
  });

  return { startTimer: mutate, isPending };
};
