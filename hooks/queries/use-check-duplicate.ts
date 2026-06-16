import { checkDuplicate } from "@/apis/auth";
import { useMutation } from "@tanstack/react-query";
import { HTTPError } from "ky";

interface CheckDuplicateParams {
  type: string;
  value: string;
}

export const useCheckDuplicate = () => {
  const { mutate, ...rest } = useMutation({
    mutationFn: async ({ type, value }: CheckDuplicateParams) => {
      try {
        return await checkDuplicate(type, value);
      } catch (error) {
        if (error instanceof HTTPError) {
          const body = await error.response.json();
          throw new Error(body.error?.message ?? "요청에 실패했습니다.");
        }
        throw error;
      }
    },
  });

  return { checkDuplicate: mutate, ...rest };
};
