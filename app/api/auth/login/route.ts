import { BackendLoginResponse } from "@/types/response";
import { NextRequest, NextResponse } from "next/server";
import {
  BACKEND_API,
  REFRESH_COOKIE,
  REFRESH_TOKEN_MAX_AGE,
  refreshCookieOptions,
} from "../_lib";

// 브라우저 로그인 요청을 백엔드로 중계하고, 백엔드가 바디로 내려준 refreshToken을
// HttpOnly 쿠키로 옮긴 뒤 나머지(accessToken 등)만 브라우저에 반환한다.
export async function POST(req: NextRequest) {
  const body = await req.json();

  const upstream = await fetch(`${BACKEND_API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store", // 인증 응답은 절대 캐시하지 않는다.
  });

  const data = await upstream.json();

  // 실패 응답은 상태코드/바디를 그대로 전달해 클라이언트의 에러 처리를 유지한다.
  if (!upstream.ok) {
    return NextResponse.json(data, { status: upstream.status });
  }

  const { refreshToken, ...rest } = data as BackendLoginResponse;

  const res = NextResponse.json(rest);
  res.cookies.set(REFRESH_COOKIE, refreshToken, {
    ...refreshCookieOptions,
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
  return res;
}
