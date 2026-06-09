import { ENDPOINTS } from "@/constants/endpoints";
import { useAuthStore } from "@/store/use-auth-store";
import { LoginRequest, SignupRequest } from "@/types/request";
import {
  CheckDuplicateResponse,
  LoginResponse,
  LogoutResponse,
  SignupResponse,
} from "@/types/response";
import ky from "ky";
import { httpClient } from "./api-client";

// 인증 BFF(Next.js Route Handler) 전용 same-origin 클라이언트.
// refreshToken HttpOnly 쿠키 송수신을 위해 credentials를 포함하고,
// logout 등에서 accessToken을 Authorization으로 실어 보낸다.
const authClient = ky.create({
  prefixUrl: "/api/auth",
  timeout: 10000,
  retry: 0,
  credentials: "include",
  hooks: {
    beforeRequest: [
      (request) => {
        const accessToken = useAuthStore.getState().accessToken;
        if (accessToken) {
          request.headers.set("Authorization", `Bearer ${accessToken}`);
        }
      },
    ],
  },
});

export async function refreshAccessToken(): Promise<string | null> {
  try {
    // refreshToken은 HttpOnly 쿠키에 있으므로 바디 없이 호출한다.
    const res = await authClient.post("refresh").json<{ accessToken: string }>();

    const { setAuth, ...state } = useAuthStore.getState();
    setAuth({ ...state, accessToken: res.accessToken });
    return res.accessToken;
  } catch {
    const { setAuth } = useAuthStore.getState();
    setAuth({ accessToken: "", isFirstLogin: false, isDuplicateLogin: false });
    return null;
  }
}

export const checkDuplicate = (type: string, args: string) =>
  httpClient.get<CheckDuplicateResponse>(
    `${ENDPOINTS.SIGNUP}/check-${type}?${type}=${args}`,
  );

export const signup = (data: SignupRequest) =>
  httpClient.post<SignupResponse>(ENDPOINTS.SIGNUP, data);

// 로그인/로그아웃은 BFF 라우트를 거쳐 refreshToken 쿠키를 관리한다.
export const login = (data: LoginRequest) =>
  authClient.post("login", { json: data }).json<LoginResponse>();

export const logout = () => authClient.post("logout").json<LogoutResponse>();
