"use client";

import { cn } from "@/utils/cn";
import { ReactNode, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

const subscribe = () => () => {};

export default function Modal({
  isOpen,
  onClose,
  children,
  className,
}: ModalProps) {
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-dim-50"
      onClick={onClose}
    >
      <div
        className={cn(
          "bg-white rounded-md  w-full max-w-115 px-2 py-4",
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
