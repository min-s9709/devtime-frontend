"use client";

import Button from "@/components/common/button";
import ConfirmModal from "@/components/common/modal/confirm-modal";
import { PATH } from "@/constants/path";
import { useModalStore } from "@/store/use-modal-store";
import { useProfileStore } from "@/store/use-profile-store";
import { useRouter } from "next/navigation";
import { createElement } from "react";

interface ProfileFormFooterProps {
  disabled?: boolean;
}

export default function ProfileFormFooter({
  disabled,
}: ProfileFormFooterProps) {
  const router = useRouter();
  const open = useModalStore((state) => state.open);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);

  const handleSkip = () => {
    open(
      createElement(ConfirmModal, {
        title: "프로필 설정을 건너뛸까요?",
        description:
          "프로필을 설정하지 않을 경우 일부 기능 사용에 제한이 생길 수 있습니다. 그래도 프로필 설정을 건너뛰시겠습니까?",
        cancelText: "건너뛰기",
        confirmText: "계속 설정하기",
        // 프로필은 안 만들지만 닉네임 등으로 NavBar를 로그인 상태로 채운다.
        onCancel: async () => {
          await fetchProfile();
          router.replace(PATH.HOME);
        },
      }),
    );
  };

  return (
    <section>
      <Button
        type="submit"
        variant="Primary"
        value="저장하기"
        className="w-full"
        disabled={disabled}
      />
      <div className="flex justify-center gap-3 mt-6">
        <span className="text-body font-regular text-primary">
          다음에 하시겠어요?
        </span>
        <span
          onClick={handleSkip}
          className="text-body font-bold text-primary cursor-pointer"
        >
          건너뛰기
        </span>
      </div>
    </section>
  );
}
