// react-query 쿼리 키를 한곳에 모아 오타·드리프트를 막는다.
export const timerKeys = {
  active: ["timer"] as const, // GET /api/timers (미종료 타이머)
  studyLog: (studyLogId: string) => ["study-log", studyLogId] as const,
};
