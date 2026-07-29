import { ENDPOINTS } from "@/constants/endpoints";
import {
  StartTimerRequest,
  StopTimerRequest,
  UpdateTimerRequest,
} from "@/types/request";
import {
  GetTimerResponse,
  StartTimerResponse,
  StopTimerResponse,
  UpdateTimerResponse,
} from "@/types/response";
import { httpClient } from "./api-client";

export const getTimer = () =>
  httpClient.get<GetTimerResponse>(ENDPOINTS.TIMERS);

export const startTimer = (data: StartTimerRequest) =>
  httpClient.post<StartTimerResponse>(ENDPOINTS.TIMERS, data);

export const deleteTimer = (timerId: string) =>
  httpClient.delete(`${ENDPOINTS.TIMERS}/${timerId}`);

export const updateTimer = (timerId: string, data: UpdateTimerRequest) =>
  httpClient.put<UpdateTimerResponse>(`${ENDPOINTS.TIMERS}/${timerId}`, data);

export const stopTimer = (timerId: string, data: StopTimerRequest) =>
  httpClient.post<StopTimerResponse>(
    `${ENDPOINTS.TIMERS}/${timerId}/stop`,
    data,
  );
