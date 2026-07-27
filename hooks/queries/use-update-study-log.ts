import { updateStudyLog } from "@/apis/study-logs";
import { useTimerStore } from "@/store/use-timer-store";
import type { UpdateStudyLogRequest } from "@/types/request";
import { useMutation } from "@tanstack/react-query";

// 할 일 목록을 서버에 저장한다(PUT /api/study-logs/{studyLogId}/tasks).
export const useUpdateStudyLog = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: (tasks: UpdateStudyLogRequest["tasks"]) => {
      const studyLogId = useTimerStore.getState().studyLogId;
      if (!studyLogId) throw new Error("저장할 학습 로그가 없습니다.");
      return updateStudyLog(studyLogId, { tasks });
    },
    onError: (error) => {
      console.error("할 일 목록 저장 실패:", error);
    },
  });

  return { updateStudyLog: mutate, isPending };
};
