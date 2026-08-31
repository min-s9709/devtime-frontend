"use client";

import DefaultProfileImage from "@/assets/default-profile-image.png";
import EditIcon from "@/assets/icons/edit.svg";
import Tag from "@/components/common/tag";
import { useProfile } from "@/hooks/queries/use-profile";
import { cn } from "@/utils/cn";
import Image from "next/image";

// 프로필 미설정(초기 설정 건너뛰기) 시 각 항목에 대신 노출할 안내 문구
const PLACEHOLDER = {
  goal: "아직 설정한 목표가 없어요.",
  career: "개발 경력을 입력해 채워주세요.",
  purpose: "공부 목적을 입력해 채워주세요.",
  techStacks: "현재 공부 중이거나 가지고 있는 개발 스택을 입력해 채워주세요.",
} as const;

// 라벨 + 값(또는 미입력 안내) 한 줄
function ProfileField({
  label,
  value,
  placeholder,
}: {
  label: string;
  value?: string;
  placeholder?: string;
}) {
  const isEmpty = !value;
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-body-sm font-semibold text-gray-400">{label}</dt>
      <dd
        className={cn(
          "text-subtitle",
          isEmpty ? "text-gray-300" : "text-gray-600",
        )}
      >
        {value || placeholder}
      </dd>
    </div>
  );
}

interface ProfileViewProps {
  onEdit?: () => void;
}

export default function ProfileView({ onEdit }: ProfileViewProps) {
  const { profile, isPending, isError } = useProfile();

  if (isPending) {
    return (
      <div className="flex w-full items-center justify-center py-20 text-body text-gray-500">
        프로필을 불러오는 중...
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="flex w-full items-center justify-center py-20 text-body text-gray-500">
        프로필을 불러오지 못했어요.
      </div>
    );
  }

  const { email, nickname } = profile;
  const detail = profile.profile;
  // 프로필 설정을 건너뛰면 detail이 없으므로 기본값으로 안전하게 접근한다.
  const techStacks = detail?.techStacks ?? [];

  return (
    <div>
      <section className="w-full rounded-2xl bg-white p-8 shadow-1">
        <div className="flex items-start gap-14">
          {/* 프로필 이미지 (미설정 시 기본 이미지로 대체) */}
          <Image
            src={detail?.profileImage || DefaultProfileImage}
            alt={`${nickname} 프로필 이미지`}
            width={120}
            height={120}
            className="h-45 w-45 shrink-0 rounded-2xl object-cover"
          />

          <div className="flex flex-1 flex-col gap-12">
            {/* 닉네임 · 공부 목표 · 회원정보 수정 */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-subtitle font-semibold text-indigo">
                  {nickname}
                </p>
                <h1
                  className={cn(
                    "text-title font-bold",
                    detail?.goal ? "text-gray-800" : "text-gray-300",
                  )}
                >
                  {detail?.goal || PLACEHOLDER.goal}
                </h1>
              </div>

              <button
                type="button"
                onClick={onEdit}
                className="flex shrink-0 cursor-pointer items-center gap-2 text-body-sm text-gray-400 hover:text-gray-600"
              >
                <EditIcon className="h-4 w-4" />
                회원정보 수정
              </button>
            </div>

            {/* 회원 정보 + 개인 프로필 정보 */}
            <dl className="flex flex-col gap-6">
              <ProfileField label="이메일 주소" value={email} />
              <ProfileField
                label="개발 경력"
                value={detail?.career}
                placeholder={PLACEHOLDER.career}
              />
              <ProfileField
                label="공부 목적"
                value={detail?.purpose}
                placeholder={PLACEHOLDER.purpose}
              />

              <div className="flex flex-col gap-1">
                <dt className="text-caption font-medium text-gray-400">
                  개발 스택
                </dt>
                <dd>
                  {techStacks.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {techStacks.map((name) => (
                        <Tag key={name} name={name} />
                      ))}
                    </div>
                  ) : (
                    <span className="text-subtitle text-gray-300">
                      {PLACEHOLDER.techStacks}
                    </span>
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </div>
  );
}
