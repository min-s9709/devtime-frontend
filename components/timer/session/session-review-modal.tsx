"use client";

import Button from "@/components/common/button";
import TextAreaField from "@/components/common/textarea-field";
import TodoInput from "@/components/timer/todo/todo-input";
import TodoList from "@/components/timer/todo/todo-list";
import { useSessionStore } from "@/store/use-session-store";

// review 국면: 타이머 종료 후 결과 확인 + 한 줄 소감 작성
// TODO: 저장 푸터 + completeSession 뮤테이션 연동
export default function SessionReviewModal() {
  const todos = useSessionStore((s) => s.todos);
  const reflection = useSessionStore((s) => s.reflection);
  const setReflection = useSessionStore((s) => s.setReflection);
  const addTodo = useSessionStore((s) => s.addTodo);
  const toggleTodo = useSessionStore((s) => s.toggleTodo);

  return (
    <form
      className="w-160 flex flex-col gap-9 p-6"
      onSubmit={(e) => e.preventDefault()}
    >
      <section>
        <h2 className="text-title text-gray-700 font-bold">
          오늘도 수고하셨어요!
        </h2>
        <span className="text-gray-500 text-body">
          완료한 일을 체크하고, 오늘의 학습 회고를 작성해주세요.
        </span>
      </section>
      <TodoInput onAdd={addTodo} />
      <TodoList
        todos={todos}
        phase="review"
        onToggle={toggleTodo}
        className="h-80 overflow-y-auto"
      />
      <TextAreaField
        label="학습 회고"
        placeholder="오늘 학습한 내용을 회고해 보세요(15자 이상 작성 필수)"
        value={reflection}
        onChange={(e) => setReflection(e.target.value)}
      />
      {/* TODO: 저장 버튼 */}
      <section className="flex justify-end gap-4">
        <Button variant="Tertiary" value="취소" />
        <Button variant="Secondary" value="공부 완료하기" />
      </section>
    </form>
  );
}
