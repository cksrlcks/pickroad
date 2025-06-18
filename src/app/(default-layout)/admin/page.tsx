import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import CategoryAddButton from "@/features/category/components/CategoryAddButton";
import CategoryList from "@/features/category/components/CategoryList";
import { getCategoriesWithCount } from "@/features/category/server/db";
import { auth } from "@/lib/auth";

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const isAdmin = session?.user.role === "admin";

  if (!isAdmin) {
    redirect("/");
  }

  const categories = await getCategoriesWithCount();

  return (
    <>
      <header>
        <h2 className="mb-1 font-semibold">카테고리</h2>
        <p className="text-muted-foreground text-xs md:text-sm">
          카테고리 목록을 확인하고 관리할 수 있습니다.
        </p>
      </header>
      <Separator className="bg-muted my-6" />
      <CategoryList categories={categories} />
      <div className="mt-6 flex justify-end gap-1">
        <CategoryAddButton />
      </div>
    </>
  );
}
