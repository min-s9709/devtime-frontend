import { useCreateTechStack } from "@/hooks/queries/use-create-tech-stack";
import { useTechStacks } from "@/hooks/queries/use-tech-stacks";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffect, useRef, useState } from "react";

export interface TechStackItem {
  id: number;
  name: string;
}

/**
 * 기술스택 autocomplete의 상호작용 로직을 담당하는 훅.
 * - 검색어 디바운스 후 GET /tech-stacks?keyword= 조회
 * - 매칭 결과가 없을 때 POST /tech-stacks로 신규 생성
 * - 드롭다운 열림/닫힘 및 외부 클릭 시 닫기 제어
 */
export function useAutoComplete(onSelect?: (item: TechStackItem) => void) {
  // 검색어 상태
  const [query, setQuery] = useState("");
  // 드롭다운 열림/닫힘 상태 — 검색어가 입력되면 true
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // 입력값을 디바운스해 검색어별로 GET /tech-stacks?keyword= 를 조회한다.
  const debouncedQuery = useDebounce(query, 300);
  const { techStacks } = useTechStacks(debouncedQuery);
  const { createTechStack, isCreating } = useCreateTechStack();

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

  // "Add New Item" 클릭/Enter 시 POST /tech-stacks로 새 기술스택을 생성하고,
  // 서버가 발급한 실제 id를 가진 항목을 부모에게 전달한다.
  const handleAddNewItem = async () => {
    const name = query.trim();
    if (!name || isCreating) return;

    const created = await createTechStack(name);
    onSelect?.(created);
    setQuery("");
    setIsOpen(false);
  };

  // 입력값이 기존 기술스택과 매칭되지 않을 때만 Enter로 신규 생성한다.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault(); // 폼 제출 방지
    if (techStacks.length === 0) handleAddNewItem();
  };

  return {
    query,
    isOpen,
    containerRef,
    techStacks,
    handleChange,
    handleSelect,
    handleAddNewItem,
    handleKeyDown,
  };
}
