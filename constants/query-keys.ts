import { RankingSortBy } from "@/types/request";

// react-query 쿼리 키를 한곳에 모아 오타·드리프트를 막는다.
export const timerKeys = {
  active: ["timer"] as const, // GET /api/timers (미종료 타이머)
  studyLog: (studyLogId: string) => ["study-log", studyLogId] as const,
};

export const statsKeys = {
  study: ["study-stats"] as const, // GET /api/stats (공부 통계)
  heatmap: ["study-heatmap"] as const, // GET /api/heatmap (요일별 공부량 히트맵)
};

export const profileKeys = {
  detail: ["profile"] as const, // GET /api/profile (마이페이지 프로필)
};

export const studyLogKeys = {
  all: ["study-logs"] as const,
  list: (page: number, size: number) =>
    ["study-logs", "list", page, size] as const, // GET /api/study-logs (목록)
  detail: (studyLogId: string) => ["study-logs", "detail", studyLogId] as const, // GET /api/study-logs/{id}
};

export const rankingKeys = {
  all: ["rankings"] as const,
  // GET /api/rankings — 정렬 기준마다 별도 무한스크롤 캐시를 갖는다.
  list: (sortBy: RankingSortBy) => ["rankings", "list", sortBy] as const,
};
