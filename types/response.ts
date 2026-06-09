export interface CheckDuplicateResponse {
  success: boolean;
  available: boolean;
  message: string;
}

export interface SignupResponse {
  success: boolean;
  message: string;
}

// 브라우저로 내려오는 로그인 응답. refreshToken은 BFF가 HttpOnly 쿠키로
// 처리하므로 클라이언트 응답 바디에는 포함되지 않는다.
export interface LoginResponse {
  success: boolean;
  message: string;
  accessToken: string;
  isFirstLogin: boolean;
  isDuplicateLogin: boolean;
}

// 백엔드 원본 로그인 응답(서버 측 Route Handler에서만 사용). refreshToken 포함.
export interface BackendLoginResponse extends LoginResponse {
  refreshToken: string;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  accessToken: string;
}
