import { useAuthStore } from "@/store/use-auth-store";
import ky, { Options, ResponsePromise } from "ky";
import { refreshAccessToken } from "./auth";

const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!rawBaseUrl) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}
export const API_BASE_URL = `${rawBaseUrl.replace(/\/+$/, "")}/api/`;

let refreshPromise: Promise<string | null> | null = null;

const http = ky.create({
  prefixUrl: API_BASE_URL,
  timeout: 10000,
  retry: 0,
  credentials: "include",
  hooks: {
    beforeRequest: [
      (request) => {
        const accessToken = useAuthStore.getState().accessToken;
        if (accessToken) {
          request.headers.set("Authorization", `Bearer ${accessToken}`);
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status !== 401) return;

        if (!refreshPromise) {
          refreshPromise = refreshAccessToken().finally(() => {
            refreshPromise = null;
          });
        }

        const newAccessToken = await refreshPromise;
        if (!newAccessToken) return;

        request.headers.set("Authorization", `Bearer ${newAccessToken}`);
        return ky(request, options);
      },
    ],
    beforeError: [],
  },
});

// 공통 응답 파싱 함수
async function parseResponse<T>(res: ResponsePromise): Promise<T> {
  return await res.json<T>();
}

const normalizePath = (url: string) => url.replace(/^\/+/, "");

// API 호출 (GET, POST, PUT, DELETE 등) 별로 일관 된 처리를 할 수 있는 래퍼 함수 작성
export const httpClient = {
  get: <T>(url: string, options?: Options) =>
    parseResponse<T>(http.get(normalizePath(url), options)),

  post: <T>(url: string, body?: unknown, options?: Options) =>
    parseResponse<T>(
      http.post(normalizePath(url), {
        ...(body !== undefined && { json: body }),
        ...options,
      }),
    ),

  put: <T>(url: string, body?: unknown, options?: Options) =>
    parseResponse<T>(
      http.put(normalizePath(url), {
        ...(body !== undefined && { json: body }),
        ...options,
      }),
    ),

  patch: <T>(url: string, body?: unknown, options?: Options) =>
    parseResponse<T>(
      http.patch(normalizePath(url), {
        ...(body !== undefined && { json: body }),
        ...options,
      }),
    ),

  delete: <T>(url: string, options?: Options) =>
    parseResponse<T>(http.delete(normalizePath(url), options)),
};
