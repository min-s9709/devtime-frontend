import Button from "@/components/common/button";
import { PATH } from "@/constants/path";
import Link from "next/link";
import { useFormContext } from "react-hook-form";

interface SignupFooterProps {
  isPending: boolean;
}

export default function SignupFooter({ isPending }: SignupFooterProps) {
  const {
    formState: { isValid },
    watch,
  } = useFormContext();

  const [email, emailChecked, nickname, nicknameChecked] = watch([
    "email",
    "emailChecked",
    "nickname",
    "nicknameChecked",
  ]);

  // 현재 입력값이 중복확인에 통과한 값과 일치할 때만 제출을 허용한다.
  const isDuplicateChecked =
    !!email &&
    email === emailChecked &&
    !!nickname &&
    nickname === nicknameChecked;

  return (
    <section>
      <Button
        type="submit"
        variant="Primary"
        value="회원가입"
        className="w-full"
        disabled={!isValid || !isDuplicateChecked || isPending}
      />
      <div className="flex justify-center gap-3 mt-6">
        <span className="text-body font-regular text-primary">
          회원이신가요?
        </span>
        <Link href={PATH.LOGIN} className="text-body font-bold text-primary">
          로그인 바로가기
        </Link>
      </div>
    </section>
  );
}
