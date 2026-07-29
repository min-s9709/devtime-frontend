// 모든 API 응답이 공유하는 기본 형태
export interface BaseResponse {
  success: boolean;
  message: string;
}

// 구조가 동일한 응답들은 별칭으로 의미상 이름만 유지한다.
export type SignupResponse = BaseResponse;
export type LogoutResponse = BaseResponse;
export type CreateProfileResponse = BaseResponse;
export type UpdateStudyLogResponse = BaseResponse;

export interface CheckDuplicateResponse extends BaseResponse {
  available: boolean;
}

// 브라우저로 내려오는 로그인 응답. refreshToken은 BFF가 HttpOnly 쿠키로
// 처리하므로 클라이언트 응답 바디에는 포함되지 않는다.
export interface LoginResponse extends BaseResponse {
  accessToken: string;
  isFirstLogin: boolean;
  isDuplicateLogin: boolean;
}

// 백엔드 원본 로그인 응답(서버 측 Route Handler에서만 사용). refreshToken 포함.
export interface BackendLoginResponse extends LoginResponse {
  refreshToken: string;
}

// message가 없는 예외 케이스라 BaseResponse를 상속하지 않는다.
export interface RefreshTokenResponse {
  success: boolean;
  accessToken: string;
}

export interface PresignedUrlResponse {
  presignedUrl: string;
  key: string;
}

export interface Profile {
  email: string;
  nickname: string;
  // 프로필 설정을 건너뛴(또는 최초 로그인) 유저는 이 필드가 없다.
  profile?: {
    career: string;
    purpose: string;
    goal: string;
    techStacks: string[];
    profileImage: string;
  };
}

export type ProfileResponse = Profile;

export interface TechStack {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface TechStacksResponse {
  results: TechStack[];
}

// POST /tech-stacks 응답: 생성된 항목을 techStack으로 감싸 반환한다.
export interface CreateTechStackResponse {
  message: string;
  techStack: TechStack;
}

export interface GetTimerResponse {
  timerId: string;
  studyLogId: string;
  splitTimes: { date: string; timeSpent: number }[];
  startTime: string;
  lastUpdateTime: string;
}

export interface GetStudyLogsResponse {
  success: boolean;
  data: {
    id: string;
    date: string;
    todayGoal: string;
    studyTime: number;
    tasks: { id: string; content: string; isCompleted: boolean }[];
    review: string;
    completionRate: number;
  };
}

export interface StartTimerResponse {
  message: string;
  studyLogId: string;
  timerId: string;
  startTime: string; // ex) "2026-07-22T05:28:04.187Z"
}

export interface UpdateTimerResponse {
  message: string;
  startTime: string;
  splitTimes: { date: string; timeSpent: number }[];
  lastUpdateTime: string;
}

export interface StopTimerResponse {
  message: string;
  totalTime: number;
  endTime: string;
}
