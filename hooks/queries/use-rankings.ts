import { getRankings } from "@/apis/ranking";
import { rankingKeys } from "@/constants/query-keys";
import { useAuthStore } from "@/store/use-auth-store";
import { RankingSortBy } from "@/types/request";
import { GetRankingsResponse } from "@/types/response";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";

const PAGE_SIZE = 10;

// 페이지들을 하나의 목록으로 펼치면서 userId가 겹치는 항목을 걸러낸다.
// offset 페이지네이션이라 요청 사이에 순위가 밀리면 같은 유저가 두 페이지에
// 걸쳐 올 수 있고, 그대로 두면 key 중복으로 카드가 두 번 그려진다.
// (반대로 순위가 올라가 건너뛴 유저는 클라이언트에서 복구할 수 없다 — 백엔드 과제)
//
// 컴포넌트 밖에 두어 참조를 고정한다. 인라인 함수로 넘기면 매 렌더 select가
// 다시 실행돼 목록 배열이 새로 만들어지고, RankingCard의 memo가 무력화된다.
const selectRankings = (data: InfiniteData<GetRankingsResponse, number>) => {
  const seen = new Set<string>();

  return data.pages
    .flatMap((page) => page.data.rankings)
    .filter((item) => {
      if (seen.has(item.userId)) return false;

      seen.add(item.userId);
      return true;
    });
};

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
    select: selectRankings,
    enabled: !!accessToken, // silent refresh로 토큰이 채워진 뒤에만 조회
    staleTime: 60 * 1000,
    // infinite query는 refetch 때 누적된 페이지를 처음부터 순차적으로 전부 다시
    // 가져온다(2페이지 요청 번호가 1페이지 응답에서 나와 병렬 불가). 10페이지를 본
    // 뒤 탭을 옮겼다 돌아오면 요청이 10번 나가고, 그 사이 순위가 바뀌었다면 보고
    // 있던 목록이 통째로 갈아엎인다. 랭킹은 초 단위 최신성이 필요 없어 끈다.
    refetchOnWindowFocus: false,
  });

  return {
    rankings: data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    // enabled:false(토큰 대기) 구간도 로딩으로 덮기 위해 isLoading이 아닌 isPending을 쓴다.
    isPending,
    isError,
  };
};
