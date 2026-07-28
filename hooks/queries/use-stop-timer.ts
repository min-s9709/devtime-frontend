import { stopTimer } from "@/apis/timers";
import AlertModal from "@/components/common/modal/alert-modal";
import { timerKeys } from "@/constants/query-keys";
import { resetTimerSession } from "@/store/reset-timer-session";
import { useModalStore } from "@/store/use-modal-store";
import { useTimerStore } from "@/store/use-timer-store";
import type { StopTimerRequest } from "@/types/request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createElement } from "react";

// 타이머 종료/세션 확정(POST /api/timers/{timerId}/stop).
// 성공 시 로컬 상태·저장분을 비우고 캐시를 제거한다. 모달 닫기는 호출부 onSuccess로.
export const useStopTimer = () => {
  const queryClient = useQueryClient();
  const open = useModalStore((s) => s.open);

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
    onError: () => {
      // 실패 시 세션이 저장된 것으로 오인하지 않도록 알린다. (로컬 세션은 그대로 유지)
      open(
        createElement(AlertModal, {
          title: "학습 기록을 저장하지 못했어요",
          description: "잠시 후 다시 시도해 주세요.",
        }),
      );
    },
  });

  return { stopTimer: mutate, isPending };
};
