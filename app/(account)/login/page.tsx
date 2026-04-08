import LoginBgLogo from "@/assets/icons/login-bg-icon.svg";
import LoginForm from "@/components/auth/login-form";

export default function Login() {
  return (
    <div className="w-full relative min-h-screen flex items-center justify-center">
      <LoginBgLogo className="absolute top-15 left-262" />
      <LoginForm />
    </div>
  );
}
