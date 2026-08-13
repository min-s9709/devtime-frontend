import { getAllStudyLogs } from "@/apis/study-logs";
import { studyLogKeys } from "@/constants/query-keys";
import { useAuthStore } from "@/store/use-auth-store";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

// 타이머 기록이 있는 일자별 학습 기록 목록(페이지네이션).
export const useAllStudyLogs = (page: number, size = 10) => {
  const accessToken = useAuthStore((s) => s.accessToken);

  const { data, isLoading, isError, isPlaceholderData } = useQuery({
    queryKey: studyLogKeys.list(page),
    queryFn: () => getAllStudyLogs(page, size),
    enabled: !!accessToken, // silent refresh로 토큰이 채워진 뒤에만 조회
    // 페이지 이동 시 이전 페이지 데이터를 유지해 표가 깜빡이지 않게 한다.
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });

  return {
    studyLogs: data?.data.studyLogs,
    pagination: data?.data.pagination,
    isLoading,
    isError,
    isPlaceholderData,
  };
};
