import { deleteStudyLog } from "@/apis/study-logs";
import AlertModal from "@/components/common/modal/alert-modal";
import { statsKeys, studyLogKeys } from "@/constants/query-keys";
import { useModalStore } from "@/store/use-modal-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createElement } from "react";

// 학습 기록 삭제(DELETE /api/study-logs/{studyLogId}). 삭제 성공 후 목록을 무효화해 다시 불러온다.
export const useDeleteStudyLog = () => {
  const queryClient = useQueryClient();
  const open = useModalStore((s) => s.open);

  const { mutate, isPending } = useMutation({
    mutationFn: (studyLogId: string) => deleteStudyLog(studyLogId),
    onSuccess: () => {
      // 삭제는 목록뿐 아니라 통계·히트맵 집계도 바꾸므로 셋 다 무효화해
      // 대시보드가 옛 값을 보이지 않게 한다.
      queryClient.invalidateQueries({ queryKey: studyLogKeys.all });
      queryClient.invalidateQueries({ queryKey: statsKeys.study });
      queryClient.invalidateQueries({ queryKey: statsKeys.heatmap });
    },
    onError: () => {
      open(
        createElement(AlertModal, {
          title: "학습 기록을 삭제하지 못했어요",
          description: "잠시 후 다시 시도해 주세요.",
        }),
      );
    },
  });

  return { deleteStudyLog: mutate, isPending };
};
