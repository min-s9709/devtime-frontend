import Checkbox from "@/components/common/checkbox";
import { TERMS_ARTICLES } from "@/constants";
import { useFormContext } from "react-hook-form";

export default function TermsAgreement() {
  const { register } = useFormContext();

  return (
    <section>
      <div className="flex justify-between">
        <span className="text-label font-medium text-gray-600">이용 약관</span>
        <div className="flex gap-2 items-center">
          <label htmlFor="auth-agree" className="text-label text-primary-30">
            동의함
          </label>
          <Checkbox id="auth-agree" {...register("termsAgreed")} />
        </div>
      </div>
      <div className="w-full h-27.5 px-4 py-3 rounded-[5px] overflow-auto bg-gray-50 text-caption text-gray-600">
        {TERMS_ARTICLES.map((article, index) => (
          <p
            key={`${article.title}-${index}`}
            className={index > 0 ? "mt-3" : undefined}
          >
            <span className="text-caption font-bold">{article.title}</span>
            <br />
            {article.content}
          </p>
        ))}
      </div>
    </section>
  );
}
