import { cn } from "@/utils/cn";

interface TagProps {
  name: string;
  className?: string;
}

const base =
  "inline-flex items-center font-medium text-body text-gray-500 bg-gray-100 rounded-[5px] py-1 px-2";

export default function Tag({ name, className }: TagProps) {
  return <span className={cn(base, className)}>{name}</span>;
}
