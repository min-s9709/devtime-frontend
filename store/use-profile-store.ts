import { getProfile } from "@/apis/profile";
import type { Profile } from "@/types/response";
import { create } from "zustand";

interface ProfileState {
  profile: Profile | null;
  // 프로필을 조회해 store에 채운다. 인증이 유효해지는 모든 경로(로그인·생성·
  // 건너뛰기·새로고침 복구)에서 이 액션 하나만 호출하면 된다.
  fetchProfile: () => Promise<void>;
  clearProfile: () => void;
}

// 로그인 성공 시 조회한 프로필을 메모리에 보관한다. (로그아웃 시 정리)
export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  fetchProfile: async () => {
    try {
      set({ profile: await getProfile() });
    } catch {
      // 조회 실패(비로그인 등)는 무시한다.
    }
  },
  clearProfile: () => set({ profile: null }),
}));
