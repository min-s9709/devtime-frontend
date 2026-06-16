"use client";

import Button from "@/components/common/button";
import { useModalStore } from "@/store/use-modal-store";

interface AlertModalProps {
  title: string;
  description?: string;
  onConfirm?: () => void;
}

export default function AlertModal({ title, description, onConfirm }: AlertModalProps) {
  const close = useModalStore((state) => state.close);

  const handleConfirm = () => {
    onConfirm?.();
    close();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="font-semibold text-gray-800 text-title">{title}</h2>
        {description && (
          <p className="text-body text-gray-600 whitespace-pre-line">{description}</p>
        )}
      </div>
      <Button variant="Primary" value="확인" onClick={handleConfirm} className="w-full self-end" />
    </div>
  );
}