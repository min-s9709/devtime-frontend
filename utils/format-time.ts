// 경과 시간(ms)을 타이머 표시용 HH/MM/SS 2자리 문자열로 분해한다.
export const formatElapsed = (elapsedMs: number) => {
  const totalSec = Math.max(0, Math.floor(elapsedMs / 1000));
  const pad = (n: number) => String(n).padStart(2, "0");

  return {
    hours: pad(Math.floor(totalSec / 3600)),
    minutes: pad(Math.floor((totalSec % 3600) / 60)),
    seconds: pad(totalSec % 60),
  };
};

// 총 초를 시/분/초 숫자로 분해한다. (통계 표시용)
export const splitDuration = (totalSeconds: number) => {
  const s = Math.max(0, Math.floor(totalSeconds));

  return {
    hours: Math.floor(s / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
};

// ms 단위 시간을 "N시간 N분" 표시용 세그먼트 배열로 변환한다. (통계 카드용)
export const durationSegments = (totalMs: number) => {
  const { hours, minutes } = splitDuration(totalMs / 1000);

  return [
    { value: String(hours), unit: "시간" },
    { value: String(minutes), unit: "분" },
  ];
};

// 총 초를 "1시간 30분" / "30분" / "1시간"처럼 0인 단위를 생략해 표시한다.
// (차트 눈금·툴팁처럼 간결한 표기가 필요한 곳에서 사용)
// 1분 미만의 값(0초 초과)은 "1분 미만"으로 표기해 0과 구분한다.
export const formatCompactDuration = (totalSeconds: number) => {
  const { hours, minutes } = splitDuration(totalSeconds);

  if (hours && minutes) return `${hours}시간 ${minutes}분`;
  if (hours) return `${hours}시간`;
  if (minutes) return `${minutes}분`;
  if (totalSeconds > 0) return "1분 미만";

  return "0분";
};

// 총 초를 "12시간 04분 38초" 형태의 한글 문자열로 만든다.
// withSeconds가 false면 분까지만 표시한다. (분·초는 2자리로 패딩)
export const formatKoreanDuration = (
  totalSeconds: number,
  { withSeconds = false }: { withSeconds?: boolean } = {},
) => {
  const { hours, minutes, seconds } = splitDuration(totalSeconds);
  const pad = (n: number) => String(n).padStart(2, "0");

  const parts = [`${hours}시간`, `${pad(minutes)}분`];
  if (withSeconds) parts.push(`${pad(seconds)}초`);

  return parts.join(" ");
};

// ms 단위 학습 시간을 "420시간" / "4.5시간"처럼 시간 단위로 표기한다. (랭킹 카드용)
// fractionDigits=0이면 정수 시간, 1이면 소수 한 자리까지 보여준다.
export const formatStudyHours = (totalMs: number, fractionDigits = 0) => {
  const hours = Math.max(0, totalMs) / 1000 / 60 / 60;

  return `${hours.toFixed(fractionDigits)}시간`;
};
