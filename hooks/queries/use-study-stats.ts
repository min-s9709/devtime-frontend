import { getStudyStats } from "@/apis/stats";
import { statsKeys } from "@/constants/query-keys";
import { useAuthStore } from "@/store/use-auth-store";
import { useQuery } from "@tanstack/react-query";

// 대시보드 공부 통계(누적/평균/요일별) 조회.
export const useStudyStats = () => {
  const accessToken = useAuthStore((s) => s.accessToken);

  const { data, isLoading, isError } = useQuery({
    queryKey: statsKeys.study,
    queryFn: getStudyStats,
    enabled: !!accessToken, // silent refresh로 토큰이 채워진 뒤에만 조회
    staleTime: 5 * 60 * 1000,
  });

  return { stats: data, isLoading, isError };
};
