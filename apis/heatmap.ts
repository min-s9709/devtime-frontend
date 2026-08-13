import { ENDPOINTS } from "@/constants/endpoints";
import { GetStudyHeatmapResponse } from "@/types/response";
import { httpClient } from "./api-client";

export const getStudyHeatmap = () =>
  httpClient.get<GetStudyHeatmapResponse>(ENDPOINTS.STUDY_HEATMAP);
