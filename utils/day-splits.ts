// 타이머 경과 시간을 "일자별"로 관리하기 위한 유틸.
// 하루 경계는 사용자 로컬 자정 기준으로 잡는다(대시보드의 "오늘" 개념과 일치).

// 어떤 시각(ms epoch)이 속한 로컬 캘린더 날짜 키. 예: "2026-07-24"
export const dayKey = (ms: number): string => {
  const d = new Date(ms);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

// dayKey → 서버로 보낼 date 마커(ISO 문자열).
// 백엔드가 각 일자를 "그 날의 자정(YYYY-MM-DDT00:00:00.000Z)" 마커로 받으므로,
// 로컬 날짜 키를 그대로 문자열에 담아 보낸다. toISOString()의 UTC 변환을 거치지
// 않아 날짜부가 로컬 날짜 그대로 유지되고(KST 새벽에도 전날로 밀리지 않음),
// dayKey(dateMarker(k)) === k 왕복도 성립한다.
export const dateMarker = (key: string): string => `${key}T00:00:00.000Z`;

// [startMs, endMs) 구간을 로컬 자정 경계로 잘라 buckets(일자별 ms)에 더한다.
// 자정을 넘긴 구간도 정확히 두 날짜로 분배된다.
export const foldSegment = (
  buckets: Record<string, number>,
  startMs: number,
  endMs: number,
): void => {
  let cursor = startMs; // 아직 처리 안 한 구간의 시작점. cursor -->"여기 까지 처리했다."
  while (cursor < endMs) {
    const d = new Date(cursor);
    // 다음 로컬 자정 (day + 1은 월/연도 경계를 Date가 알아서 넘겨준다)
    // cursor가 속한 날의 다음 날 자정
    const nextMidnight = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate() + 1,
    ).getTime();

    // endMs와 nextMidnight 중 더 작은 쪽까지를 이번 chunk로 처리한다.
    // endMs가 더 이르면 자정을 안 넘기고 구간이 끝남.
    // nextMidnight가 더 이르면 자정에서 끊고 다음 반복으로 (아직 구간이 남음)
    const chunkEnd = Math.min(nextMidnight, endMs);
    const key = dayKey(cursor);
    buckets[key] = (buckets[key] ?? 0) + (chunkEnd - cursor);
    cursor = chunkEnd;
  }
};

// 일자별 버킷 맵 → 서버 splitTimes 배열 (서버로 보낼 때)
export const splitsToArray = (
  buckets: Record<string, number>,
): { date: string; timeSpent: number }[] =>
  Object.entries(buckets).map(([key, timeSpent]) => ({
    date: dateMarker(key),
    timeSpent,
  }));

// 서버 splitTimes 배열 → 일자별 버킷 맵 (같은 날은 합산)
export const arrayToSplits = (
  splitTimes: { date: string; timeSpent: number }[],
): Record<string, number> => {
  const buckets: Record<string, number> = {};
  for (const s of splitTimes) {
    const key = dayKey(Date.parse(s.date));
    buckets[key] = (buckets[key] ?? 0) + s.timeSpent;
  }
  return buckets;
};

// 일자별 버킷 합 = 총 경과(ms)
export const sumSplits = (buckets: Record<string, number>): number =>
  Object.values(buckets).reduce((sum, ms) => sum + ms, 0);
