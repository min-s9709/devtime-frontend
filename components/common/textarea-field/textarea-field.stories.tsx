import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { fn } from "storybook/test";
import TextAreaField from ".";

const meta = {
  title: "TextAreaField 컴포넌트",
  component: TextAreaField,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    label: "Label",
    placeholder: "입력해주세요",
    onChange: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ width: 420 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TextAreaField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "입력해주세요",
    onChange: fn(),
  },
};

export const WithoutLabel: Story = {
  args: {
    label: undefined,
    placeholder: "label 없는 입력",
  },
};

export const WithValue: Story = {
  args: {
    defaultValue: "입력된 값",
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "비활성화된 입력",
    disabled: true,
  },
};
