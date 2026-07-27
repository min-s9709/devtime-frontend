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
// 날짜부는 버킷 날짜로 두되 시간부는 "현재 시각"으로 채운다. 자정(00:00:00.000Z)은
// 타이머 시작 시각보다 이전이라 서버 검증(시작~현재 범위)에 걸릴 수 있어서다.
// dayKey는 로컬 날짜 컴포넌트로 판정하므로 dayKey(dateMarker(k)) === k 왕복은 유지된다.
export const dateMarker = (key: string): string => {
  const [y, m, d] = key.split("-").map(Number);
  const dt = new Date(); // 현재 시각(시:분:초 유지)
  dt.setFullYear(y, m - 1, d); // 날짜부만 버킷 날짜로 교체(로컬 기준)
  return dt.toISOString();
};

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
