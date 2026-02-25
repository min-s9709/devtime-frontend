import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import Button from ".";

const meta = {
  title: "Button 컴포넌트",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["Primary", "Secondary", "Tertiary"],
    },
    disabled: {
      control: "boolean",
    },
  },
  args: {
    onClick: fn(),
    value: "Button",
    variant: "Primary",
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: "Primary",
    value: "Primary Button",
  },
};

export const Secondary: Story = {
  args: {
    variant: "Secondary",
    value: "Secondary Button",
  },
};

export const Tertiary: Story = {
  args: {
    variant: "Tertiary",
    value: "Tertiary Button",
  },
};

export const Disabled: Story = {
  args: {
    variant: "Primary",
    value: "Disabled Button",
    disabled: true,
  },
};
