import Button from "@/components/common/button";
import InputField from "@/components/common/input-field";
import { useFormContext } from "react-hook-form";

interface DuplicatedCheckFieldProps {
  type: string;
  id: string;
  label: string;
  placeholder: string;
}

export default function DuplicatedCheckField({
  type,
  id,
  label,
  placeholder,
}: DuplicatedCheckFieldProps) {
  const { register } = useFormContext();

  const handleDuplicateClick = async (type: string) => {
    // 이메일이나 닉네임 중복확인 API 호출 필요 (type을 통해 구분)
    console.log("클릭", type);
  };

  return (
    <section>
      <label htmlFor={id} className="text-label font-medium text-gray-600">
        {label}
      </label>
      <div className="flex gap-2">
        <InputField
          {...register(type)}
          id={id}
          placeholder={placeholder}
          className="w-82"
        />
        <Button
          variant="Secondary"
          value="중복 확인"
          className="w-21 h-11 text-body-sm"
          onClick={() => handleDuplicateClick(type)}
        />
      </div>
    </section>
  );
}
