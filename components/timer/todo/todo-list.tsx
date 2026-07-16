"use client";

import TodoCard from "@/components/timer/todo/todo-card";
import type { SessionPhase, Todo } from "@/store/use-session-store";
import { cn } from "@/utils/cn";
import { getCardStatus } from "@/utils/get-card-status";

interface TodoListProps {
  todos: Todo[];
  phase: SessionPhase;
  editingId?: string | null;
  onToggle?: (id: string) => void;
  onEdit?: (id: string) => void; // 편집 시작
  onEditChange?: (id: string, content: string) => void; // 편집 중 입력
  onEditConfirm?: (id: string) => void; // 편집 확인
  onDelete?: (id: string) => void;
  className?: string;
}

export default function TodoList({
  todos,
  phase,
  editingId = null,
  onToggle,
  onEdit,
  onEditChange,
  onEditConfirm,
  onDelete,
  className,
}: TodoListProps) {
  return (
    <ul className={cn("flex flex-col gap-3", className)}>
      {todos.map((todo) => (
        <li key={todo.id}>
          <TodoCard
            status={getCardStatus(phase, todo, editingId)}
            label={todo.content}
            value={todo.content}
            onChange={(content) => onEditChange?.(todo.id, content)}
            onConfirm={() => onEditConfirm?.(todo.id)}
            onEdit={() => onEdit?.(todo.id)}
            onDelete={() => onDelete?.(todo.id)}
            onToggleCheck={() => onToggle?.(todo.id)}
          />
        </li>
      ))}
    </ul>
  );
}
