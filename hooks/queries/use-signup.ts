import { signup } from "@/apis/auth";
import AlertModal from "@/components/common/modal/alert-modal";
import { PATH } from "@/constants/path";
import { useModalStore } from "@/store/use-modal-store";
import { SignupRequest } from "@/types/request";
import { useMutation } from "@tanstack/react-query";
import { HTTPError } from "ky";
import { useRouter } from "next/navigation";
import { createElement } from "react";

export const useSignup = () => {
  const router = useRouter();
  const { mutate } = useMutation({
    mutationFn: async (data: SignupRequest) => {
      return await signup(data);
    },
    onSuccess: () => {
      router.replace(PATH.LOGIN);
    },
    onError: (error) => {
      if (error instanceof HTTPError && error.response.status === 400) {
        useModalStore
          .getState()
          .open(
            createElement(AlertModal, { title: "회원가입에 실패했습니다" }),
          );
      }
    },
  });

  return { mutate };
};
