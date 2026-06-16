import { login } from "@/apis/auth";
import AlertModal from "@/components/common/modal/alert-modal";
import { PATH } from "@/constants/path";
import { useAuthStore } from "@/store/use-auth-store";
import { useModalStore } from "@/store/use-modal-store";
import { LoginRequest } from "@/types/request";
import { useMutation } from "@tanstack/react-query";
import { HTTPError } from "ky";
import { useRouter } from "next/navigation";
import { createElement } from "react";

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const open = useModalStore((state) => state.open);

  const router = useRouter();
  const { mutate, isPending, isError } = useMutation({
    mutationFn: async (data: LoginRequest) => {
      return await login(data);
    },
    onSuccess: (res) => {
      const authData = {
        accessToken: res.accessToken,
        isFirstLogin: res.isFirstLogin,
        isDuplicateLogin: res.isDuplicateLogin,
      };

      const nextPath = res.isFirstLogin ? PATH.PROFILE : PATH.HOME;

      if (res.isDuplicateLogin) {
        open(
          createElement(AlertModal, {
            title: "중복 로그인이 불가능합니다.",
            description:
              "다른 기기에 중복 로그인 된 상태입니다. [확인] 버튼을 누르면 다른 기기에서 강제 로그아웃되며, \n진행중이던 타이머가 있으면 기록이 자동 삭제됩니다.",
            onConfirm: () => {
              setAuth(authData);
              router.push(PATH.HOME);
            },
          }),
        );
      } else {
        setAuth(authData);
        router.push(nextPath);
      }
    },
    onError: (error) => {
      if (error instanceof HTTPError && error.response.status === 400) {
        open(
          createElement(AlertModal, {
            title: "로그인 정보를 다시 확인해 주세요",
          }),
        );
      }
    },
  });

  return { login: mutate, isPending, isError };
};
