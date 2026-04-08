import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import HelperText from ".";

const meta = {
  title: "HelperText 컴포넌트",
  component: HelperText,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: "select",
      options: ["informative", "error", "success"],
    },
  },
  args: {
    status: "informative",
    message: "Helper Text",
  },
} satisfies Meta<typeof HelperText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Informative: Story = {
  args: { status: "informative", message: "안내 메시지입니다." },
};
export const Error: Story = {
  args: { status: "error", message: "오류 메시지입니다." },
};
export const Success: Story = {
  args: { status: "success", message: "성공 메시지입니다." },
};
