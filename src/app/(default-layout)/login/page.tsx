import { headers } from "next/headers";
import { redirect } from "next/navigation";
import LoginHeader from "@/features/auth/components/LoginHeader";
import SocialLogin from "@/features/auth/components/SocialLogin";
import { auth } from "@/lib/auth";

// 1) ignore bfcache - 1
// export const dynamic = "force-dynamic";

export default async function LoginPage() {
  // 2) ignore bfcache - 2
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/");
  }

  return (
    <div className="mx-auto flex w-full max-w-xs items-center justify-center py-24 md:py-20">
      <div className="space-y-8">
        <LoginHeader />
        <SocialLogin />
      </div>
    </div>
  );
}
