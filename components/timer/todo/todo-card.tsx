"use client";

import CheckIcon from "@/assets/icons/check.svg";
import CodeIcon from "@/assets/icons/code.svg";
import EditIcon from "@/assets/icons/edit.svg";
import TrashIcon from "@/assets/icons/trash.svg";
import Checkbox from "@/components/common/checkbox";
import { cn } from "@/utils/cn";

export type TodoCardStatus =
  | "adding" // 새로 추가된 항목 (수정/삭제)
  | "editing" // 편집 중 (입력창 + 확인)
  | "checkable" // 체크 가능
  | "checked" // 체크됨
  | "completed" // 완료(성공)
  | "failed"; // 실패

interface TodoCardProps {
  status: TodoCardStatus;
  label: string;
  value?: string; // editing 상태에서 입력값
  onChange?: (value: string) => void; // editing 입력 변경
  onConfirm?: () => void; // editing 확인
  onEdit?: () => void; // adding → editing 진입
  onDelete?: () => void; // adding 삭제
  onToggleCheck?: (checked: boolean) => void; // checkable/checked 토글
  className?: string;
}

const base = "w-full flex items-center gap-4 rounded-lg p-6";

// Button의 themeVariants 패턴과 동일하게 상태별 색상을 맵으로 관리
const statusVariants: Record<TodoCardStatus, string> = {
  adding: "bg-primary text-white",
  editing: "bg-primary text-white",
  checkable: "bg-primary text-white",
  checked: "bg-gray-400 text-white",
  completed: "bg-primary text-white",
  failed: "bg-gray-200 text-gray-400",
};

export default function TodoCard({
  status,
  label,
  value,
  onChange,
  onConfirm,
  onEdit,
  onDelete,
  onToggleCheck,
  className,
}: TodoCardProps) {
  return (
    <div className={cn(base, statusVariants[status], className)}>
      <CodeIcon className="h-4 w-8 shrink-0 opacity-50" />

      {/* 가운데: 편집 중이면 입력창, 아니면 라벨 텍스트 */}
      {status === "editing" ? (
        <input
          autoFocus
          value={value}
          maxLength={30} // 할 일 항목은 최대 30자
          onChange={(e) => onChange?.(e.target.value)}
          onKeyDown={(e) => {
            // IME 조합 중 Enter(한글 확정)는 무시
            if (e.key === "Enter" && !e.nativeEvent.isComposing) {
              e.preventDefault();
              onConfirm?.();
            }
          }}
          className="flex-1 bg-transparent text-body font-medium text-white outline-none placeholder:text-white/60"
        />
      ) : (
        <span className="flex-1 truncate text-body font-medium">{label}</span>
      )}

      {/* 오른쪽: 상태별 액션 슬롯 */}
      {status === "adding" && (
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="수정"
            onClick={onEdit}
            className="transition-transform hover:scale-110"
          >
            <EditIcon className="h-6 w-6" />
          </button>
          <button
            type="button"
            aria-label="삭제"
            onClick={onDelete}
            className="transition-transform hover:scale-110"
          >
            <TrashIcon className="h-6 w-6" />
          </button>
        </div>
      )}

      {status === "editing" && (
        <button
          type="button"
          aria-label="확인"
          onClick={onConfirm}
          className="transition-transform hover:scale-110"
        >
          <CheckIcon className="h-6 w-6" />
        </button>
      )}

      {(status === "checkable" || status === "checked") && (
        <Checkbox
          checked={status === "checked"}
          onChange={(e) => onToggleCheck?.(e.target.checked)}
          className="border-white checked:border-white checked:bg-gray-300"
          iconClassName="text-white"
        />
      )}
    </div>
  );
}
