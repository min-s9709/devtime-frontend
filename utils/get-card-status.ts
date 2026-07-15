import type { TodoCardStatus } from "@/components/timer/todo/todo-card";
import type { SessionPhase, Todo } from "@/store/use-session-store";

// 카드 상태는 저장하지 않고 (phase, todo)에서 파생한다.
export const getCardStatus = (
  phase: SessionPhase,
  todo: Todo,
  editingId: string | null,
): TodoCardStatus => {
  if (phase === "setup") {
    return todo.id === editingId ? "editing" : "adding";
  }
  // running · review: 사용자가 직접 체크 (done 토글)
  if (phase === "running" || phase === "review") {
    return todo.done ? "checked" : "checkable";
  }
  // record(읽기전용): result가 있으면 우선, 없으면 done으로 파생
  const failed = todo.result ? todo.result === "fail" : !todo.done;
  return failed ? "failed" : "completed";
};
