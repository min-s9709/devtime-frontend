"use client";

import { useProfileStore } from "@/store/use-profile-store";
import { useSessionStore } from "@/store/use-session-store";
import { useTimerStore } from "@/store/use-timer-store";

// 타이머 뷰 상단 제목 영역.
export default function TimerHeader() {
  const profile = useProfileStore((state) => state.profile);
  const status = useTimerStore((state) => state.status);
  const goal = useSessionStore((state) => state.goal);

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

  // 활성 타이머(복구/진행 중)가 있으면 설정된 오늘의 목표를 제목으로 보여준다.
  if (status !== "idle" && goal) {
    return <h1 className="text-7xl font-bold text-indigo">{goal}</h1>;
  }

  return (
    <h1 className="text-7xl font-bold text-primary-30">
      오늘도 열심히 달려봐요!
    </h1>
  );
}
