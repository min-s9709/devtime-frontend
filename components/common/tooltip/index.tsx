"use client";

import { cn } from "@/utils/cn";
import { ReactNode, useId, useState } from "react";

type TooltipPlacement = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  /** 툴팁에 표시할 내용 */
  content: ReactNode;
  /** 툴팁이 뜨는 방향 (기본값: top) */
  placement?: TooltipPlacement;
  /** 툴팁 말풍선에 추가할 클래스 */
  className?: string;
  /** 툴팁을 띄우는 트리거 요소 */
  children: ReactNode;
}

const placementStyles: Record<TooltipPlacement, string> = {
  top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
  bottom: "top-full left-1/2 mt-2 -translate-x-1/2",
  left: "right-full top-1/2 mr-2 -translate-y-1/2",
  right: "left-full top-1/2 ml-2 -translate-y-1/2",
};

export default function Tooltip({
  content,
  placement = "bottom",
  className,
  children,
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const tooltipId = useId();

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <span aria-describedby={open ? tooltipId : undefined}>{children}</span>
      {open && (
        <span
          role="tooltip"
          id={tooltipId}
          className={cn(
            "pointer-events-none absolute z-50 w-max max-w-xs rounded-lg bg-gray-800 px-2 py-1 text-body-sm font-medium text-white shadow-1",
            placementStyles[placement],
            className,
          )}
        >
          {content}
        </span>
      )}
    </span>
  );
}
