import { NextRequest, NextResponse } from "next/server";
import { BACKEND_API, REFRESH_COOKIE, refreshCookieOptions } from "../_lib";

// HttpOnly 쿠키의 refreshToken을 꺼내 백엔드 refresh(바디 기반 계약)로 중계하고,
// 새 accessToken만 브라우저에 반환한다.
export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get(REFRESH_COOKIE)?.value;
  if (!refreshToken) {
    return NextResponse.json(
      { success: false, message: "no refresh token" },
      { status: 401 },
    );
  }

  const upstream = await fetch(`${BACKEND_API}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
    cache: "no-store", // 인증 응답은 절대 캐시하지 않는다.
  });

  const data = await upstream.json();

  // 갱신 실패(만료/무효) 시 죽은 쿠키를 제거한다.
  if (!upstream.ok) {
    const res = NextResponse.json(data, { status: upstream.status });
    res.cookies.delete({ name: REFRESH_COOKIE, path: refreshCookieOptions.path });
    return res;
  }

  return NextResponse.json({ accessToken: data.accessToken });
}
