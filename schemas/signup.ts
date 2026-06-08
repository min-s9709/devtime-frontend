import z from "zod";

export const signupSchema = z
  .object({
    email: z
      .string()
      .min(1, "이메일을 입력해 주세요.")
      .email("이메일 형식으로 작성해 주세요."),
    emailChecked: z.string(),
    nickname: z.string().min(1, "닉네임을 입력해 주세요."),
    nicknameChecked: z.string(),
    password: z
      .string()
      .min(1, "비밀번호를 입력해 주세요.")
      .min(8, "비밀번호는 8자 이상, 영문과 숫자 조합이어야 합니다.")
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d)/,
        "비밀번호는 8자 이상, 영문과 숫자 조합이어야 합니다.",
      ),
    confirmPassword: z.string().min(1, "비밀번호가 일치하지 않습니다."),
    termsAgreed: z.boolean().refine((val) => val === true),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

export type SignupFormData = z.infer<typeof signupSchema>;