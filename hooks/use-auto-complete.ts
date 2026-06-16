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
  const { techStacks, isLoading } = useTechStacks(debouncedQuery);
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

    try {
      const created = await createTechStack(name);
      onSelect?.(created);
      setQuery("");
      setIsOpen(false);
    } catch (error) {
      // 생성 실패 시 입력값과 드롭다운을 유지해 사용자가 재시도할 수 있게 한다.
      console.error("기술스택 생성에 실패했습니다.", error);
    }
  };

  // Enter로 신규 생성하려면 (1) 디바운스가 따라잡아 조회 결과가 현재 입력과
  // 일치하고(debouncedQuery === query) (2) 조회가 끝났으며(!isLoading)
  // (3) 매칭되는 기존 항목이 없어야 한다. 로딩 중 조회 결과를 신뢰해 오생성하는 것을 막는다.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault(); // 폼 제출 방지

    const isResultReady = debouncedQuery === query && !isLoading;
    if (isResultReady && techStacks.length === 0) handleAddNewItem();
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
