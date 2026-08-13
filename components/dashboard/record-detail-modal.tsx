"use client";

import Button from "@/components/common/button";
import TextAreaField from "@/components/common/textarea-field";
import TodoCard from "@/components/timer/todo/todo-card";
import { useRecordDetail } from "@/hooks/queries/use-record-detail";
import { useModalStore } from "@/store/use-modal-store";

interface RecordDetailModalProps {
  studyLogId: string;
}

// 상태/에러 표시도 본문과 폭을 맞춰 모달 크기가 튀지 않게 한다.
const wrapper = "flex w-140 max-w-[90vw] flex-col";

// 학습 기록 상세 모달. 오늘의 목표·할 일 목록(완료 여부)·한 줄 소감을 조회해 보여준다.
// 이미 진행된 기록이라 조회 전용이며 수정은 불가능하다. (삭제는 목록의 휴지통 버튼에서)
export default function RecordDetailModal({
  studyLogId,
}: RecordDetailModalProps) {
  const { record, isLoading, isError } = useRecordDetail(studyLogId);
  const close = useModalStore((s) => s.close);

  if (isLoading) {
    return (
      <div
        className={`${wrapper} h-40 items-center justify-center text-body text-gray-500`}
      >
        불러오는 중...
      </div>
    );
  }

  if (isError || !record) {
    return (
      <div
        className={`${wrapper} h-40 items-center justify-center text-body text-gray-500`}
      >
        기록을 불러오지 못했어요.
      </div>
    );
  }

  return (
    <div className={`${wrapper} min-h-120 gap-6 p-6`}>
      {/* 오늘의 목표 */}
      <h2 className="text-heading font-bold text-indigo">{record.todayGoal}</h2>

      {/* 할 일 목록 (완료=파랑 / 미완료=회색, 조회 전용)
          max-height + 카드 하나가 중간에 걸치는 높이로, 스크롤 가능함을 다음 카드 일부로 암시 */}
      {record.tasks.length > 0 ? (
        <ul className="flex min-h-80 max-h-123 flex-col gap-3 overflow-y-auto pr-1">
          {record.tasks.map((task) => (
            <li key={task.id}>
              <TodoCard
                status={task.isCompleted ? "completed" : "failed"}
                label={task.content}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-body text-gray-400">할 일이 없어요.</p>
      )}

      {/* 하단: 한 줄 소감 + 닫기 */}
      <div className="mt-auto flex flex-col gap-4">
        <TextAreaField
          label="한 줄 소감"
          value={record.review || ""}
          readOnly
        />

        <Button
          variant="Tertiary"
          value="닫기"
          onClick={close}
          className="self-end"
        />
      </div>
    </div>
  );
}
