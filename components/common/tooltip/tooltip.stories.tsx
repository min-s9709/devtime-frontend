import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Tooltip from ".";

const meta = {
  title: "Tooltip 컴포넌트",
  component: Tooltip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    placement: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
    },
  },
  args: {
    content: "Plain tooltip",
    placement: "top",
    children: (
      <button
        type="button"
        className="rounded-[5px] bg-primary px-4 py-2 text-body-sm font-semibold text-white"
      >
        Hover me
      </button>
    ),
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Top: Story = {
  args: { placement: "top" },
};

export const Bottom: Story = {
  args: { placement: "bottom" },
};

export const Left: Story = {
  args: { placement: "left" },
};

export const Right: Story = {
  args: { placement: "right" },
};

export const LongContent: Story = {
  args: {
    content: "긴 내용의 툴팁도 최대 너비 안에서 줄바꿈되어 표시됩니다.",
  },
};
