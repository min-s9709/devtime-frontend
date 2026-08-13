import type { GetTimerResponse, StartTimerResponse } from "@/types/response";
import {
  arrayToSplits,
  foldSegment,
  splitsToArray,
  sumSplits,
} from "@/utils/day-splits";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// 시계의 재생 상태. 세션 내용(goal·todos)은 useSessionStore가 따로 관리한다.
export type TimerStatus = "idle" | "running" | "paused";

interface TimerState {
  status: TimerStatus;
  // 세션 식별자. 타이머·학습기록(study-log) 엔드포인트 모두 이 하나로 통일한다.
  timerId: string | null;
  // 일자별 확정 누적 경과(ms). key는 로컬 날짜("YYYY-MM-DD").
  // 이미 끝난(=일시정지로 접힌) 구간들의 일자별 합이다. 진행 중 구간은 미포함.
  splits: Record<string, number>;
  // 현재 running 구간이 시작된 클라이언트 시각(Date.now(), ms). paused/idle이면 null.
  anchorMs: number | null;

  // GET /api/timers 결과로 미종료 타이머를 복구한다.
  // 브라우저가 닫혀 있던 오프라인 구간은 학습 시간이 아니므로 포함하지 않고,
  // paused로 랜딩해 사용자가 재개하게 한다.
  hydrateFromServer: (res: GetTimerResponse) => void;

  // 새 세션 시작(0부터). POST /api/timers 응답의 서버 신원(timerId)을 저장한다.
  start: (init: Pick<StartTimerResponse, "timerId">) => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;

  // 크래시·강제종료로 pagehide fold가 못 돈 흔적(재수화 시 status가 running).
  // 신뢰할 수 없는 진행 구간(anchorMs)을 버리고 paused로 정규화한다. splits(확정
  // 누적)는 보존하므로 마지막 확정 시점은 유지되고, 오프라인 구간만 폐기된다.
  discardStaleRun: () => void;

  // 화면 표시용 총 경과 시간(ms). tick으로 누적하지 않고 항상 시각차로 파생한다.
  getElapsedMs: () => number;

  // 서버로 보낼 일자별 splitTimes 배열. splits 복사본에 현재 진행 구간을 접어
  // 넣어 만든다(스토어는 변경하지 않음 → 폴링 반복에 멱등). pause·폴링·종료 공용.
  getSplitTimesSnapshot: () => { date: string; timeSpent: number }[];
}

const initialState = {
  status: "idle" as TimerStatus,
  timerId: null,
  splits: {} as Record<string, number>,
  anchorMs: null,
};

// 폴링이 없어도 새로고침으로 메모리가 날아가면 시계가 유지되도록 localStorage에
// 저장한다. SSR 하이드레이션 불일치를 피하려고 skipHydration을 켜고, 클라이언트
// 마운트 후 명시적으로 rehydrate한다(components/timer/timer-bootstrap.tsx).
export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      ...initialState,

      hydrateFromServer: (res) =>
        set({
          status: "paused",
          timerId: res.timerId,
          splits: arrayToSplits(res.splitTimes),
          anchorMs: null,
        }),

      start: ({ timerId }) =>
        set({
          status: "running",
          splits: {},
          anchorMs: Date.now(),
          timerId,
        }),

      pause: () =>
        set((state) => {
          if (state.status !== "running" || state.anchorMs === null)
            return state;
          // 진행 중이던 구간을 일자별로 잘라 splits에 커밋한다.
          const splits = { ...state.splits };
          foldSegment(splits, state.anchorMs, Date.now());
          return { status: "paused", splits, anchorMs: null };
        }),

      resume: () =>
        set((state) =>
          state.status === "paused"
            ? { status: "running", anchorMs: Date.now() }
            : state,
        ),

      reset: () => set(initialState),

      // running으로 재수화된 상태 전체를 정규화한다. anchorMs가 null인 비정상
      // 저장값도 함께 안전하게 paused로 복구된다.
      discardStaleRun: () =>
        set((state) =>
          state.status === "running"
            ? { status: "paused", anchorMs: null }
            : state,
        ),

      getElapsedMs: () => {
        const { splits, status, anchorMs } = get();
        return (
          sumSplits(splits) +
          (status === "running" && anchorMs ? Date.now() - anchorMs : 0)
        );
      },

      getSplitTimesSnapshot: () => {
        const { splits, status, anchorMs } = get();
        const buckets = { ...splits };
        if (status === "running" && anchorMs) {
          foldSegment(buckets, anchorMs, Date.now());
        }
        return splitsToArray(buckets);
      },
    }),
    {
      name: "devtime-timer",
      // v1: baseMs(총합) → splits(일자별)로 shape 변경
      // v2: studyLogId가 goalId → timerId(세션 id)로 의미 변경(백엔드).
      //     예전 persist에 남은 세션 신원(옛 goalId)을 신뢰할 수 없어 저장분을 폐기.
      version: 2,
      skipHydration: true,
      // 시계 상태만 저장한다(액션 제외).
      partialize: (s) => ({
        status: s.status,
        timerId: s.timerId,
        splits: s.splits,
        anchorMs: s.anchorMs,
      }),
      migrate: (persisted, version) => {
        // v2 미만: 옛 studyLogId/timerId(=goalId 시절)를 재사용하면 404가 나므로
        // persist 저장분을 통째로 버리고 초기 상태로 되돌린다. 미종료 타이머는
        // 접속 시 GET /api/timers → hydrateFromServer가 새 값으로 다시 복구한다.
        if (version < 2) return { ...initialState } as unknown as TimerState;

        return persisted as TimerState;
      },
    },
  ),
);
