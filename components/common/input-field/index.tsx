import { cn } from "@/utils/cn";
import { ComponentProps, useId } from "react";

interface InputProps extends ComponentProps<"input"> {
  label?: string;
  placeholder: string;
  className?: string;
}

const base =
  "w-full h-11 bg-gray-50 py-4 px-2 rounded-md text-body font-medium text-gray-600 focus:text-black placeholder:text-gray-300 outline-none";

export default function InputField({
  label,
  placeholder,
  className,
  type = "text",
  id: idProp,
  ...props
}: InputProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={id} className="text-body-sm font-medium text-gray-600">
          {label}
        </label>
      )}
      <input
        id={id}
        placeholder={placeholder}
        className={cn(base, className)}
        type={type}
        {...props}
      />
    </div>
  );
}
