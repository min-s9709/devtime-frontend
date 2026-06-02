import { logout } from "@/apis/auth";
import { useAuthStore } from "@/store/use-auth-store";
import { useMutation } from "@tanstack/react-query";

export const useLogout = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  const { mutate } = useMutation({
    mutationFn: async () => {
      return await logout();
    },
    onSuccess: () => {
      setAuth({
        accessToken: "",
        refreshToken: "",
        isFirstLogin: false,
        isDuplicateLogin: false,
      });
    },
    onError: (error) => {
      console.error("Logout failed:", error);
    },
  });

  return { mutate };
};
