export interface SignupRequest {
  email: string;
  nickname: string;
  password: string;
  confirmPassword: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface PresignedUrlRequest {
  fileName: string;
  contentType: string;
}

export interface CreateProfileRequest {
  career: string;
  purpose: string;
  goal: string;
  techStacks: string[];
  profileImage: string;
}

export interface CreateTechStackRequest {
  name: string;
}

export interface StartTimerRequest {
  todayGoal: string;
  tasks: string[];
}

export interface UpdateTimerRequest {
  splitTimes: { date: string; timeSpent: number }[];
}

export interface StopTimerRequest {
  splitTimes: { date: string; timeSpent: number }[];
  review: string;
  tasks: { content: string; isCompleted: boolean }[];
}

export interface UpdateStudyLogRequest {
  tasks: { content: string; isCompleted: boolean }[];
}

// 공부 목적이 '기타'일 때의 전송 형태. (표준 옵션은 문자열 그대로)
export interface CustomPurpose {
  type: "기타";
  detail: string;
}

// PUT /api/profile은 부분 업데이트다. 실제로 바뀐 필드만 담아 보낸다.
// - nickname: 값이 실제로 바뀐 경우에만 (현재 닉네임을 그대로 보내도 중복으로 400)
// - password: 변경 시에만
// - profileImage: 새로 업로드한 S3 key만 (GET 응답의 전체 URL을 되돌려 보내면 안 됨)
// - techStacks: 최종 목록 전체(전체 교체)
export interface UpdateProfileRequest {
  nickname?: string;
  password?: string;
  career?: string;
  purpose?: string | CustomPurpose;
  goal?: string;
  techStacks?: string[];
  profileImage?: string;
}

// GET /api/ranking?sortBy= 값. total: 총 학습 시간, avg: 일 평균 학습 시간
export type RankingSortBy = "total" | "avg";
