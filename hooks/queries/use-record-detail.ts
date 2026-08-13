import { getStudyLog } from "@/apis/study-logs";
import { studyLogKeys } from "@/constants/query-keys";
import { useQuery } from "@tanstack/react-query";

// 학습 기록 상세(오늘의 목표·할 일 목록·회고). record-detail-modal에서 사용.
export const useRecordDetail = (studyLogId: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: studyLogKeys.detail(studyLogId),
    queryFn: () => getStudyLog(studyLogId),
    enabled: !!studyLogId,
    staleTime: 60 * 1000,
  });

  return { record: data?.data, isLoading, isError };
};
