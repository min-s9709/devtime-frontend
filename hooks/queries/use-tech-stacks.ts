import { getTechStacks } from "@/apis/tech-stack";
import { useQuery } from "@tanstack/react-query";

export const useTechStacks = (keyword: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["tech-stacks", keyword],
    queryFn: () => getTechStacks(keyword),
    enabled: keyword.length > 0, // 빈 검색어일 땐 요청을 보내지 않는다.
  });

  return { techStacks: data?.results ?? [], isLoading };
};
