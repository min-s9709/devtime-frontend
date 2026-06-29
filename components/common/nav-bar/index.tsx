"use client";

import NavLogo from "@/assets/icons/nav-logo.svg";
import { PATH } from "@/constants/path";
import { useProfileStore } from "@/store/use-profile-store";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserBadge from "./user-badge";

const NAV_LINKS = [
  { href: PATH.DASHBOARD, label: "대시보드" },
  { href: PATH.RANKING, label: "랭킹" },
] as const;

const AUTH_LINKS = [
  { href: PATH.LOGIN, label: "로그인" },
  { href: PATH.SIGNUP, label: "회원가입" },
] as const;

const linkClass = "text-body text-indigo";

export default function NavBar() {
  const pathname = usePathname();
  const profile = useProfileStore((state) => state.profile);

  return (
    <header className="flex items-center justify-between py-4">
      <nav className="flex items-center gap-12">
        <Link href={PATH.HOME}>
          <NavLogo />
        </Link>
        <ul className="flex gap-9">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={`${linkClass} ${
                    isActive
                      ? "font-bold underline underline-offset-4"
                      : "font-semibold"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      {profile ? (
        <UserBadge profile={profile} />
      ) : (
        <ul className="flex gap-9">
          {AUTH_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className={`${linkClass} font-semibold`}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
