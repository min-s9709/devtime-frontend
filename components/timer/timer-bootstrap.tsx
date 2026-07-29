"use client";

import { useActiveTimer } from "@/hooks/queries/use-active-timer";
import { useStudyLog } from "@/hooks/queries/use-study-log";
import { useTimerHeartbeat } from "@/hooks/use-timer-heartbeat";
import { useSessionStore } from "@/store/use-session-store";
import { useTimerStore } from "@/store/use-timer-store";
import { useEffect, useRef, useState } from "react";

// 타이머 페이지에 머무는 동안 상시 마운트되는(화면엔 안 보이는) 컴포넌트로,
// 두 가지 백그라운드 작업을 담당한다.
//
// 1) 미종료 타이머 복구 — 진입 시 아래 두 소스 중 하나로 시계·세션을 되살린다.
//    - localStorage(로컬): 새로고침 등으로 메모리가 날아가도 진행 중이던 시계를 유지.
//      서버는 폴링(10분)·일시정지·종료 시점에만 갱신돼 최대 10분 뒤처질 수 있으므로,
//      로컬 세션이 살아있으면 가장 최신인 로컬을 우선한다.
//    - 서버(GET /api/timers): 다른 기기/최초 로그인처럼 로컬에 세션이 없을 때만 사용.
//      있으면 studyLogId로 GET /api/study-logs/{id}까지 받아 세션 내용을 채운다.
//    둘 다 없으면 두 스토어 모두 초기(idle)로 남아 타이머 페이지는 초기 상태로 랜딩.
//
// 2) 폴링(heartbeat) — useTimerHeartbeat로 running 중 10분마다 서버에 경과를 동기화.
export default function TimerBootstrap() {
  // running 중 10분마다 서버로 경과를 동기화한다(status 기반 자동 시작/정지).
  useTimerHeartbeat();

  // 로컬에 활성 세션이 있었는지 여부. 반드시 localStorage 복원 "이후, 서버 복구 이전"
  // 시점의 스냅샷이어야 한다. store의 status에서 파생하면 hydrateFromServer가 status를
  // 바꾸는 순간 true로 뒤집혀, 뒤이어 받아야 할 study-log 조회가 스스로 막힌다.
  const hadLocalSession = useRef(false);

  // localStorage 복원(persist rehydrate) 완료 여부. 이 값이 true가 되기 전에는 서버
  // 하이드레이션을 절대 실행하지 않는다(아래 두 effect 게이트). 복원은 비동기(await)라
  // hadLocalSession 확정이 지연되는데, 서버 쿼리가 cache hit으로 먼저 성공하면
  // hadLocalSession이 미확정인 채 하이드레이션이 튀어 시계/세션이 서로 다른 소스에서
  // 채워질 수 있다(시계와 목표·할 일이 다른 세션에 연결). 이를 막기 위한 게이트.
  const [isRehydrated, setIsRehydrated] = useState(false);

  // skipHydration으로 꺼 둔 persist를 클라이언트 마운트 후 명시적으로 복원한다.
  // (SSR 하이드레이션 불일치 방지)
  useEffect(() => {
    const restore = async () => {
      // rehydrate()는 Promise를 반환한다. 지금은 localStorage(동기)라 즉시 반영되지만,
      // 비동기 스토리지로 바뀌어도 복원 완료 후에 보정·스냅샷·게이트 해제가 실행되도록 await한다.
      await Promise.all([
        useTimerStore.persist.rehydrate(),
        useSessionStore.persist.rehydrate(),
      ]);

      // 크래시로 running 그대로 복원된 경우 오프라인 구간을 버리고 paused로 정규화한다.
      // (서버 조회보다 앞서 로컬을 안전화한 뒤 hadLocalSession을 확정)
      useTimerStore.getState().discardStaleRun();
      hadLocalSession.current = useTimerStore.getState().status !== "idle";
      setIsRehydrated(true); // 복원 완료 → 이제부터 서버 하이드레이션 허용
    };

    void restore();
  }, []);

  const { timer } = useActiveTimer();
  const { studyLog } = useStudyLog(timer?.studyLogId);

  useEffect(() => {
    // 복원 완료(isRehydrated) 전에는 실행하지 않는다. cache hit으로 timer가 일찍 와도,
    // hadLocalSession이 확정된 뒤에야 판정해 시계/세션이 같은 소스로 일관되게 채워진다.
    if (isRehydrated && timer && !hadLocalSession.current) {
      useTimerStore.getState().hydrateFromServer(timer);
    }
  }, [isRehydrated, timer]);

  useEffect(() => {
    // 로컬 세션이 있었다면 goal·todos는 localStorage에서 복원되므로 서버 값으로 덮지 않는다.
    if (isRehydrated && studyLog && !hadLocalSession.current) {
      useSessionStore.getState().hydrateFromStudyLog(studyLog.data);
    }
  }, [isRehydrated, studyLog]);

  return null;
}
