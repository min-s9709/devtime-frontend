"use client";

import { startTimer } from "@/apis/timers";
import Button from "@/components/common/button";
import InputField from "@/components/common/input-field";
import TodoInput from "@/components/timer/todo/todo-input";
import TodoList from "@/components/timer/todo/todo-list";
import { useModalStore } from "@/store/use-modal-store";
import { useSessionStore } from "@/store/use-session-store";
import { useTimerStore } from "@/store/use-timer-store";
import { useMutation } from "@tanstack/react-query";

// setup 국면: 목표 설정 + 할 일 생성/편집/삭제
export default function GoalSetupModal() {
  const goal = useSessionStore((s) => s.goal);
  const todos = useSessionStore((s) => s.todos);
  const editingId = useSessionStore((s) => s.editingId);
  const setGoal = useSessionStore((s) => s.setGoal);
  const addTodo = useSessionStore((s) => s.addTodo);
  const startEditing = useSessionStore((s) => s.startEditing);
  const editContent = useSessionStore((s) => s.editContent);
  const stopEditing = useSessionStore((s) => s.stopEditing);
  const deleteTodo = useSessionStore((s) => s.deleteTodo);
  const setPhase = useSessionStore((s) => s.setPhase);
  const startTimerClock = useTimerStore((s) => s.start);
  const close = useModalStore((s) => s.close);

  // POST /api/timers 성공 시에만 로컬 시계를 running으로 전환한다.
  // 응답의 timerId/studyLogId를 시계에 주입해 서버 신원을 가진 세션으로 시작한다.
  const { mutate: startSession, isPending } = useMutation({
    mutationFn: () =>
      startTimer({ todayGoal: goal, tasks: todos.map((t) => t.content) }),
    onSuccess: ({ timerId, studyLogId }) => {
      startTimerClock({ timerId, studyLogId });
      setPhase("running");
      close();
    },
  });

  return (
    <form
      className="w-160 flex flex-col gap-9 p-4"
      onSubmit={(e) => e.preventDefault()}
    >
      <InputField
        placeholder="오늘의 목표를 입력해주세요"
        className="text-heading font-bold bg-white  focus:text-indigo"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        maxLength={30}
      />
      <TodoInput
        label="할 일 목록"
        placeholder="할 일을 추가해 주세요"
        onAdd={addTodo}
      />
      <TodoList
        todos={todos}
        phase="setup"
        editingId={editingId}
        onEdit={startEditing}
        onEditChange={editContent}
        onEditConfirm={stopEditing}
        onDelete={deleteTodo}
        className="h-110 overflow-y-auto"
      />
      <section className="flex justify-end gap-4">
        <Button variant="Tertiary" value="취소" onClick={close} />
        <Button
          variant="Secondary"
          value="타이머 시작하기"
          onClick={() => startSession()}
          // 목표 입력 + 할 일 최소 1개가 있어야 시작할 수 있다.
          disabled={!goal.trim() || todos.length === 0 || isPending}
        />
      </section>
    </form>
  );
}
