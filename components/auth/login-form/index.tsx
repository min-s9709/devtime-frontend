"use client";

import MainLogo from "@/assets/icons/main-logo.svg";
import Button from "@/components/common/button";
import HelperText from "@/components/common/helper-text";
import InputField from "@/components/common/input-field";
import { useLogin } from "@/hooks/queries/use-login";
import { LoginFormData, loginSchema } from "@/schemas/login";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

export default function LoginForm() {
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

  const { login, isPending } = useLogin();

  const handleClickSubmit = (data: LoginFormData) => {
    login(data);
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
            className="w-full"
            disabled={!isValid || isPending}
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
