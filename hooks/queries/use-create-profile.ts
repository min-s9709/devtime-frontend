import { createProfile } from "@/apis/profile";
import AlertModal from "@/components/common/modal/alert-modal";
import { PATH } from "@/constants/path";
import { useModalStore } from "@/store/use-modal-store";
import { CreateProfileRequest } from "@/types/request";
import { useMutation } from "@tanstack/react-query";
import { HTTPError } from "ky";
import { useRouter } from "next/navigation";
import { createElement } from "react";

export const useCreateProfile = () => {
  const router = useRouter();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: CreateProfileRequest) => {
      return await createProfile(data);
    },
    onSuccess: () => {
      router.replace(PATH.HOME);
    },
    onError: (error) => {
      if (error instanceof HTTPError && error.response.status === 400) {
        useModalStore
          .getState()
          .open(
            createElement(AlertModal, { title: "프로필 설정에 실패했습니다" }),
          );
      }
    },
  });

  return { createProfile: mutateAsync, isPending };
};
