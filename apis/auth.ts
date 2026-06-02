import { ENDPOINTS } from "@/constants/endpoints";
import { useAuthStore } from "@/store/use-auth-store";
import { LoginRequest, SignupRequest } from "@/types/request";
import {
  CheckDuplicateResponse,
  LoginResponse,
  LogoutResponse,
  RefreshTokenResponse,
  SignupResponse,
} from "@/types/response";
import ky from "ky";
import { API_BASE_URL, httpClient } from "./api-client";

export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = useAuthStore.getState().refreshToken;
  if (!refreshToken) return null;

  try {
    const res = await ky
      .post(API_BASE_URL + ENDPOINTS.REFRESH, {
        json: { refreshToken },
      })
      .json<RefreshTokenResponse>();

    const newAccessToken = res.accessToken;
    useAuthStore.getState().setAuth({
      ...useAuthStore.getState(),
      accessToken: newAccessToken,
    });
    return newAccessToken;
  } catch {
    useAuthStore.getState().setAuth({
      accessToken: "",
      refreshToken: "",
      isFirstLogin: false,
      isDuplicateLogin: false,
    });
    return null;
  }
}

export const checkDuplicate = (type: string, args: string) =>
  httpClient.get<CheckDuplicateResponse>(
    `${ENDPOINTS.SIGNUP}/check-${type}?${type}=${args}`,
  );

export const signup = (data: SignupRequest) =>
  httpClient.post<SignupResponse>(ENDPOINTS.SIGNUP, data);

export const login = (data: LoginRequest) =>
  httpClient.post<LoginResponse>(ENDPOINTS.LOGIN, data);

export const logout = () => httpClient.post<LogoutResponse>(ENDPOINTS.LOGOUT);
