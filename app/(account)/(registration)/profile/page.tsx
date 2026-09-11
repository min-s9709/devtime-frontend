import ProfileForm from "@/components/profile/profile-form";

import { PATH } from "@/constants/path";
import { createMetadata } from "@/utils/create-metadata";

// 가입 직후 거치는 중간 단계라 단독으로 노출될 이유가 없다.
export const metadata = createMetadata({
  title: "프로필 등록",
  description: "개발 경력과 기술 스택을 등록하고 DevTime을 시작하세요.",
  path: PATH.PROFILE,
  noIndex: true,
});

export default function Profile() {
  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <ProfileForm />
    </div>
  );
}