import { NextRequest, NextResponse } from "next/server";
import { BACKEND_API, REFRESH_COOKIE, refreshCookieOptions } from "../_lib";

// 백엔드 로그아웃을 best-effort로 호출하고, 어떤 경우에도 HttpOnly 쿠키를 제거한다.
export async function POST(req: NextRequest) {
  const authorization = req.headers.get("authorization");

  await fetch(`${BACKEND_API}/auth/logout`, {
    method: "POST",
    headers: authorization ? { authorization } : undefined,
    cache: "no-store", // 인증 응답은 절대 캐시하지 않는다.
  }).catch(() => {});

  const res = NextResponse.json({ success: true });
  res.cookies.delete({ name: REFRESH_COOKIE, path: refreshCookieOptions.path });
  return res;
}
