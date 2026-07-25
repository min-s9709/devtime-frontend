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
