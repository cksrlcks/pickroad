import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Profile } from "@/features/auth/components/Profile";
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
    <>
      <header>
        <h2 className="mb-1 font-semibold">회원정보 수정</h2>
        <p className="text-muted-foreground text-xs md:text-sm">
          가입된 정보를 수정 하실 수 있어요
        </p>
      </header>
      <Separator className="bg-muted my-6" />
      <Profile user={user} />
    </>
  );
}
