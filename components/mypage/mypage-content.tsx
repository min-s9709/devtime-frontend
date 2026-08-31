"use client";

import ProfileEditForm from "@/components/mypage/profile-edit-form";
import ProfileView from "@/components/mypage/profile-view";
import { useState } from "react";

// 마이페이지 조회 ↔ 수정 모드 전환. '회원정보 수정' 클릭 시 폼으로 바뀌고,
// 저장/취소하면 다시 조회 화면으로 돌아온다. (라우트 이동 없음)
export default function MypageContent() {
  const [isEditing, setIsEditing] = useState(false);

  return isEditing ? (
    <ProfileEditForm onDone={() => setIsEditing(false)} />
  ) : (
    <ProfileView onEdit={() => setIsEditing(true)} />
  );
}
