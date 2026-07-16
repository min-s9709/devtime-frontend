"use client";

import DefaultProfileImage from "@/assets/default-profile-image.png";
import LogoutIcon from "@/assets/icons/logout.svg";
import UserIcon from "@/assets/icons/user.svg";
import { PATH } from "@/constants/path";
import { useLogout } from "@/hooks/queries/use-logout";
import type { Profile } from "@/types/response";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface UserBadgeProps {
  profile: Profile;
}

const menuItemClass =
  "flex w-full cursor-pointer items-center gap-4 px-6 py-4 text-body font-medium text-gray-600 hover:bg-gray-50";

// 로그인 상태일 때 NavBar에 표시하는 프로필 뱃지. 클릭하면 마이페이지/로그아웃
// 드롭다운이 펼쳐진다. 프로필 미설정 유저는 기본 이미지로 대체한다.
export default function UserBadge({ profile }: UserBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { logout } = useLogout();

  // 바깥 클릭 시 닫기
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="flex cursor-pointer items-center gap-3"
      >
        <Image
          src={profile.profile?.profileImage || DefaultProfileImage}
          alt={`${profile.nickname} 프로필 이미지`}
          width={40}
          height={40}
          className="size-10 rounded-full object-cover"
        />
        <span className="font-bold text-body text-indigo">
          {profile.nickname}
        </span>
      </button>

      {isOpen && (
        <ul
          role="menu"
          className="absolute right-0 z-10 mt-2 w-40 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-1"
        >
          <li role="none">
            <Link
              role="menuitem"
              href={PATH.MYPAGE}
              onClick={() => setIsOpen(false)}
              className={menuItemClass}
            >
              <UserIcon className="w-6 h-6" />
              마이페이지
            </Link>
          </li>
          <li role="none" className="mx-6 border-t border-gray-300" />
          <li role="none">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className={menuItemClass}
            >
              <LogoutIcon className="w-6 h-6" />
              로그아웃
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
