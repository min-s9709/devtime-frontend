import { getStudyHeatmap } from "@/apis/heatmap";
import { statsKeys } from "@/constants/query-keys";
import { useAuthStore } from "@/store/use-auth-store";
import { useQuery } from "@tanstack/react-query";

// 대시보드 공부량 히트맵(일자별 공부 시간·색상 레벨) 조회.
export const useStudyHeatmap = () => {
  const accessToken = useAuthStore((s) => s.accessToken);

  const { data, isLoading, isError } = useQuery({
    queryKey: statsKeys.heatmap,
    queryFn: getStudyHeatmap,
    enabled: !!accessToken, // silent refresh로 토큰이 채워진 뒤에만 조회
    staleTime: 5 * 60 * 1000,
  });

  return { heatmap: data?.heatmap, isLoading, isError };
};
