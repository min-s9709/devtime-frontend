import ky, { Options, ResponsePromise } from "ky";

const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!rawBaseUrl) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}
const API_BASE_URL = `${rawBaseUrl.replace(/\/+$/, "")}/api/`;

const http = ky.create({
  prefixUrl: API_BASE_URL,
  timeout: 10000,
  retry: 0,
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
  hooks: {
    // 요청 전 처리 (예: Authorization 헤더에 토큰 자동 주입)
    beforeRequest: [],

    //공통 응답 처리 (예: 401 시 토큰 갱신 또는 로그아웃)
    afterResponse: [],

    // 에러 응답 파싱 및 커스텀 에러 객체 생성
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
    parseResponse<T>(http.post(normalizePath(url), { json: body, ...options })),

  put: <T>(url: string, body?: unknown, options?: Options) =>
    parseResponse<T>(http.put(normalizePath(url), { json: body, ...options })),

  patch: <T>(url: string, body?: unknown, options?: Options) =>
    parseResponse<T>(
      http.patch(normalizePath(url), { json: body, ...options }),
    ),

  delete: <T>(url: string, options?: Options) =>
    parseResponse<T>(http.delete(normalizePath(url), options)),
};
