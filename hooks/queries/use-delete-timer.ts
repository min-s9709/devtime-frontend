import { deleteTimer } from "@/apis/timers";
import AlertModal from "@/components/common/modal/alert-modal";
import { timerKeys } from "@/constants/query-keys";
import { resetTimerSession } from "@/store/reset-timer-session";
import { useModalStore } from "@/store/use-modal-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createElement } from "react";

// 타이머 초기화(DELETE /api/timers/{timerId}).
// 서버에서 지워진 뒤에만 로컬을 비운다 — 먼저 비우면 삭제 실패 시 서버에 타이머가
// 남아 다음 진입에서 되살아난다.
export const useDeleteTimer = () => {
  const queryClient = useQueryClient();
  const open = useModalStore((s) => s.open);

  const { mutate, isPending } = useMutation({
    mutationFn: (timerId: string) => deleteTimer(timerId),
    onSuccess: () => {
      resetTimerSession();
      queryClient.removeQueries({ queryKey: timerKeys.active });
    },
    onError: () => {
      // 실패 시 초기화된 것으로 오인하지 않도록 알린다. (로컬 상태는 그대로 유지)
      open(
        createElement(AlertModal, {
          title: "타이머를 초기화하지 못했어요",
          description: "잠시 후 다시 시도해 주세요.",
        }),
      );
    },
  });

  return { deleteTimer: mutate, isPending };
};
