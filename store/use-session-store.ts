import type { GetStudyLogsResponse } from "@/types/response";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// 학습 세션의 국면. 같은 TodoList를 국면별로 다르게 파생시켜 보여준다.
export type SessionPhase = "setup" | "running" | "review" | "record";

export interface Todo {
  id: string;
  content: string;
  done: boolean; // running 중 체크 여부
  result?: "success" | "fail"; // 세션 종료 후 확정(없으면 done으로 파생)
}

interface SessionState {
  phase: SessionPhase;
  goal: string;
  todos: Todo[];
  reflection: string;
  editingId: string | null; // setup에서 편집 중인 항목

  setPhase: (phase: SessionPhase) => void;
  setGoal: (goal: string) => void;
  addTodo: (content: string) => void;
  editContent: (id: string, content: string) => void; // 편집 중 실시간 입력
  startEditing: (id: string) => void;
  stopEditing: () => void; // 편집 확인/취소
  deleteTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  setReflection: (reflection: string) => void;
  // 미종료 세션 복구: GET /api/study-logs/{studyLogId} 결과로 세션 내용을 채운다.
  hydrateFromStudyLog: (data: GetStudyLogsResponse["data"]) => void;
  reset: () => void;
}

const initialState = {
  phase: "setup" as SessionPhase,
  goal: "",
  todos: [] as Todo[],
  reflection: "",
  editingId: null as string | null,
};

// 세션 내용(목표·할 일·회고)도 새로고침에 살아남도록 저장한다. 시계(useTimerStore)와
// 짝을 이뤄, 로컬에 세션이 살아있으면 부트스트랩이 서버 값으로 덮어쓰지 않는다.
export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      ...initialState,

      setPhase: (phase) => set({ phase }),
  setGoal: (goal) => set({ goal }),

  addTodo: (content) =>
    set((state) => ({
      todos: [
        ...state.todos,
        { id: crypto.randomUUID(), content, done: false },
      ],
    })),

  editContent: (id, content) =>
    set((state) => ({
      todos: state.todos.map((t) => (t.id === id ? { ...t, content } : t)),
    })),

  startEditing: (id) => set({ editingId: id }),
  stopEditing: () => set({ editingId: null }),

  deleteTodo: (id) =>
    set((state) => ({ todos: state.todos.filter((t) => t.id !== id) })),

  toggleTodo: (id) =>
    set((state) => ({
      todos: state.todos.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t,
      ),
    })),

  setReflection: (reflection) => set({ reflection }),

  hydrateFromStudyLog: (data) =>
    set({
      phase: "running",
      goal: data.todayGoal,
      todos: data.tasks.map((t) => ({
        id: t.id,
        content: t.content,
        done: t.isCompleted,
      })),
      reflection: data.review ?? "",
    }),

      reset: () => set(initialState),
    }),
    {
      name: "devtime-session",
      skipHydration: true,
      // 편집 중 UI 상태(editingId)는 저장하지 않는다.
      partialize: (s) => ({
        phase: s.phase,
        goal: s.goal,
        todos: s.todos,
        reflection: s.reflection,
      }),
    },
  ),
);
