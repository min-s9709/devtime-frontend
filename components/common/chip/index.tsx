import CancelIcon from "@/assets/icons/cancel.svg";

interface ChipProps {
  id: number;
  name: string;
  onDelete?: (id: number) => void;
}

export default function Chip({ id, name, onDelete }: ChipProps) {
  const handleClick = (id: number) => {
    onDelete?.(id);
  };

  return (
    <div className="flex gap-2 items-center p-3 bg-primary-light-10 rounded-[5px] border border-primary ">
      <span className="text-primary text-body-sm font-semibold ">{name}</span>
      <CancelIcon
        width={20}
        height={20}
        className="text-primary cursor-pointer"
        onClick={() => handleClick(id)}
      />
    </div>
  );
}
