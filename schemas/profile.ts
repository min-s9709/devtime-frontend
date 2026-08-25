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
    // 프로필 이미지는 선택값이라 File(업로드함) 또는 null(미업로드) 모두 허용한다.
    // File 전역이 없는 환경(SSR)에서 instanceof가 던지지 않도록 typeof로 가드한다.
    profileImage: z.custom<File | null>(
      (file) =>
        file === null || (typeof File !== "undefined" && file instanceof File),
      { message: "올바른 이미지 파일이 아닙니다." },
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

// 마이페이지 회원정보 수정 폼. 초기 프로필 설정의 검증을 유지하되 회원 정보(닉네임
// 중복확인·비밀번호 변경) 필드를 추가한다. 닉네임 중복확인은 "바꿨을 때만" 요구해야
// 하므로, 기존 닉네임을 인자로 받아 스키마를 생성한다. (이메일은 변경 불가라 폼 제외)
export const createEditProfileSchema = (originalNickname: string) =>
  z
    .object({
      nickname: z.string().min(1, "닉네임을 입력해 주세요."),
      // 중복 확인에 통과(사용 가능)한 닉네임을 기록해 제출 게이트로 쓴다.
      nicknameChecked: z.string(),
      // 새 비밀번호는 선택값. 비우면 변경하지 않고, 입력 시 회원가입과 동일 규칙 적용.
      newPassword: z
        .string()
        .refine(
          (value) =>
            value === "" ||
            (value.length >= 8 && /^(?=.*[a-zA-Z])(?=.*\d)/.test(value)),
          "비밀번호는 8자 이상, 영문과 숫자 조합이어야 합니다.",
        ),
      confirmNewPassword: z.string(),
      // 백엔드에서 NOT NULL이라 프로필 필드 중 실제 필수는 career·purpose 둘뿐이다.
      career: z.string().min(1, "개발 경력을 선택해 주세요."),
      purpose: z.string().min(1, "공부 목적을 선택해 주세요."),
      customPurpose: z.string(),
      // 공부 목표·기술 스택은 선택값. (조회 화면도 빈 목표 placeholder를 지원)
      goal: z.string(),
      techStacks: z.array(z.object({ id: z.number(), name: z.string() })),
      profileImage: z.custom<File | null>(
        (file) =>
          file === null ||
          (typeof File !== "undefined" && file instanceof File),
        { message: "올바른 이미지 파일이 아닙니다." },
      ),
    })
    // 닉네임을 바꾸지 않았거나(본인 것), 바꿨다면 중복 확인에 통과해야 한다.
    .refine(
      (data) =>
        data.nickname === originalNickname ||
        data.nickname === data.nicknameChecked,
      { message: "닉네임 중복 확인을 해주세요.", path: ["nicknameChecked"] },
    )
    // 목적이 '기타'일 때만 직접 입력값을 필수로 요구한다.
    .refine(
      (data) =>
        data.purpose !== CUSTOM_PURPOSE || data.customPurpose.trim().length > 0,
      { message: "공부 목적을 입력해 주세요.", path: ["customPurpose"] },
    )
    // 새 비밀번호를 입력했다면 재입력값과 일치해야 한다.
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: "비밀번호가 일치하지 않습니다.",
      path: ["confirmNewPassword"],
    });

export type EditProfileFormData = z.infer<
  ReturnType<typeof createEditProfileSchema>
>;
