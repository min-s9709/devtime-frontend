import Button from "@/components/common/button";
import HelperText from "@/components/common/helper-text";
import InputField from "@/components/common/input-field";
import { useCheckDuplicate } from "@/hooks/queries/use-check-duplicate";
import { cn } from "@/utils/cn";
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
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const fieldValue = watch(type);
  const isValid = !!fieldValue && !errors[type];
  const {
    checkDuplicate,
    isPending,
    isSuccess,
    isError,
    error,
    data,
    variables,
  } = useCheckDuplicate();

  // 마지막으로 검사한 값과 현재 입력값이 다르면 이전 결과는 무효 처리한다.
  const isResultStale = variables?.value !== fieldValue;

  const handleDuplicateClick = () => {
    checkDuplicate(
      { type, value: fieldValue },
      {
        // 중복확인에 성공(사용 가능)한 값만 폼에 기록해 제출 게이트와 연결한다.
        onSuccess: (res) => {
          if (res.available) setValue(`${type}Checked`, fieldValue);
        },
      },
    );
  };

  const getHelperText = () => {
    switch (true) {
      case !!errors[type]:
        return {
          status: "error" as const,
          message: errors[type].message as string,
        };
      case !isResultStale && isError:
        return { status: "error" as const, message: error.message };
      case !isResultStale && isSuccess && !!data:
        return {
          status: data.available ? ("success" as const) : ("error" as const),
          message: data.message,
        };
      default:
        return null;
    }
  };

  const helperText = getHelperText();

  return (
    <section>
      <label htmlFor={id} className="text-body-sm font-medium text-gray-600">
        {label}
      </label>
      <div className="flex gap-2">
        <InputField
          {...register(type, { required: true })}
          id={id}
          placeholder={placeholder}
          className={cn("w-82", errors[type] && "border border-negative")}
        />
        <Button
          variant="Secondary"
          value={isPending ? "확인 중" : "중복 확인"}
          className="w-21 h-11 text-body-sm"
          disabled={!isValid || isPending}
          onClick={handleDuplicateClick}
        />
      </div>
      {helperText && (
        <HelperText
          status={helperText.status}
          message={helperText.message}
          className="mt-2"
        />
      )}
    </section>
  );
}
