"use client";

import AddIcon from "@/assets/icons/plus.svg";
import InputField from "@/components/common/input-field";
import { useAutoComplete } from "@/hooks/use-auto-complete";
import type { TechStackItem } from "@/hooks/use-auto-complete";
import HighlightedName from "./highlighted-name";

export type { TechStackItem };

interface AutoCompleteProps {
  placeholder: string;
  label?: string;
  onSelect?: (item: TechStackItem) => void;
}

export default function AutoComplete({
  placeholder,
  label,
  onSelect,
}: AutoCompleteProps) {
  const {
    query,
    isOpen,
    containerRef,
    techStacks,
    handleChange,
    handleSelect,
    handleAddNewItem,
    handleKeyDown,
  } = useAutoComplete(onSelect);

  return (
    <div className="relative" ref={containerRef}>
      {/* 검색 입력 필드 */}
      <InputField
        label={label}
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />

      {/* 검색 결과 드롭다운 — isOpen이 true일 때만 렌더링 */}
      {isOpen && (
        <ul className="absolute top-full w-full left-0 mt-2 z-10 border border-gray-300 bg-white rounded-[5px] overflow-auto max-h-40">
          {techStacks.length > 0 ? (
            // 검색어에 매칭되는 기술스택 리스트 렌더링
            techStacks.map((item) => (
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
