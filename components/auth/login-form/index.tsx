"use client";

import MainLogo from "@/assets/icons/main-logo.svg";
import Button from "@/components/common/button";
import HelperText from "@/components/common/helper-text";
import InputField from "@/components/common/input-field";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import z from "zod";

export default function LoginForm() {
  const loginSchema = z.object({
    email: z
      .string()
      .min(1, "이메일을 입력해 주세요.")
      .email("이메일 형식으로 작성해 주세요."),
    password: z
      .string()
      .min(1, "비밀번호를 입력해 주세요.")
      .min(8, "비밀번호는 8자 이상, 영문과 숫자 조합이어야 합니다.")
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d)/,
        "비밀번호는 8자 이상, 영문과 숫자 조합이어야 합니다.",
      ),
  });

  type LoginFormData = z.infer<typeof loginSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleClickSubmit = (data: LoginFormData) => {
    // TODO: 로그인 API 연동
  };

  return (
    <form onSubmit={handleSubmit(handleClickSubmit)}>
      <div className="w-125 h-147.5 flex flex-col gap-12 justify-center items-center bg-white/50 backdrop-blur-[50px] rounded-[10px] shadow-[0_40px_100px_40px_#0368FF0D]">
        <MainLogo width={132} height={100} />
        <div className="flex flex-col gap-9 w-82">
          <section>
            <InputField
              label="아이디"
              placeholder="이메일 주소를 입력해주세요."
              className={errors.email && "border border-negative"}
              {...register("email")}
            />
            {errors.email && (
              <HelperText
                status="error"
                message={errors.email.message!}
                className="mt-2"
              />
            )}
          </section>
          <section>
            <InputField
              label="비밀번호"
              type="password"
              placeholder="비밀번호를 입력해주세요."
              className={errors.password && "border border-negative"}
              {...register("password")}
            />
            {errors.password && (
              <HelperText
                status="error"
                message={errors.password.message!}
                className="mt-2"
              />
            )}
          </section>
        </div>
        <div className="w-82 flex flex-col gap-6">
          <Button
            value="로그인"
            variant="Primary"
            type="submit"
            disabled={!isValid}
          />
          <Link
            href="/signup"
            className="text-primary font-medium text-center text-body-sm"
          >
            회원가입
          </Link>
        </div>
      </div>
    </form>
  );
}
