import { cn } from "@/utils/cn";
import { ComponentProps } from "react";

interface ButtonProps extends ComponentProps<"button"> {
  variant: keyof typeof themeVariants;
  value: string;
  className?: string;
}

const base =
  "w-full h-12 rounded-[5px] text-subtitle py-3 px-4 cursor-pointer font-semibold outline-none";

const themeVariants = {
  Primary: `${base} bg-primary text-white hover:shadow-overlay active:shadow-overlay disabled:bg-gray-400 disabled:text-gray-300 disabled:cursor-not-allowed`,
  Secondary: `${base} bg-primary-10 text-primary hover:shadow-overlay active:shadow-overlay disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed`,
  Tertiary: `${base} bg-gray-50 text-primary hover:shadow-overlay active:shadow-overlay disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed`,
};

export default function Button({
  variant = "Primary",
  value,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(themeVariants[variant], className)}
      type={type}
      {...props}
    >
      {value}
    </button>
  );
}
