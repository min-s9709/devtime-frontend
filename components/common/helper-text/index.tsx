import { cn } from "@/utils/cn";
import { ComponentProps } from "react";

interface HelperTextProps extends ComponentProps<"span"> {
  status: keyof typeof themeVariants;
  className?: string;
  message: string;
}

const base = "text-caption font-medium";

const themeVariants = {
  informative: `${base} text-primary`,
  error: `${base} text-negative`,
  success: `${base} text-positive`,
  neutral: `${base} text-gray-400`,
};

export default function HelperText({
  status,
  className,
  message,
  ...props
}: HelperTextProps) {
  return (
    <span {...props} className={cn(themeVariants[status], className)}>
      {message}
    </span>
  );
}
