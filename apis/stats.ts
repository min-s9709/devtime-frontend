import { ENDPOINTS } from "@/constants/endpoints";
import { GetStudyStatsResponse } from "@/types/response";
import { httpClient } from "./api-client";

export const getStudyStats = () =>
  httpClient.get<GetStudyStatsResponse>(ENDPOINTS.STUDY_STATS);
