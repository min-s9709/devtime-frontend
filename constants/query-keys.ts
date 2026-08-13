// react-query 쿼리 키를 한곳에 모아 오타·드리프트를 막는다.
export const timerKeys = {
  active: ["timer"] as const, // GET /api/timers (미종료 타이머)
  studyLog: (studyLogId: string) => ["study-log", studyLogId] as const,
};

export const statsKeys = {
  study: ["study-stats"] as const, // GET /api/stats (공부 통계)
  heatmap: ["study-heatmap"] as const, // GET /api/heatmap (요일별 공부량 히트맵)
};

export const studyLogKeys = {
  all: ["study-logs"] as const,
  list: (page: number, size: number) =>
    ["study-logs", "list", page, size] as const, // GET /api/study-logs (목록)
  detail: (studyLogId: string) => ["study-logs", "detail", studyLogId] as const, // GET /api/study-logs/{id}
};
