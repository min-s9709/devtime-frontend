"use client";

import { useProfileStore } from "@/store/use-profile-store";

// 타이머 뷰 상단 제목 영역.
// TODO: 세션 진행 중이면 설정한 학습 목표(useSessionStore.goal)를 표시
export default function TimerHeader() {
  const profile = useProfileStore((state) => state.profile);

  if (!profile) {
    return (
      <div>
        <h1 className="text-7xl font-bold tracking-tight text-indigo">
          WELCOME
        </h1>
        <p className="mt-6 text-center text-body-sm text-gray-500">
          DevTime을 사용하려면 로그인이 필요합니다.
        </p>
      </div>
    );
  }

  return (
    <h1 className="text-7xl font-bold text-primary-30">
      오늘도 열심히 달려봐요!
    </h1>
  );
}
