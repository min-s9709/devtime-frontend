import { updateProfile as updateProfileApi } from "@/apis/profile";
import AlertModal from "@/components/common/modal/alert-modal";
import { profileKeys } from "@/constants/query-keys";
import { useModalStore } from "@/store/use-modal-store";
import { useProfileStore } from "@/store/use-profile-store";
import { UpdateProfileRequest } from "@/types/request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HTTPError } from "ky";
import { createElement } from "react";

// PUT /api/profile. 성공 시 마이페이지 조회 캐시(react-query)와 NavBar용 store를
// 모두 갱신해 수정 내용이 즉시 반영되도록 한다.
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const fetchProfile = useProfileStore((state) => state.fetchProfile);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: UpdateProfileRequest) => updateProfileApi(data),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: profileKeys.detail }),
        fetchProfile(),
      ]);
    },
    onError: (error) => {
      if (error instanceof HTTPError) {
        useModalStore.getState().open(
          createElement(AlertModal, {
            title: "회원 정보 수정에 실패했습니다",
          }),
        );
      }
    },
  });

  return { updateProfile: mutateAsync, isPending };
};
