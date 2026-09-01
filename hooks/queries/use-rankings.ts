import { getRankings } from "@/apis/ranking";
import { rankingKeys } from "@/constants/query-keys";
import { useAuthStore } from "@/store/use-auth-store";
import { RankingSortBy } from "@/types/request";
import { useInfiniteQuery } from "@tanstack/react-query";

const PAGE_SIZE = 10;

// 전체 유저 랭킹 목록(무한스크롤). 정렬 기준(total/avg)마다 캐시가 분리된다.
export const useRankings = (sortBy: RankingSortBy) => {
  const accessToken = useAuthStore((s) => s.accessToken);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isError,
  } = useInfiniteQuery({
    queryKey: rankingKeys.list(sortBy),
    queryFn: ({ pageParam }) => getRankings(pageParam, PAGE_SIZE, sortBy),
    initialPageParam: 1,
    // 서버가 내려주는 hasNext로만 다음 페이지 여부를 판단한다.
    getNextPageParam: (lastPage) => {
      const { currentPage, hasNext } = lastPage.data.pagination;

      return hasNext ? currentPage + 1 : undefined;
    },
    enabled: !!accessToken, // silent refresh로 토큰이 채워진 뒤에만 조회
    staleTime: 60 * 1000,
  });

  return {
    // 페이지별 응답을 하나의 목록으로 펼쳐 순위 순서를 유지한다.
    rankings: data?.pages.flatMap((page) => page.data.rankings),
    totalItems: data?.pages[0]?.data.pagination.totalItems,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    // enabled:false(토큰 대기) 구간도 로딩으로 덮기 위해 isLoading이 아닌 isPending을 쓴다.
    isPending,
    isError,
  };
};
