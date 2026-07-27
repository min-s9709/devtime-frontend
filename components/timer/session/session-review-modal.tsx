"use client";

import Button from "@/components/common/button";
import HelperText from "@/components/common/helper-text";
import TextAreaField from "@/components/common/textarea-field";
import TodoInput from "@/components/timer/todo/todo-input";
import TodoList from "@/components/timer/todo/todo-list";
import { useStopTimer } from "@/hooks/queries/use-stop-timer";
import { useModalStore } from "@/store/use-modal-store";
import { useSessionStore } from "@/store/use-session-store";
import { useTimerStore } from "@/store/use-timer-store";
import type { StopTimerRequest } from "@/types/request";

const MIN_REVIEW_LENGTH = 15; // 학습 회고 최소 글자 수
const MAX_REVIEW_LENGTH = 500; // 학습 회고 최대 글자 수

// review 국면: 타이머 종료 후 결과 확인 + 한 줄 소감 작성 → stopTimer로 세션 확정
export default function SessionReviewModal() {
  const todos = useSessionStore((s) => s.todos);
  const reflection = useSessionStore((s) => s.reflection);
  const setReflection = useSessionStore((s) => s.setReflection);
  const addTodo = useSessionStore((s) => s.addTodo);
  const toggleTodo = useSessionStore((s) => s.toggleTodo);
  const setPhase = useSessionStore((s) => s.setPhase);

  const timerId = useTimerStore((s) => s.timerId);
  const close = useModalStore((s) => s.close);
  const { stopTimer, isPending } = useStopTimer();

  // 세션 정리·캐시 제거는 훅이 담당하고, 모달 닫기만 호출부에서 처리한다.
  const handleFinish = () => {
    const payload: StopTimerRequest = {
      // 종료 직전 pause()로 진행 구간이 커밋된 일자별 경과를 그대로 보낸다.
      splitTimes: useTimerStore.getState().getSplitTimesSnapshot(),
      review: reflection.trim(),
      tasks: todos.map((t) => ({ content: t.content, isCompleted: t.done })),
    };
    stopTimer(payload, { onSuccess: close });
  };

  // 종료를 취소하면 진행 중이던(일시정지된) 세션으로 돌아간다.
  const handleCancel = () => {
    setPhase("running");
    close();
  };

  const isReviewValid = reflection.trim().length >= MIN_REVIEW_LENGTH;

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
      <div className="flex flex-col gap-2">
        <TextAreaField
          label="학습 회고"
          placeholder="오늘 학습한 내용을 회고해 보세요(15자 이상 작성 필수)"
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          maxLength={MAX_REVIEW_LENGTH}
        />
        <div className="flex items-center">
          {/* 최소 글자 미달일 때만 안내. 충족되면 사라진다. */}
          {!isReviewValid && (
            <HelperText
              status="error"
              message={`최소 ${MIN_REVIEW_LENGTH}자 이상 작성해주세요`}
            />
          )}
          {/* 현재/최대 글자 수. 상한(500)에 도달하면 강조. ml-auto로 항상 우측. */}
          <HelperText
            status={
              reflection.length >= MAX_REVIEW_LENGTH ? "error" : "neutral"
            }
            message={`${reflection.length}/${MAX_REVIEW_LENGTH}`}
            className="ml-auto"
          />
        </div>
      </div>
      <section className="flex justify-end gap-4">
        <Button variant="Tertiary" value="취소" onClick={handleCancel} />
        <Button
          variant="Secondary"
          value="공부 완료하기"
          onClick={handleFinish}
          disabled={!isReviewValid || !timerId || isPending}
        />
      </section>
    </form>
  );
}
