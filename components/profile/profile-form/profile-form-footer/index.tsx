import Button from "@/components/common/button";

export default function ProfileFormFooter() {
  return (
    <section>
      <Button
        type="submit"
        variant="Primary"
        value="저장하기"
        className="w-full"
      />
      <div className="flex justify-center gap-3 mt-6">
        <span className="text-body font-regular text-primary">
          다음에 하시겠어요?
        </span>
        <span
          onClick={() => console.log("클릭")}
          className="text-body font-bold text-primary cursor-pointer"
        >
          건너뛰기
        </span>
      </div>
    </section>
  );
}
