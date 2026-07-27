import { getTimer } from "@/apis/timers";
import { timerKeys } from "@/constants/query-keys";
import { useAuthStore } from "@/store/use-auth-store";
import { useQuery } from "@tanstack/react-query";

// 미종료 타이머 조회. 진입 시 1회 복구용이라 이후 refetch를 끈다
// (로컬 시계 상태를 서버 응답으로 덮어쓰지 않도록).
export const useActiveTimer = () => {
  const accessToken = useAuthStore((s) => s.accessToken);

  const { data } = useQuery({
    queryKey: timerKeys.active,
    queryFn: getTimer,
    enabled: !!accessToken, // silent refresh로 토큰이 채워진 뒤에만 조회
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return { timer: data };
};
