import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import Modal from ".";

const meta = {
  title: "Modal 컴포넌트",
  component: Modal,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    isOpen: true,
    onClose: fn(),
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <p className="text-body text-gray-600">모달 내용이 여기에 들어갑니다.</p>
    ),
  },
};

export const WithActions: Story = {
  args: {
    children: (
      <div className="flex flex-col gap-4">
        <p className="text-body text-gray-600">정말 삭제하시겠습니까?</p>
        <div className="flex gap-2">
          <button className="flex-1 h-12 rounded-[5px] bg-gray-100 text-gray-600 font-semibold cursor-pointer">
            취소
          </button>
          <button className="flex-1 h-12 rounded-[5px] bg-primary text-white font-semibold cursor-pointer">
            확인
          </button>
        </div>
      </div>
    ),
  },
};
