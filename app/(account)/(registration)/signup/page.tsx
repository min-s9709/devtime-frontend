import SignupForm from "@/components/auth/signup-form";

import { PATH } from "@/constants/path";
import { createMetadata } from "@/utils/create-metadata";

export const metadata = createMetadata({
  title: "회원가입",
  description: "DevTime에 가입하고 개발자를 위한 학습 타이머를 시작하세요.",
  path: PATH.SIGNUP,
});

export default function Signup() {
  return (
    <div className="flex justify-center items-center w-full min-h-screen">
      <SignupForm />
    </div>
  );
}
