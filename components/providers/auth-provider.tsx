"use client";

import { refreshAccessToken } from "@/apis/auth";
import { useProfileStore } from "@/store/use-profile-store";
import { useEffect, useRef } from "react";

// 새로고침 시 메모리의 accessToken은 사라진다. 마운트 시 1회 silent refresh를 호출해
// HttpOnly refreshToken 쿠키가 유효하면 accessToken을 복구하고, 성공하면 프로필도
// 다시 채워 NavBar 등 인증 UI를 복원한다(없으면 무시).
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const bootstrapped = useRef(false);

  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;

    (async () => {
      const token = await refreshAccessToken();
      if (token) await useProfileStore.getState().fetchProfile();
    })();
  }, []);

  return <>{children}</>;
}
