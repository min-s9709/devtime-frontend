import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import Chip from ".";

const meta = {
  title: "Chip 컴포넌트",
  component: Chip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    id: {
      control: "number",
    },
    name: {
      control: "text",
    },
  },
  args: {
    onDelete: fn(),
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 1,
    name: "React",
  },
};

export const MultipleChips: Story = {
  args: {
    id: 1,
    name: "React",
  },
  render: (args) => (
    <div className="flex gap-2 flex-wrap">
      <Chip {...args} />
      <Chip id={2} name="TypeScript" onDelete={args.onDelete} />
      <Chip id={3} name="Next.js" onDelete={args.onDelete} />
    </div>
  ),
};
