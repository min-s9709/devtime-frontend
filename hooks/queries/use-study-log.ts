import { getStudyLog } from "@/apis/study-logs";
import { timerKeys } from "@/constants/query-keys";
import { useQuery } from "@tanstack/react-query";

// 미종료 타이머의 세션 내용(목표·할 일·회고) 조회. studyLogId가 있을 때만 조회한다.
export const useStudyLog = (studyLogId: string | undefined) => {
  const { data } = useQuery({
    queryKey: timerKeys.studyLog(studyLogId ?? ""),
    queryFn: () => getStudyLog(studyLogId!),
    enabled: !!studyLogId,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return { studyLog: data };
};
