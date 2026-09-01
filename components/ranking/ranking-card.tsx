import DefaultProfileImage from "@/assets/default-profile-image.png";
import Tag from "@/components/common/tag";
import { RankingItem } from "@/types/response";
import { cn } from "@/utils/cn";
import { formatStudyHours } from "@/utils/format-time";
import Image from "next/image";
import { memo } from "react";

// 기획: 공부 중인 기술 스택은 최대 5개까지만 노출한다.
const MAX_VISIBLE_TECH_STACKS = 5;

// 라벨 + 값 한 쌍 (누적 / 일 평균 / 경력)
function RankingStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <dt className="text-caption font-medium text-gray-400">{label}</dt>
      <dd className="text-body-sm font-semibold text-gray-700">{value}</dd>
    </div>
  );
}

interface RankingCardProps {
  item: RankingItem;
}

function RankingCard({ item }: RankingCardProps) {
  const { rank, nickname, totalStudyTime, averageStudyTime, profile } = item;
  const isTopRank = rank <= 3;
  const techStacks = profile.techStacks.slice(0, MAX_VISIBLE_TECH_STACKS);

  return (
    <article className="flex gap-5 rounded-2xl bg-white p-6">
      {/* 순위 뱃지 + 프로필 이미지 */}
      <div className="flex w-15 shrink-0 flex-col items-center gap-3">
        <span
          className={cn(
            "rounded-md px-2.5 py-1 text-body-sm font-bold",
            isTopRank ? "bg-primary text-white" : "bg-primary-10 text-primary",
          )}
        >
          {rank}위
        </span>

        <Image
          src={profile.profileImage || DefaultProfileImage}
          alt={`${nickname} 프로필 이미지`}
          width={60}
          height={60}
          className="h-15 w-15 rounded-full object-cover"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <p className="text-subtitle font-bold text-primary">{nickname}</p>

        {/* 공부 목적 (프로필 미설정 유저는 비어 있을 수 있다) */}
        {profile.purpose && (
          <p className="truncate text-body-sm text-primary-light">
            &ldquo;{profile.purpose}&rdquo;
          </p>
        )}

        <dl className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
          <RankingStat label="누적" value={formatStudyHours(totalStudyTime)} />
          <RankingStat
            label="일 평균"
            value={formatStudyHours(averageStudyTime, 1)}
          />
          {profile.career && (
            <RankingStat label="경력" value={profile.career} />
          )}
        </dl>

        {techStacks.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {techStacks.map((techStack) => (
              <Tag key={techStack.id} name={techStack.name} />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

// 다음 페이지를 이어 붙일 때 이미 그려진 카드까지 전부 리렌더되지 않도록 막는다.
// react-query의 구조적 공유 덕에 기존 페이지의 item 참조가 그대로 유지돼 memo가 먹는다.
export default memo(RankingCard);
