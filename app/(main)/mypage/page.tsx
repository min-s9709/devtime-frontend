import MypageContent from "@/components/mypage/mypage-content";

import { PATH } from "@/constants/path";
import { createMetadata } from "@/utils/create-metadata";

// 로그인한 본인의 회원정보·프로필만 보여주므로 색인 대상이 아니다.
export const metadata = createMetadata({
  title: "마이페이지",
  description: "회원정보와 개인 프로필을 확인하고 수정하세요.",
  path: PATH.MYPAGE,
  noIndex: true,
});

export default function MyPage() {
  return (
    <div className="w-full py-10">
      <MypageContent />
    </div>
  );
}
