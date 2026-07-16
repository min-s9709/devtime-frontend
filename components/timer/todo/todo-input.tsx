"use client";

import Button from "@/components/common/button";
import InputField from "@/components/common/input-field";
import { cn } from "@/utils/cn";
import { ComponentProps, useId, useState } from "react";

interface TodoInputProps
  extends Omit<ComponentProps<"input">, "value" | "onChange"> {
  label?: string;
  placeholder?: string;
  onAdd?: (value: string) => void;
  className?: string;
}

export default function TodoInput({
  label,
  placeholder = "할 일을 추가해 주세요",
  onAdd,
  className,
  id: idProp,
  ...props
}: TodoInputProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;

  const [value, setValue] = useState("");
  const hasValue = value.trim().length > 0;

  const handleAdd = () => {
    if (!hasValue) return;
    onAdd?.(value.trim());
    setValue("");
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={id} className="text-body-sm font-medium text-gray-600">
          {label}
        </label>
      )}
      <div className={cn("flex items-center rounded-md bg-gray-100", className)}>
        <div className="flex-1">
          <InputField
            id={id}
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              // IME 조합 중 Enter(한글 확정)는 무시해 중복 추가 방지
              if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                e.preventDefault();
                handleAdd();
              }
            }}
            className="bg-transparent"
            {...props}
          />
        </div>
        <Button
          variant="Tertiary"
          value="추가"
          onClick={handleAdd}
          disabled={!hasValue}
          className="bg-transparent hover:shadow-none active:shadow-none disabled:bg-transparent"
        />
      </div>
    </div>
  );
}
