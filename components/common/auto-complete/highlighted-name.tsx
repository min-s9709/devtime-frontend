/**
 * 검색어 하이라이트 컴포넌트
 * - 기술스택 이름(name) 중 검색어(query)와 일치하는 부분을 text-gray-800으로 강조
 * - 나머지 부분은 text-gray-500으로 표시
 * ex) query="AA", name="AAATHCHYYU" → "AA"(gray-800) + "ATHCHYYU"(gray-500)
 */
export default function HighlightedName({
  name,
  query,
}: {
  name: string;
  query: string;
}) {
  if (!query) return <span className="text-gray-500">{name}</span>;

  const index = name.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return <span className="text-gray-500">{name}</span>;

  // 검색어 기준으로 앞(before) / 일치(match) / 뒤(after) 세 부분으로 분리
  const before = name.slice(0, index);
  const match = name.slice(index, index + query.length);
  const after = name.slice(index + query.length);

  return (
    <span className="text-gray-500 font-regular">
      {before}
      <span className="text-gray-800 font-semibold">{match}</span>
      {after}
    </span>
  );
}
