// "2025-09-30"(또는 ISO 문자열) → "2025.09.30" 표기용.
export const formatDotDate = (iso: string) => iso.slice(0, 10).replaceAll("-", ".");

// 세션이 자정을 넘겨 여러 날짜에 걸칠 수 있어, 시작일=종료일이면 단일 날짜,
// 다르면 "2025.09.29 ~ 09.30"처럼 범위로 표기한다. (같은 해면 종료일은 MM.DD로 축약)
export const formatDateRange = (start: string, end: string) => {
  const startDot = formatDotDate(start);
  if (start.slice(0, 10) === end.slice(0, 10)) return startDot;

  const sameYear = start.slice(0, 4) === end.slice(0, 4);
  const endText = sameYear
    ? end.slice(5, 10).replaceAll("-", ".")
    : formatDotDate(end);

  return `${startDot} ~ ${endText}`;
};
