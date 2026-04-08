"use client";

import TermsAgreement from "@/components/auth/signup-form/terms-agreement";
import InputField from "@/components/common/input-field";
import { FormProvider, useForm } from "react-hook-form";
import DuplicatedCheckField from "./duplicated-check-field";
import SignupFooter from "./signup-footer";

export default function SignupForm() {
  //   const {
  //     register,
  //     handleSubmit,
  //     formState: { errors, isValid },
  //   } = useForm();

  const methods = useForm();

  const handleClickSubmit = (data: unknown) => {
    // TODO: 회원가입 API 연동
  };

  return (
    <FormProvider {...methods}>
      <form
        className="w-105 flex flex-col justify-center gap-9"
        onSubmit={methods.handleSubmit(handleClickSubmit)}
      >
        <span className="text-heading font-bold text-primary text-center">
          회원가입
        </span>
        <div className="flex flex-col gap-4">
          <DuplicatedCheckField
            type="email"
            id="auth-id"
            label="아이디"
            placeholder="이메일 주소 형식으로 입력해 주세요."
          />
          <DuplicatedCheckField
            type="nickname"
            id="auth-username"
            label="닉네임"
            placeholder="닉네임을 입력해 주세요."
          />
          <section>
            <InputField
              {...methods.register("password")}
              label="비밀번호"
              type="password"
              placeholder="비밀번호를 입력해 주세요."
            />
          </section>
          <section>
            <InputField
              {...methods.register("confirmPassword")}
              label="비밀번호 확인"
              type="password"
              placeholder="비밀번호를 다시 입력해 주세요."
            />
          </section>
          <TermsAgreement />
        </div>
        <div>
          <SignupFooter />
        </div>
      </form>
    </FormProvider>
  );
}
