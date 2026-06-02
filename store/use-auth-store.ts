import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  accessToken: string;
  refreshToken: string;
  isFirstLogin: boolean;
  isDuplicateLogin: boolean;
  setAuth: (auth: Omit<AuthState, "setAuth">) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: "",
      refreshToken: "",
      isFirstLogin: false,
      isDuplicateLogin: false,
      setAuth: (auth) => set(auth),
    }),
    {
      name: "auth-storage",
    },
  ),
);