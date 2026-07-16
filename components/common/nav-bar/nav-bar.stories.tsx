import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useProfileStore } from "@/store/use-profile-store";
import type { Profile } from "@/types/response";
import NavBar from ".";

// 드롭다운 내부 UserBadge가 useLogout(useMutation)을 호출하므로 QueryClient가 필요하다.
const queryClient = new QueryClient();

// 로그인 상태를 표현하기 위한 샘플 프로필. profileImage가 비어 있으면
// UserBadge가 기본 이미지로 대체한다.
const LOGGED_IN_PROFILE: Profile = {
  email: "devtime@example.com",
  nickname: "데브타임",
  profile: {
    career: "0 - 3년",
    purpose: "취업",
    goal: "매일 1시간 알고리즘 풀기",
    techStacks: ["React", "TypeScript"],
    profileImage: "",
  },
};

const meta = {
  title: "NavBar 컴포넌트",
  component: NavBar,
  parameters: {
    layout: "fullscreen",
    // 활성 링크 표시를 위해 현재 경로를 대시보드로 고정한다.
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/dashboard" },
    },
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <div className="px-10">
          <Story />
        </div>
      </QueryClientProvider>
    ),
  ],
} satisfies Meta<typeof NavBar>;

export default meta;
type Story = StoryObj<typeof meta>;

// 1. 비로그인 상태: 로그인/회원가입 링크가 보인다.
export const LoggedOut: Story = {
  beforeEach: () => {
    useProfileStore.setState({ profile: null });
  },
};

// 2. 로그인 상태: 프로필 뱃지(UserBadge)가 보인다.
export const LoggedIn: Story = {
  beforeEach: () => {
    useProfileStore.setState({ profile: LOGGED_IN_PROFILE });
    return () => useProfileStore.setState({ profile: null });
  },
};

// 3. 로그인 상태에서 뱃지를 클릭해 드롭다운(마이페이지/로그아웃)이 열린 상태.
export const DropdownOpen: Story = {
  beforeEach: () => {
    useProfileStore.setState({ profile: LOGGED_IN_PROFILE });
    return () => useProfileStore.setState({ profile: null });
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole("button", { name: /프로필 이미지/ })
    );
  },
};
