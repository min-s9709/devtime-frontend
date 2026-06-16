import { createTechStack } from "@/apis/tech-stack";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateTechStack = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    // 응답을 언래핑해 생성된 techStack 항목만 resolve한다.
    mutationFn: async (name: string) => {
      const { techStack } = await createTechStack({ name });
      return techStack;
    },
    onSuccess: () => {
      // 새로 만든 키워드가 이후 검색 결과에 반영되도록 캐시를 무효화한다.
      queryClient.invalidateQueries({ queryKey: ["tech-stacks"] });
    },
  });

  return { createTechStack: mutateAsync, isCreating: isPending };
};
