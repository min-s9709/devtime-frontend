import { ENDPOINTS } from "@/constants/endpoints";
import { UpdateStudyLogRequest } from "@/types/request";
import { GetStudyLogsResponse, UpdateStudyLogResponse } from "@/types/response";
import { httpClient } from "./api-client";

export const getStudyLog = (studyLogId: string) =>
  httpClient.get<GetStudyLogsResponse>(`${ENDPOINTS.STUDY_LOGS}/${studyLogId}`);

export const updateStudyLog = (
  studyLogId: string,
  data: UpdateStudyLogRequest,
) => httpClient.put<UpdateStudyLogResponse>(`${studyLogId}/tasks`, data);
