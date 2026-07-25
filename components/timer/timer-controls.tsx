"use client";

import { deleteTimer, updateTimer } from "@/apis/timers";
import FinishIcon from "@/assets/icons/finish.svg";
import PauseIcon from "@/assets/icons/pause.svg";
import ResetIcon from "@/assets/icons/reset.svg";
import StartIcon from "@/assets/icons/start.svg";
import TodoIcon from "@/assets/icons/todo.svg";
import ConfirmModal from "@/components/common/modal/confirm-modal";
import ControlButton from "@/components/timer/control-button";
import GoalSetupModal from "@/components/timer/session/goal-setup-modal";
import SessionReviewModal from "@/components/timer/session/session-review-modal";
import TodoChecklistModal from "@/components/timer/session/todo-checklist-modal";
import { useModalStore } from "@/store/use-modal-store";
import { useSessionStore } from "@/store/use-session-store";
import { useTimerStore } from "@/store/use-timer-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function TimerControls() {
  const open = useModalStore((state) => state.open);

  const setPhase = useSessionStore((state) => state.setPhase);
  const resetSession = useSessionStore((state) => state.reset);

  const status = useTimerStore((state) => state.status);
  const timerId = useTimerStore((state) => state.timerId);
  const pause = useTimerStore((state) => state.pause);
  const resume = useTimerStore((state) => state.resume);
  const resetTimer = useTimerStore((state) => state.reset);

  const queryClient = useQueryClient();

  // 일시정지 시 현재까지의 일자별 경과를 서버에 동기화한다(PUT /api/timers/{timerId}).
  const { mutate: syncSplitsToServer } = useMutation({
    mutationFn: (id: string) =>
      updateTimer(id, {
        splitTimes: useTimerStore.getState().getSplitTimesSnapshot(),
      }),
    onError: (error) => {
      // 동기화 실패해도 로컬 일시정지는 유지된다(다음 일시정지/종료 때 재반영).
      console.error("타이머 동기화 실패:", error);
    },
  });

  // 타이머 초기화: 서버의 타이머를 삭제한다(DELETE /api/timers/{timerId}).
  const { mutate: removeTimer, isPending: isResetting } = useMutation({
    mutationFn: (id: string) => deleteTimer(id),
    // 서버에서 지워진 뒤에만 로컬을 비운다. 먼저 비우면 삭제 실패 시
    // 서버에는 타이머가 남아 다음 진입에서 되살아난다.
    onSuccess: () => {
      resetTimer();
      resetSession();
      useTimerStore.persist.clearStorage();
      useSessionStore.persist.clearStorage();
      // 삭제된 타이머가 부트스트랩에서 다시 복구되지 않도록 캐시 제거.
      queryClient.removeQueries({ queryKey: ["timer"] });
    },
    onError: (error) => {
      console.error("타이머 초기화 실패:", error);
    },
  });

  // idle: 새 세션 시작(모달) / paused: 복구·일시정지된 세션 재개
  const handleStartClick = () => {
    if (status === "paused") {
      resume();
      return;
    }
    open(<GoalSetupModal />);
  };

  const handlePauseClick = () => {
    pause();
    // pause()가 진행 구간을 splits에 커밋한 직후의 일자별 경과를 서버에 반영한다.
    if (timerId) syncSplitsToServer(timerId);
  };

  const handleFinishClick = () => {
    pause(); // 종료 확정 전까지 시계를 멈춘다
    setPhase("review");
    open(<SessionReviewModal />);
  };

  // 초기화 확인 모달을 띄우고, "초기화하기"를 눌렀을 때만 삭제 API를 호출한다.
  const handleResetClick = () => {
    if (!timerId) return;
    open(
      <ConfirmModal
        title="기록을 초기화 하시겠습니까?"
        description={
          "진행되던 타이머 기록은 삭제되고, 복구가 불가능합니다. 계속 초기화 할까요?"
        }
        confirmText="초기화하기"
        cancelText="취소"
        onConfirm={() => removeTimer(timerId)}
      />,
    );
  };

  const handleTodoClick = () => {
    setPhase("running");
    open(<TodoChecklistModal />);
  };

  // 상태별 활성 여부. 색상(text-primary/text-primary-10)과 disabled에 함께 쓴다.
  const startDisabled = status === "running";
  const pauseDisabled = status !== "running";
  const finishDisabled = status === "idle";
  const colorOf = (disabled: boolean) =>
    disabled ? "text-primary-10" : "text-primary";

  return (
    <div className="relative flex w-full items-center justify-center">
      {/* 메인 컨트롤 */}
      <div className="flex items-center gap-10">
        <ControlButton
          label="시작"
          icon={<StartIcon className="h-16 w-16" />}
          className={colorOf(startDisabled)}
          onClick={handleStartClick}
          disabled={startDisabled}
        />
        <ControlButton
          label="일시정지"
          icon={<PauseIcon className="h-16 w-16" />}
          className={colorOf(pauseDisabled)}
          onClick={handlePauseClick}
          disabled={pauseDisabled}
        />
        <ControlButton
          label="타이머 종료"
          icon={<FinishIcon className="h-16 w-16" />}
          className={colorOf(finishDisabled)}
          onClick={handleFinishClick}
          disabled={finishDisabled}
        />
      </div>

      {/* 우측 보조 버튼: 타이머가 존재할 때(timerId 있음)만 렌더링 */}
      {timerId && (
        <div className="absolute right-0 flex items-center gap-4">
          <ControlButton
            label="할 일 목록"
            variant="round"
            icon={<TodoIcon className="h-12 w-12" />}
            onClick={handleTodoClick}
          />
          <ControlButton
            label="타이머 초기화"
            variant="round"
            icon={<ResetIcon className="h-12 w-12" />}
            onClick={handleResetClick}
            disabled={isResetting}
          />
        </div>
      )}
    </div>
  );
}
