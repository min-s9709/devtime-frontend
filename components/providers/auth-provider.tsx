"use client";

import { refreshAccessToken } from "@/apis/auth";
import { useEffect, useRef } from "react";

// 새로고침 시 메모리의 accessToken은 사라진다. 마운트 시 1회 silent refresh를 호출해
// HttpOnly refreshToken 쿠키가 유효하면 accessToken을 복구한다(없으면 무시).
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const bootstrapped = useRef(false);

  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;
    refreshAccessToken();
  }, []);

  return <>{children}</>;
}
