import { getProfile } from "@/apis/profile";
import { profileKeys } from "@/constants/query-keys";
import { useAuthStore } from "@/store/use-auth-store";
import { useQuery } from "@tanstack/react-query";

// 마이페이지 프로필(회원 정보 + 개인 프로필) 조회. GET /api/profile
export const useProfile = () => {
  const accessToken = useAuthStore((s) => s.accessToken);

  const { data, isPending, isError } = useQuery({
    queryKey: profileKeys.detail,
    queryFn: getProfile,
    enabled: !!accessToken, // silent refresh로 토큰이 채워진 뒤에만 조회
    staleTime: 5 * 60 * 1000,
  });

  // enabled:false(토큰 대기) 구간을 로딩으로 덮으려면 isLoading이 아니라 isPending을 노출한다.
  return { profile: data, isPending, isError };
};
