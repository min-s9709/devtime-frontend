"use client";

import TodoList from "@/components/timer/todo/todo-list";
import type { Todo } from "@/store/use-session-store";

// record 국면: 대시보드에서 과거 학습 기록 열람 (읽기 전용)
// 라이브 세션 store가 아니라 서버 데이터를 받는다.
// TODO: useSessionRecord(id) 쿼리로 goal/todos/reflection 주입, 닫기 푸터
interface RecordDetailModalProps {
  goal: string;
  todos: Todo[];
  reflection: string;
}

export default function RecordDetailModal({
  goal,
  todos,
  reflection,
}: RecordDetailModalProps) {
  return (
    <div className="w-160 flex flex-col gap-9">
      <h2 className="text-heading font-bold text-gray-800">{goal}</h2>
      <TodoList
        todos={todos}
        phase="record"
        className="h-110 overflow-y-auto"
      />
      {reflection && (
        <p className="text-body text-gray-600 whitespace-pre-line">
          {reflection}
        </p>
      )}
      {/* TODO: 닫기 버튼 */}
    </div>
  );
}
