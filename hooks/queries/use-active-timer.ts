import { getTimer } from "@/apis/timers";
import { timerKeys } from "@/constants/query-keys";
import { useAuthStore } from "@/store/use-auth-store";
import { useQuery } from "@tanstack/react-query";
import { HTTPError } from "ky";

// 미종료 타이머 조회. 진입 시 1회 복구용이라 이후 refetch는 끈다
// (로컬 시계 상태를 서버 응답으로 덮어쓰지 않도록).
export const useActiveTimer = () => {
  const accessToken = useAuthStore((s) => s.accessToken);

  const { data } = useQuery({
    queryKey: timerKeys.active,
    queryFn: getTimer,
    enabled: !!accessToken, // silent refresh로 토큰이 채워진 뒤에만 조회
    // "미종료 타이머 없음"(4xx)은 정상 상황이라 재시도하지 않고 idle로 랜딩한다.
    // 반면 일시적 네트워크/서버 오류(5xx·단절)는 재시도해 복구 신뢰성을 높인다.
    // (retry: false로 뭉뚱그리면 일시 실패가 영구 실패가 되어 세션을 놓친다)
    retry: (failureCount, error) => {
      if (error instanceof HTTPError && error.response.status < 500) {
        return false;
      }
      return failureCount < 3;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return { timer: data };
};
