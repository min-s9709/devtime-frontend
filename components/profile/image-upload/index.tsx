import AddIcon from "@/assets/icons/plus.svg";
import { cn } from "@/utils/cn";
import Image from "next/image";
import { startTransition, useEffect, useRef, useState } from "react";

interface ImageUploadProps {
  value?: File | null;
  onChange?: (file: File | null) => void;
}

// TODO: 이미지 업로드 api 연동 및 presignedURL 적용

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!value) {
      startTransition(() => setPreviewUrl(null));
      return;
    }

    const url = URL.createObjectURL(value);
    startTransition(() => setPreviewUrl(url));

    return () => URL.revokeObjectURL(url);
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    // 같은 파일을 다시 선택할 수 있도록 value 초기화
    e.target.value = "";

    if (!file) return;

    const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg"];
    if (!ALLOWED_TYPES.includes(file.type)) {
      alert("png, jpg 파일만 업로드 가능합니다.");
      return;
    }

    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      alert("5MB 이하의 파일만 업로드 가능합니다.");
      return;
    }

    onChange?.(file);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-body-sm font-medium text-gray-600">
        프로필 이미지
      </label>
      <div className="flex gap-3 items-end">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          aria-label="프로필 이미지 업로드"
          aria-describedby="profile-image-help"
          className={cn(
            "relative w-30 h-30 border border-dashed border-primary rounded-lg cursor-pointer overflow-hidden",
            previewUrl && "border-none",
          )}
        >
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="프로필 미리보기"
              fill
              className="object-cover"
            />
          ) : (
            <AddIcon
              width={36}
              height={36}
              className="text-primary absolute inset-0 m-auto block"
            />
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".png,.jpg,.jpeg"
            className="hidden"
            onChange={handleFileChange}
          />
        </button>
        <span id="profile-image-help" className="text-body-sm text-gray-500">
          5MB 미만의 .png .jpg 파일
        </span>
      </div>
    </div>
  );
}
