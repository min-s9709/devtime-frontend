import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import { useModalStore } from "@/store/use-modal-store";
import Modal from ".";

const meta = {
  title: "Modal 컴포넌트",
  component: Modal,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

const onConfirm = fn();

export const Default: Story = {
  render: () => {
    const { open, close } = useModalStore();

    return (
      <>
        <button
          className="px-4 py-2 rounded-md bg-primary text-white font-semibold cursor-pointer"
          onClick={() =>
            open(
              <div className="flex flex-col gap-4">
                <p className="text-body text-gray-600">정말 삭제하시겠습니까?</p>
                <div className="flex gap-2">
                  <button
                    className="flex-1 h-12 rounded-[5px] bg-gray-100 text-gray-600 font-semibold cursor-pointer"
                    onClick={close}
                  >
                    취소
                  </button>
                  <button
                    className="flex-1 h-12 rounded-[5px] bg-primary text-white font-semibold cursor-pointer"
                    onClick={async () => {
                      await onConfirm();
                      close();
                    }}
                  >
                    확인
                  </button>
                </div>
              </div>,
            )
          }
        >
          모달 열기
        </button>
        <Modal />
      </>
    );
  },
};
