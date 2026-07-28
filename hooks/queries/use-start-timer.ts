import { startTimer } from "@/apis/timers";
import AlertModal from "@/components/common/modal/alert-modal";
import { useModalStore } from "@/store/use-modal-store";
import { useSessionStore } from "@/store/use-session-store";
import { useTimerStore } from "@/store/use-timer-store";
import type { StartTimerRequest } from "@/types/request";
import { useMutation } from "@tanstack/react-query";
import { createElement } from "react";

// 새 타이머 시작(POST /api/timers). 성공 시에만 응답의 서버 신원(timerId/studyLogId)을
// 시계에 주입하고 running으로 전환한다. 모달 닫기 등 UI는 호출부 onSuccess로.
export const useStartTimer = () => {
  const start = useTimerStore((s) => s.start);
  const setPhase = useSessionStore((s) => s.setPhase);
  const open = useModalStore((s) => s.open);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: StartTimerRequest) => startTimer(data),
    onSuccess: ({ timerId, studyLogId }) => {
      start({ timerId, studyLogId });
      setPhase("running");
    },
    onError: () => {
      // 실패 시 조용히 끝나지 않도록 사용자에게 알린다. (로컬 상태는 idle 유지)
      open(
        createElement(AlertModal, {
          title: "타이머를 시작하지 못했어요",
          description: "잠시 후 다시 시도해 주세요.",
        }),
      );
    },
  });

  return { startTimer: mutate, isPending };
};
