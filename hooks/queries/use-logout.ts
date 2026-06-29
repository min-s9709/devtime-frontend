import { logout } from "@/apis/auth";
import { useAuthStore } from "@/store/use-auth-store";
import { useProfileStore } from "@/store/use-profile-store";
import { useMutation } from "@tanstack/react-query";

export const useLogout = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearProfile = useProfileStore((state) => state.clearProfile);

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
    },
    onError: (error) => {
      console.error("Logout failed:", error);
    },
  });

  return { logout: mutate };
};
