"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginHeader from "@/features/auth/components/LoginHeader";
import SocialLogin from "@/features/auth/components/SocialLogin";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (session) {
      router.replace("/");
    }
  }, [router, session]);

  if (session) {
    return null;
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
