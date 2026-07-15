"use client";

import FinishIcon from "@/assets/icons/finish.svg";
import PauseIcon from "@/assets/icons/pause.svg";
import ResetIcon from "@/assets/icons/reset.svg";
import StartIcon from "@/assets/icons/start.svg";
import TodoIcon from "@/assets/icons/todo.svg";
import ControlButton from "@/components/timer/control-button";
import GoalSetupModal from "@/components/timer/session/goal-setup-modal";
import SessionReviewModal from "@/components/timer/session/session-review-modal";
import TodoChecklistModal from "@/components/timer/session/todo-checklist-modal";
import { useModalStore } from "@/store/use-modal-store";
import { useSessionStore } from "@/store/use-session-store";

export default function TimerControls() {
  const open = useModalStore((state) => state.open);
  const setPhase = useSessionStore((state) => state.setPhase);

  const handleStartClick = () => {
    open(<GoalSetupModal />);
  };

  const handleFinishClick = () => {
    setPhase("review");
    open(<SessionReviewModal />);
  };

  const handleTodoClick = () => {
    setPhase("running");
    open(<TodoChecklistModal />);
  };

  return (
    <div className="relative flex w-full items-center justify-center">
      {/* 메인 컨트롤 */}
      <div className="flex items-center gap-10">
        <ControlButton
          label="시작"
          icon={<StartIcon className="h-16 w-16" />}
          className="text-primary"
          onClick={handleStartClick}
        />
        <ControlButton
          label="일시정지"
          icon={<PauseIcon className="h-16 w-16" />}
          className="text-primary-10"
        />
        <ControlButton
          label="타이머 종료"
          icon={<FinishIcon className="h-16 w-16" />}
          className="text-primary-10"
          onClick={handleFinishClick}
        />
      </div>

      {/* 우측 보조 버튼 */}
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
        />
      </div>
    </div>
  );
}
