"use client";

import Tooltip from "@/components/common/tooltip";
import { cn } from "@/utils/cn";
import { ReactNode } from "react";

interface ControlButtonProps {
  label: string; // tooltip + aria-label
  icon: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "plain" | "round"; // 메인 컨트롤 / 보조(원형) 버튼
  className?: string; // 색상 등 오버라이드
}

const variants = {
  plain: "transition-transform hover:scale-105",
  round:
    "flex h-16 w-16 items-center justify-center rounded-full bg-white text-primary shadow-1 transition-transform hover:scale-105",
};

export default function ControlButton({
  label,
  icon,
  onClick,
  disabled,
  variant = "plain",
  className,
}: ControlButtonProps) {
  return (
    <Tooltip content={label} placement="bottom">
      <button
        type="button"
        aria-label={label}
        onClick={onClick}
        disabled={disabled}
        className={cn(variants[variant], className)}
      >
        {icon}
      </button>
    </Tooltip>
  );
}
