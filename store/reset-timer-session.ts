import { useSessionStore } from "./use-session-store";
import { useTimerStore } from "./use-timer-store";

// 타이머 세션의 로컬 상태(시계 + 세션 내용)와 localStorage 저장분을 일괄 초기화한다.
// 종료(stop)·초기화(delete)·로그아웃에서 공통으로 쓴다.
// (react-query 캐시 정리는 QueryClient가 필요하므로 호출부에서 별도 처리)
export const resetTimerSession = () => {
  useTimerStore.getState().reset();
  useSessionStore.getState().reset();
  useTimerStore.persist.clearStorage();
  useSessionStore.persist.clearStorage();
};
