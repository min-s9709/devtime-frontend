// 인증 BFF Route Handler 공용 설정 (서버 전용).
// 파일명이 route.ts가 아니므로 라우트로 취급되지 않는다.

const rawBase = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!rawBase) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

// 실제 백엔드 API 베이스 (apis/api-client.ts의 API_BASE_URL과 동일 규칙).
export const BACKEND_API = `${rawBase.replace(/\/+$/, "")}/api`;

export const REFRESH_COOKIE = "refreshToken";

// 백엔드 refreshToken TTL(10일)과 동일하게 맞춘다.
export const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 10;

// refresh/logout 라우트에서만 쿠키가 전송되도록 path를 좁힌다.
export const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/api/auth",
};
