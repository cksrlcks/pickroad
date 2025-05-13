import LoginHeader from "@/features/auth/components/LoginHeader";
import SocialLogin from "@/features/auth/components/SocialLogin";

export default function LoginPage() {
  return (
    <div className="mx-auto flex w-full max-w-xs items-center justify-center pt-24 md:pt-20">
      <div className="space-y-8">
        <LoginHeader />
        <SocialLogin />
      </div>
    </div>
  );
}
