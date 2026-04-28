import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { fn } from "storybook/test";
import SelectDropdown from ".";
import { SELECT_CAREER_OPTIONS, SELECT_PURPOSE_OPTIONS } from "@/constants";

const meta = {
  title: "SelectDropdown 컴포넌트",
  component: SelectDropdown,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    placeholder: "선택해 주세요",
    options: SELECT_CAREER_OPTIONS,
    onChange: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ width: 420 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SelectDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "개발 경력",
    placeholder: "개발 경력을 선택해 주세요.",
    options: SELECT_CAREER_OPTIONS,
  },
};

export const WithoutLabel: Story = {
  args: {
    placeholder: "라벨 없는 셀렉트",
    options: SELECT_CAREER_OPTIONS,
  },
};

export const WithSelectedValue: Story = {
  args: {
    label: "개발 경력",
    placeholder: "개발 경력을 선택해 주세요.",
    options: SELECT_CAREER_OPTIONS,
    selectedValue: "0 - 3년",
  },
};

export const PurposeOptions: Story = {
  args: {
    label: "공부 목적",
    placeholder: "공부 목적을 선택해 주세요.",
    options: SELECT_PURPOSE_OPTIONS,
  },
};
