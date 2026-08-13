import { ENDPOINTS } from "@/constants/endpoints";
import { UpdateStudyLogRequest } from "@/types/request";
import {
  GetAllStudyLogsResponse,
  GetStudyLogsResponse,
  UpdateStudyLogResponse,
} from "@/types/response";
import { httpClient } from "./api-client";

export const getStudyLog = (id: string) =>
  httpClient.get<GetStudyLogsResponse>(`${ENDPOINTS.STUDY_LOGS}/${id}`);

export const updateStudyLog = (id: string, data: UpdateStudyLogRequest) =>
  httpClient.put<UpdateStudyLogResponse>(`${id}/tasks`, data);

export const getAllStudyLogs = (pageNum: number, size = 10, date?: string) => {
  const queryParams = date
    ? `page=${pageNum}&limit=${size}&date=${date}`
    : `page=${pageNum}&limit=${size}`;

  return httpClient.get<GetAllStudyLogsResponse>(
    `${ENDPOINTS.STUDY_LOGS}?${queryParams}`,
  );
};

export const deleteStudyLog = (id: string) =>
  httpClient.delete(`${ENDPOINTS.STUDY_LOGS}/${id}`);
