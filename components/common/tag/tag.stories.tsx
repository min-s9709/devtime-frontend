import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Tag from ".";

const meta = {
  title: "Tag 컴포넌트",
  component: Tag,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    name: {
      control: "text",
    },
    className: {
      control: "text",
    },
  },
  args: {
    name: "React",
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "React",
  },
};

// 조회 화면(ProfileView)처럼 이름 배열을 map으로 렌더링하는 예시.
// Tag는 표시전용이라 id가 없고, key는 호출부에서 이름으로 붙인다.
export const TagList: Story = {
  render: () => (
    <div className="flex max-w-md flex-wrap gap-2">
      {["React", "Vue", "Angular", "Svelte", "Next.js", "Gatsby", "Ember"].map(
        (name) => (
          <Tag key={name} name={name} />
        ),
      )}
    </div>
  ),
};
