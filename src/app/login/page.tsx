import LoginHeader from "@/features/auth/components/LoginHeader";
import SocialLogin from "@/features/auth/components/SocialLogin";

export default function LoginPage() {
  return (
    <div className="mx-auto -mt-22 flex h-screen w-full max-w-xs items-center justify-center">
      <div className="space-y-8">
        <LoginHeader />
        <SocialLogin />
      </div>
    </div>
  );
}
