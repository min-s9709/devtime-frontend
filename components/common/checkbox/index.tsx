import CheckIcon from "@/assets/icons/check.svg";
import { cn } from "@/utils/cn";
import { ComponentProps } from "react";

interface CheckboxProps extends ComponentProps<"input"> {
  className?: string;
}

const base =
  "w-4.5 h-4.5 peer appearance-none border border-primary rounded-[5px] checked:bg-primary-10 checked:text-primary";

export default function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <div className="relative w-4.5 h-4.5">
      <input type="checkbox" className={cn(base, className)} {...props} />
      <CheckIcon className="absolute inset-0 m-auto pointer-events-none text-primary hidden peer-checked:block" />
    </div>
  );
}
