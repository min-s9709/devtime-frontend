import DashboardContent from "@/components/dashboard/dashboard-content";
import { PATH } from "@/constants/path";
import { createMetadata } from "@/utils/create-metadata";

// 로그인한 본인의 학습 통계만 보여주는 페이지라 색인 대상이 아니다.
export const metadata = createMetadata({
  title: "대시보드",
  description:
    "누적 공부 시간, 목표 달성률, 요일별 학습 패턴을 한눈에 확인하세요.",
  path: PATH.DASHBOARD,
  noIndex: true,
});

export default function Dashboard() {
  return <DashboardContent />;
}
