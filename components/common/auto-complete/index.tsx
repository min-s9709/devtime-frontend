"use client";

import AddIcon from "@/assets/icons/plus.svg";
import InputField from "@/components/common/input-field";
import { useEffect, useRef, useState } from "react";

export interface TechStackItem {
  id: number;
  name: string;
}

interface AutoCompleteProps {
  placeholder: string;
  label?: string;
  onSelect?: (item: TechStackItem) => void;
}

// -------------------------------------------------------
// [MOCK 데이터] API 연결 시 이 상수를 제거하고,
// API 응답 데이터로 대체해야 합니다.
// -------------------------------------------------------
const SEARCH_LIST = [
  {
    id: 0,
    name: "AAABC",
    createdAt: "2026-04-17T10:23:20.272Z",
    updatedAt: "2026-04-17T10:23:20.272Z",
  },
  {
    id: 1,
    name: "AABYF",
    createdAt: "2026-04-17T10:23:20.272Z",
    updatedAt: "2026-04-17T10:23:20.272Z",
  },
  {
    id: 2,
    name: "AACDDFG",
    createdAt: "2026-04-17T10:23:20.272Z",
    updatedAt: "2026-04-17T10:23:20.272Z",
  },
  {
    id: 3,
    name: "AAGHR",
    createdAt: "2026-04-17T10:23:20.272Z",
    updatedAt: "2026-04-17T10:23:20.272Z",
  },
  {
    id: 4,
    name: "AAATHCHYYU",
    createdAt: "2026-04-17T10:23:20.272Z",
    updatedAt: "2026-04-17T10:23:20.272Z",
  },
  {
    id: 5,
    name: "AAAADFSTHCHYYU",
    createdAt: "2026-04-17T10:23:20.272Z",
    updatedAt: "2026-04-17T10:23:20.272Z",
  },
];

/**
 * 검색어 하이라이트 컴포넌트
 * - 기술스택 이름(name) 중 검색어(query)와 일치하는 부분을 text-gray-800으로 강조
 * - 나머지 부분은 text-gray-500으로 표시
 * ex) query="AA", name="AAATHCHYYU" → "AA"(gray-800) + "ATHCHYYU"(gray-500)
 */
function HighlightedName({ name, query }: { name: string; query: string }) {
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

export default function AutoComplete({
  placeholder,
  label,
  onSelect,
}: AutoCompleteProps) {
  // 검색어 상태
  const [query, setQuery] = useState("");
  // 드롭다운 열림/닫힘 상태 — 검색어가 입력되면 true
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // -------------------------------------------------------
  // [필터링 로직] API 연결 시 이 부분을 대체해야 합니다.
  // -------------------------------------------------------
  const filteredList = SEARCH_LIST.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 입력값이 변경될 때마다 검색어 업데이트 + 드롭다운 열기/닫기 제어
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setQuery(inputValue);
    setIsOpen(inputValue.length > 0);
  };

  // 리스트 항목 클릭 시 부모에게 선택된 항목 전달
  const handleSelect = (item: TechStackItem) => {
    onSelect?.(item);
    setQuery("");
    setIsOpen(false);
  };

  // "Add New Item" 클릭 시 입력값을 새 항목으로 생성하여 부모에게 전달
  // 추후에  /api/tech-stacks 엔드포인트로 POST 요청을 보내 새 기술스택을 생성하는 로직으로 대체해야 합니다.
  const handleAddNewItem = () => {
    if (!query.trim()) return;
    const newItem: TechStackItem = { id: Date.now(), name: query.trim() };
    onSelect?.(newItem);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* 검색 입력 필드 */}
      <InputField
        label={label}
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
      />

      {/* 검색 결과 드롭다운 — isOpen이 true일 때만 렌더링 */}
      {isOpen && (
        <ul className="absolute top-full w-full left-0 mt-2 z-10 border border-gray-300 bg-white rounded-[5px] overflow-auto max-h-40">
          {filteredList.length > 0 ? (
            // 검색어에 매칭되는 기술스택 리스트 렌더링
            filteredList.map((item) => (
              <li
                key={item.id}
                className="px-3 py-4 cursor-pointer"
                onClick={() => handleSelect(item)}
              >
                <HighlightedName name={item.name} query={query} />
              </li>
            ))
          ) : (
            // 매칭 결과가 없을 때 "Add New Item" 표시
            <li
              className="px-3 py-4 cursor-pointer font-semibold text-indigo flex gap-2"
              onClick={handleAddNewItem}
            >
              <AddIcon width={20} height={20} />
              <span>Add New Item</span>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
