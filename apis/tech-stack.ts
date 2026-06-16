import { ENDPOINTS } from "@/constants/endpoints";
import { CreateTechStackRequest } from "@/types/request";
import {
  CreateTechStackResponse,
  TechStacksResponse,
} from "@/types/response";
import { httpClient } from "./api-client";

export const getTechStacks = (keyword: string) =>
  httpClient.get<TechStacksResponse>(
    `${ENDPOINTS.TECH_STACKS}?keyword=${encodeURIComponent(keyword)}`,
  );

export const createTechStack = (data: CreateTechStackRequest) =>
  httpClient.post<CreateTechStackResponse>(ENDPOINTS.TECH_STACKS, data);
