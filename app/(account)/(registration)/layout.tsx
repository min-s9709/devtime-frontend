import MainLogo from "@/assets/icons/main-logo.svg";

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen flex">
      <section className="w-1/2 bg-primary flex items-center justify-center">
        <div className="flex flex-col gap-6 items-center">
          <MainLogo width={264} height={200} className="[&_path]:fill-white" />
          <span className="text-white">
            개발자를 위한 타이머 및 학습 대시보드
          </span>
        </div>
      </section>
      <section className="w-1/2 flex items-center justify-center">
        {children}
      </section>
    </div>
  );
}
