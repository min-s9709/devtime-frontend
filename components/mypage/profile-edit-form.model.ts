import { CUSTOM_PURPOSE, SELECT_PURPOSE_OPTIONS } from "@/constants";
import type { EditProfileFormData } from "@/schemas/profile";
import type { UpdateProfileRequest } from "@/types/request";
import type { Profile } from "@/types/response";

// 저장된 목적이 표준 옵션에 없으면 = 사용자가 '기타(직접 입력)'로 쓴 값이다.
export const isCustomPurpose = (purpose: string | undefined): boolean =>
  !!purpose && !SELECT_PURPOSE_OPTIONS.includes(purpose);

// 기술 스택 목록이 순서와 무관하게 동일한지 비교한다. (변경됐을 때만 전송하기 위함)
export const isSameStacks = (a: string[], b: string[]): boolean => {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((name, index) => name === sortedB[index]);
};

// 서버 Profile → 폼 초기값(prefill).
// - 목적이 커스텀이면 드롭다운은 '기타'로 되돌리고 입력칸을 실제 텍스트로 채운다.
// - techStacks는 이름 배열이라 화면용으로 음수 id를 임시 부여한다(서버 양수 id와 미충돌).
export const toEditDefaultValues = (profile: Profile): EditProfileFormData => {
  const detail = profile.profile;
  const custom = isCustomPurpose(detail?.purpose);

  return {
    nickname: profile.nickname,
    nicknameChecked: "",
    newPassword: "",
    confirmNewPassword: "",
    career: detail?.career ?? "",
    purpose: detail ? (custom ? CUSTOM_PURPOSE : detail.purpose) : "",
    customPurpose: custom ? (detail?.purpose ?? "") : "",
    goal: detail?.goal ?? "",
    techStacks: (detail?.techStacks ?? []).map((name, index) => ({
      id: -(index + 1),
      name,
    })),
    profileImage: null,
  };
};

// 폼 값 + 원본(profile)을 비교해 PUT에 보낼 payload를 만든다. (부분 업데이트: 바뀐 필드만)
// 프로필 이미지는 비동기 업로드라 여기서 다루지 않고 컴포넌트에서 별도로 채운다.
export const buildProfilePayload = (
  data: EditProfileFormData,
  profile: Profile,
): UpdateProfileRequest => {
  const detail = profile.profile;
  // 프로필 row가 없는(건너뛴) 사용자면 PUT이 업서트로 동작한다. career·purpose는
  // NOT NULL이라 생성에 반드시 필요하므로 변경 여부와 무관하게 포함한다.
  const isNewProfile = !detail;
  const payload: UpdateProfileRequest = {};

  // 닉네임: 실제로 바뀐 경우에만. (그대로 보내면 중복 검사에 걸려 400)
  if (data.nickname !== profile.nickname) {
    payload.nickname = data.nickname;
  }

  // 비밀번호: 새로 입력했을 때만.
  if (data.newPassword) {
    payload.password = data.newPassword;
  }

  // 개발 경력
  if (isNewProfile || data.career !== (detail?.career ?? "")) {
    payload.career = data.career;
  }

  // 공부 목적: '기타'는 { type, detail } 객체로, 그 외엔 문자열로 보낸다.
  const nextPurpose =
    data.purpose === CUSTOM_PURPOSE ? data.customPurpose : data.purpose;
  if (isNewProfile || nextPurpose !== (detail?.purpose ?? "")) {
    payload.purpose =
      data.purpose === CUSTOM_PURPOSE
        ? { type: "기타", detail: data.customPurpose }
        : data.purpose;
  }

  // 공부 목표
  if (data.goal !== (detail?.goal ?? "")) {
    payload.goal = data.goal;
  }

  // 기술 스택: 목록(순서 무관)이 달라졌으면 최종 목록 전체를 보낸다.
  const nextStacks = data.techStacks.map((item) => item.name);
  if (!isSameStacks(nextStacks, detail?.techStacks ?? [])) {
    payload.techStacks = nextStacks;
  }

  return payload;
};
