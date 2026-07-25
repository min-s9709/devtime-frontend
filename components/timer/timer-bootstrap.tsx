"use client";

import { getStudyLog } from "@/apis/study-logs";
import { getTimer } from "@/apis/timers";
import { useTimerHeartbeat } from "@/hooks/use-timer-heartbeat";
import { useAuthStore } from "@/store/use-auth-store";
import { useSessionStore } from "@/store/use-session-store";
import { useTimerStore } from "@/store/use-timer-store";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

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
  const accessToken = useAuthStore((s) => s.accessToken);

  // running 중 10분마다 서버로 경과를 동기화한다(status 기반 자동 시작/정지).
  useTimerHeartbeat();

  // 로컬에 활성 세션이 있었는지 여부. 반드시 서버 복구 "이전" 시점의 스냅샷이어야 한다.
  // store의 status에서 파생하면 hydrateFromServer가 status를 바꾸는 순간 true로
  // 뒤집혀, 뒤이어 받아야 할 study-log 조회가 스스로 막힌다(목표·할 일 유실).
  const hadLocalSession = useRef(false);

  // skipHydration으로 꺼 둔 persist를 클라이언트 마운트 후 명시적으로 복구한다.
  // (SSR 하이드레이션 불일치 방지)
  useEffect(() => {
    useTimerStore.persist.rehydrate();
    useSessionStore.persist.rehydrate();
    // localStorage는 동기 스토리지라 rehydrate 직후 상태가 반영돼 있다.
    hadLocalSession.current = useTimerStore.getState().status !== "idle";
  }, []);

  const { data: timer } = useQuery({
    queryKey: ["timer"],
    queryFn: getTimer,
    enabled: !!accessToken, // silent refresh로 토큰이 채워진 뒤에만 조회
    retry: false,
    // 진입 시 1회만 복구하는 부트스트랩. 이후 refetch가 로컬 시계 상태
    // (start/pause 등)를 덮어쓰지 않도록 재요청을 끈다.
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const studyLogId = timer?.studyLogId;

  const { data: studyLog } = useQuery({
    queryKey: ["study-log", studyLogId],
    queryFn: () => getStudyLog(studyLogId!),
    enabled: !!studyLogId, // 미종료 타이머가 있을 때만 조회
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    if (timer && !hadLocalSession.current) {
      useTimerStore.getState().hydrateFromServer(timer);
    }
  }, [timer]);

  useEffect(() => {
    // 로컬 세션이 있었다면 goal·todos는 localStorage에서 복구되므로 서버 값으로 덮지 않는다.
    if (studyLog && !hadLocalSession.current) {
      useSessionStore.getState().hydrateFromStudyLog(studyLog.data);
    }
  }, [studyLog]);

  return null;
}
