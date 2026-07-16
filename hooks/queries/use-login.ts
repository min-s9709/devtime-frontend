import { login } from "@/apis/auth";
import AlertModal from "@/components/common/modal/alert-modal";
import { PATH } from "@/constants/path";
import { useAuthStore } from "@/store/use-auth-store";
import { useModalStore } from "@/store/use-modal-store";
import { useProfileStore } from "@/store/use-profile-store";
import { LoginRequest } from "@/types/request";
import { useMutation } from "@tanstack/react-query";
import { HTTPError } from "ky";
import { useRouter } from "next/navigation";
import { createElement } from "react";

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);
  const open = useModalStore((state) => state.open);

  const router = useRouter();

  // 인증 정보를 store에 반영한 뒤(이후 요청 Authorization 헤더에 토큰이 실린다)
  // 프로필을 조회해 store에 보관하고 이동한다. 최초 로그인은 곧바로 프로필 설정
  // 화면으로 가고 거기서 다시 조회하므로, 여기서는 조회를 생략한다(중복 GET 방지).
  const completeLogin = async (
    authData: {
      accessToken: string;
      isFirstLogin: boolean;
      isDuplicateLogin: boolean;
    },
    nextPath: string,
  ) => {
    setAuth(authData);
    if (!authData.isFirstLogin) await fetchProfile();
    router.push(nextPath);
  };

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
              completeLogin(authData, PATH.HOME);
            },
          }),
        );
      } else {
        completeLogin(authData, nextPath);
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
