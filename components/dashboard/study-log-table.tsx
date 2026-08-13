"use client";

import TrashIcon from "@/assets/icons/trash.svg";
import ConfirmModal from "@/components/common/modal/confirm-modal";
import Pagination from "@/components/common/pagination";
import { useAllStudyLogs } from "@/hooks/queries/use-all-study-logs";
import { useDeleteStudyLog } from "@/hooks/queries/use-delete-study-log";
import { useModalStore } from "@/store/use-modal-store";
import { StudyLogSummary } from "@/types/response";
import { cn } from "@/utils/cn";
import { formatDateRange } from "@/utils/format-date";
import { formatCompactDuration } from "@/utils/format-time";
import { useState } from "react";
import RecordDetailModal from "./record-detail-modal";

const COLUMNS = [
  "날짜",
  "목표",
  "공부 시간",
  "할 일",
  "미완료",
  "달성률",
] as const;

export default function StudyLogTable() {
  const [page, setPage] = useState(1); // UI는 1-based
  const { studyLogs, pagination, isLoading, isError, isPlaceholderData } =
    useAllStudyLogs(page);
  const { deleteStudyLog } = useDeleteStudyLog();
  const open = useModalStore((s) => s.open);

  const openDetail = (log: StudyLogSummary) =>
    open(<RecordDetailModal studyLogId={log.id} />);

  const confirmDelete = (log: StudyLogSummary) =>
    open(
      <ConfirmModal
        title="학습 기록을 삭제할까요?"
        description="한 번 삭제된 학습 기록은 다시 복구할 수 없습니다. 그래도 계속 하시겠습니까?"
        confirmText="삭제하기"
        onConfirm={() => deleteStudyLog(log.id)}
      />,
    );

  return (
    <section className="flex flex-col gap-2 rounded-2xl bg-white p-6 shadow-1">
      <h2 className="flex items-baseline gap-2 px-2 text-title font-bold text-gray-600">
        학습 기록
        {pagination && (
          <span className="text-body-sm font-medium text-gray-400">
            {pagination.totalItems}건
          </span>
        )}
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full min-w-160 border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-left text-body-sm font-medium text-gray-400">
              {COLUMNS.map((col) => (
                <th key={col} className="px-4 py-3 font-medium">
                  {col}
                </th>
              ))}
              <th className="px-4 py-3" aria-label="삭제" />
            </tr>
          </thead>

          <tbody className={cn(isPlaceholderData && "opacity-60")}>
            {studyLogs?.map((log) => {
              const rate = Math.round(log.completionRate);
              return (
                <tr
                  key={log.id}
                  onClick={() => openDetail(log)}
                  className="group cursor-pointer border-b border-gray-50 text-body-sm text-gray-800 transition-colors hover:bg-gray-50"
                >
                  <td className="rounded-l-xl px-4 py-5 whitespace-nowrap text-gray-500">
                    {formatDateRange(log.startDate, log.endDate)}
                  </td>
                  <td className="px-4 py-5 font-medium text-gray-800">
                    {log.todayGoal}
                  </td>
                  <td className="px-4 py-5 whitespace-nowrap text-gray-600">
                    {formatCompactDuration(Math.floor(log.studyTime / 1000))}
                  </td>
                  <td className="px-4 py-5 text-gray-600">{log.totalTasks}</td>
                  <td className="px-4 py-5">
                    <span className="flex items-center gap-2 text-gray-600">
                      {log.incompleteTasks > 0 && (
                        <span className="h-1.5 w-1.5 rounded-full bg-notice" />
                      )}
                      {log.incompleteTasks}
                    </span>
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 w-28 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${rate}%` }}
                        />
                      </div>
                      <span className="whitespace-nowrap font-semibold text-gray-800">
                        {rate}%
                      </span>
                    </div>
                  </td>
                  <td className="rounded-r-xl px-4 py-5 text-right">
                    <button
                      type="button"
                      aria-label="학습 기록 삭제"
                      onClick={(e) => {
                        e.stopPropagation(); // 행 클릭(상세 모달)으로 전파되지 않도록
                        confirmDelete(log);
                      }}
                      className="rounded-lg p-2 text-gray-300 transition-colors hover:bg-negative/10 hover:text-negative"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* 상태 표시 */}
        {isLoading && (
          <p className="py-10 text-center text-body text-gray-500">
            학습 기록을 불러오는 중...
          </p>
        )}
        {isError && (
          <p className="py-10 text-center text-body text-gray-500">
            학습 기록을 불러오지 못했어요.
          </p>
        )}
        {!isLoading && !isError && studyLogs?.length === 0 && (
          <p className="py-10 text-center text-body text-gray-500">
            아직 학습 기록이 없어요.
          </p>
        )}
      </div>

      {pagination && (
        <Pagination
          currentPage={page}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
        />
      )}
    </section>
  );
}
