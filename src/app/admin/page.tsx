import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCategories } from "@/data/roadmap";
import CategoryForm from "@/features/admin/components/CategoryForm";
import { auth } from "@/lib/auth";

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const isAdmin = session?.user.role === "admin";

  if (!isAdmin) {
    redirect("/");
  }

  const categories = await getCategories();

  return (
    <>
      <CategoryForm categories={categories} />
    </>
  );
}
