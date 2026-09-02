import { ENDPOINTS } from "@/constants/endpoints";
import { RankingSortBy } from "@/types/request";
import { GetRankingsResponse } from "@/types/response";
import { httpClient } from "./api-client";

export const getRankings = (
  pageNum: number,
  limit = 10,
  sortBy: RankingSortBy = "total",
) => {
  const queryParams = `sortBy=${sortBy}&page=${pageNum}&limit=${limit}`;

  return httpClient.get<GetRankingsResponse>(
    `${ENDPOINTS.RANKING}?${queryParams}`,
  );
};
