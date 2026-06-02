import z from "zod";

export const loginSchema = z.object({
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

export type LoginFormData = z.infer<typeof loginSchema>;