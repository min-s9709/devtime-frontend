import { ENDPOINTS } from "@/constants/endpoints";
import {
  CreateProfileRequest,
  PresignedUrlRequest,
  UpdateProfileRequest,
} from "@/types/request";
import {
  BaseResponse,
  CreateProfileResponse,
  PresignedUrlResponse,
  ProfileResponse,
} from "@/types/response";
import { httpClient } from "./api-client";

export const getProfile = () =>
  httpClient.get<ProfileResponse>(ENDPOINTS.PROFILE);

export const getPresignedUrl = (data: PresignedUrlRequest) =>
  httpClient.post<PresignedUrlResponse>(ENDPOINTS.PRESIGNED_URL, data);

// presignedUrl로 스토리지에 직접 PUT. prefixUrl·인증 헤더가 붙는 httpClient(ky)를
// 쓰면 안 되므로 순수 fetch를 사용한다.
export const uploadFileToPresignedUrl = async (
  presignedUrl: string,
  file: File,
) => {
  const res = await fetch(presignedUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!res.ok) {
    throw new Error("이미지 업로드에 실패했습니다.");
  }
};

export const createProfile = (data: CreateProfileRequest) =>
  httpClient.post<CreateProfileResponse>(ENDPOINTS.PROFILE, data);

export const updateProfile = (data: UpdateProfileRequest) =>
  httpClient.put<BaseResponse>(ENDPOINTS.PROFILE, data);
