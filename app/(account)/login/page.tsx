import LoginBgLogo from "@/assets/icons/login-bg-icon.svg";
import LoginForm from "@/components/auth/login-form";

import { PATH } from "@/constants/path";
import { createMetadata } from "@/utils/create-metadata";

export const metadata = createMetadata({
  title: "로그인",
  description: "DevTime에 로그인하고 학습 시간 기록을 이어가세요.",
  path: PATH.LOGIN,
});

export default function Login() {
  return (
    <div className="w-full relative min-h-screen flex items-center justify-center overflow-hidden">
      <LoginBgLogo
        width={872}
        height={530}
        aria-hidden
        className="absolute top-15 left-262 text-primary pointer-events-none"
      />
      <LoginForm />
    </div>
  );
}
