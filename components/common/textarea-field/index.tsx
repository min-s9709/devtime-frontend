import { cn } from "@/utils/cn";
import { ComponentProps, useId } from "react";

interface TextAreaProps extends ComponentProps<"textarea"> {
  label?: string;
  placeholder: string;
  className?: string;
}

const base =
  "w-full bg-gray-50 py-4 px-2 rounded-md text-body font-medium text-gray-600 focus:text-black placeholder:text-gray-300 outline-none resize-none";

export default function TextAreaField({
  label,
  placeholder,
  className,
  id: idProp,
  ...props
}: TextAreaProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={id} className="text-label font-medium text-gray-600">
          {label}
        </label>
      )}
      <textarea
        id={id}
        placeholder={placeholder}
        className={cn(base, className)}
        {...props}
      />
    </div>
  );
}
