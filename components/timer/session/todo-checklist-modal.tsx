"use client";

import EditIcon from "@/assets/icons/edit.svg";
import Button from "@/components/common/button";
import TodoInput from "@/components/timer/todo/todo-input";
import TodoList from "@/components/timer/todo/todo-list";
import { useSessionStore } from "@/store/use-session-store";
import { useState } from "react";

// running 국면: 타이머 진행 중 할 일 체크
// TODO: 제목/목표 표시 + 닫기 푸터 구성
export default function TodoChecklistModal() {
  const [isEdit, setIsEdit] = useState(false);

  const todos = useSessionStore((s) => s.todos);
  const editingId = useSessionStore((s) => s.editingId);
  const toggleTodo = useSessionStore((s) => s.toggleTodo);
  const addTodo = useSessionStore((s) => s.addTodo);
  const startEditing = useSessionStore((s) => s.startEditing);
  const editContent = useSessionStore((s) => s.editContent);
  const stopEditing = useSessionStore((s) => s.stopEditing);
  const deleteTodo = useSessionStore((s) => s.deleteTodo);

  const handleEditClick = () => {
    setIsEdit((prev) => {
      if (prev) stopEditing(); // 수정 모드 종료 시 편집 중이던 항목 정리
      return !prev;
    });
  };

  // 수정 모드에선 setup처럼 adding/editing 카드로 렌더한다.
  const listPhase = isEdit ? "setup" : "running";

  return (
    <form className="w-160 flex flex-col gap-9 p-4">
      <TodoInput onAdd={addTodo} />
      <section>
        <div className="flex justify-between mb-6">
          <h2 className="text-title text-gray-700 font-bold">할 일 목록</h2>
          {!isEdit && (
            <button
              type="button"
              className="flex items-center gap-2 text-gray-600 text-body-sm cursor-pointer"
              onClick={handleEditClick}
            >
              <EditIcon className="w-6 h-6" />
              <span>할 일 수정</span>
            </button>
          )}
        </div>
        <TodoList
          todos={todos}
          phase={listPhase}
          editingId={editingId}
          onToggle={toggleTodo}
          onEdit={startEditing}
          onEditChange={editContent}
          onEditConfirm={stopEditing}
          onDelete={deleteTodo}
          className="h-105 overflow-y-auto"
        />
      </section>

      {/* TODO: 닫기 버튼 */}
      <section className="flex justify-end gap-4">
        <Button variant="Tertiary" value="취소" />
        <Button
          variant="Secondary"
          value={isEdit ? "변경사항 저장하기" : "저장하기"}
        />
      </section>
    </form>
  );
}
