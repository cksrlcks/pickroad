import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Profile } from "@/features/my/components/Profile";
import { auth } from "@/lib/auth";

export default async function MyPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const user = session.user;

  return (
    <Suspense
      fallback={
        <div className="p-4 text-center text-sm opacity-50">
          회원정보를 가져오는중입니다.
        </div>
      }
    >
      <Profile user={user} />
    </Suspense>
  );
}
