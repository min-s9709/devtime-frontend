import LoginBgLogo from "@/assets/icons/login-bg-icon.svg";
import LoginForm from "@/components/auth/login-form";

export default function Login() {
  return (
    <div className="w-full relative min-h-screen flex items-center justify-center overflow-hidden">
      <LoginBgLogo
        width={872}
        height={530}
        aria-hidden
        className="absolute top-15 left-262 text-primary pointer-events-none"
      />
      <LoginForm />
    </div>
  );
}
