// 경과 시간(ms)을 타이머 표시용 HH/MM/SS 2자리 문자열로 분해한다.
export function formatElapsed(elapsedMs: number) {
  const totalSec = Math.max(0, Math.floor(elapsedMs / 1000));
  const pad = (n: number) => String(n).padStart(2, "0");

  return {
    hours: pad(Math.floor(totalSec / 3600)),
    minutes: pad(Math.floor((totalSec % 3600) / 60)),
    seconds: pad(totalSec % 60),
  };
}
