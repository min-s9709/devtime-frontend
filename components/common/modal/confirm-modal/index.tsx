"use client";

import Button from "@/components/common/button";
import { useModalStore } from "@/store/use-modal-store";

interface ConfirmModalProps {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export default function ConfirmModal({
  title,
  description,
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const close = useModalStore((state) => state.close);

  const handleConfirm = () => {
    onConfirm?.();
    close();
  };

  const handleCancel = () => {
    onCancel?.();
    close();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        {title && (
          <h2 className="font-semibold text-gray-800 text-title">{title}</h2>
        )}
        {description && (
          <p className="text-body text-gray-600 whitespace-pre-line">
            {description}
          </p>
        )}
      </div>
      <div className="flex gap-4 self-end">
        <Button variant="Tertiary" value={cancelText} onClick={handleCancel} />
        <Button variant="Primary" value={confirmText} onClick={handleConfirm} />
      </div>
    </div>
  );
}
