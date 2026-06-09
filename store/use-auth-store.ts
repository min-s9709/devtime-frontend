import { create } from "zustand";

interface AuthState {
  accessToken: string;
  isFirstLogin: boolean;
  isDuplicateLogin: boolean;
  setAuth: (auth: Omit<AuthState, "setAuth">) => void;
}

// refreshToken은 Next.js BFF가 HttpOnly 쿠키로 관리한다.
// 클라이언트는 accessToken만 메모리에 보관한다.
export const useAuthStore = create<AuthState>((set) => ({
  accessToken: "",
  isFirstLogin: false,
  isDuplicateLogin: false,
  setAuth: (auth) => set(auth),
}));
