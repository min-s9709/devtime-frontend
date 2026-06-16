import { CUSTOM_PURPOSE } from "@/constants";
import z from "zod";

export const profileSchema = z
  .object({
    career: z.string().min(1, "개발 경력을 선택해 주세요."),
    purpose: z.string().min(1, "공부 목적을 선택해 주세요."),
    customPurpose: z.string(),
    goal: z.string().min(1, "공부 목표를 입력해 주세요."),
    techStacks: z
      .array(z.object({ id: z.number(), name: z.string() }))
      .min(1, "기술 스택을 1개 이상 등록해 주세요."),
    // File 전역이 없는 환경(SSR)에서 instanceof가 던지지 않도록 typeof로 가드한다.
    profileImage: z.custom<File | null>(
      (file) => typeof File !== "undefined" && file instanceof File,
      { message: "프로필 이미지를 업로드해 주세요." },
    ),
  })
  // 목적이 '기타'일 때만 직접 입력값을 필수로 요구한다.
  .refine(
    (data) =>
      data.purpose !== CUSTOM_PURPOSE || data.customPurpose.trim().length > 0,
    {
      message: "공부 목적을 입력해 주세요.",
      path: ["customPurpose"],
    },
  );

export type ProfileFormData = z.infer<typeof profileSchema>;
