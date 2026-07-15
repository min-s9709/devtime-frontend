import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import TodoCard from "./todo-card";

const meta = {
  title: "Timer/TodoCard 컴포넌트",
  component: TodoCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: "select",
      options: [
        "adding",
        "editing",
        "checkable",
        "checked",
        "completed",
        "failed",
      ],
    },
  },
  args: {
    label: "TODO List Item",
    onChange: fn(),
    onConfirm: fn(),
    onEdit: fn(),
    onDelete: fn(),
    onToggleCheck: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ width: 520 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TodoCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// 1. 새로 추가된 항목 — 수정/삭제
export const Adding: Story = {
  args: { status: "adding" },
};

// 2. 편집 중 — 입력창 + 확인
export const Editing: Story = {
  args: { status: "editing", value: "Typing" },
};

// 3. 체크 가능
export const Checkable: Story = {
  args: { status: "checkable" },
};

// 4. 체크됨
export const Checked: Story = {
  args: { status: "checked" },
};

// 5. 완료(성공)
export const Completed: Story = {
  args: { status: "completed" },
};

// 6. 실패
export const Failed: Story = {
  args: { status: "failed" },
};
