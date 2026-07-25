import { logout } from "@/apis/auth";
import { useAuthStore } from "@/store/use-auth-store";
import { useProfileStore } from "@/store/use-profile-store";
import { useSessionStore } from "@/store/use-session-store";
import { useTimerStore } from "@/store/use-timer-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useLogout = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearProfile = useProfileStore((state) => state.clearProfile);
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async () => {
      return await logout();
    },
    onSettled: () => {
      // 서버 응답 성공/실패와 무관하게 로컬 세션은 항상 정리한다.
      setAuth({
        accessToken: "",
        isFirstLogin: false,
        isDuplicateLogin: false,
      });
      clearProfile();

      // 타이머/세션 상태와 localStorage 저장분까지 비워 다음 사용자에게
      // 이전 타이머가 복구되지 않도록 한다.
      useTimerStore.getState().reset();
      useSessionStore.getState().reset();
      useTimerStore.persist.clearStorage();
      useSessionStore.persist.clearStorage();

      // 쿼리 캐시도 비운다. timer/study-log는 staleTime이 Infinity라
      // 남겨두면 재로그인 시 이전 사용자의 캐시가 그대로 쓰인다.
      queryClient.clear();
    },
    onError: (error) => {
      console.error("Logout failed:", error);
    },
  });

  return { logout: mutate };
};
