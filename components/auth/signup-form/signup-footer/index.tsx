import Button from "@/components/common/button";
import Link from "next/link";

export default function SignupFooter() {
  return (
    <section>
      <Button
        type="submit"
        variant="Primary"
        value="회원가입"
        className="w-full"
      />
      <div className="flex justify-center gap-3 mt-6">
        <span className="text-body font-regular text-primary">
          회원이신가요?
        </span>
        <Link href="/login" className="text-body font-bold text-primary">
          로그인 바로가기
        </Link>
      </div>
    </section>
  );
}
