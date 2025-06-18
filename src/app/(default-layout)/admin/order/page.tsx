import { Separator } from "@/components/ui/separator";
import CategoryReorderForm from "@/features/category/components/CategoryReorderForm";
import { getCategories } from "@/features/category/server/db";

export default async function OrderPage() {
  const categories = await getCategories();
  return (
    <>
      <header>
        <h2 className="mb-1 font-semibold">카테고리 순서</h2>
        <p className="text-muted-foreground text-xs md:text-sm">
          카테고리의 순서를 변경할 수 있어요. 드래그 앤 드롭으로 순서를
          조정하세요.
        </p>
      </header>
      <Separator className="bg-muted my-6" />
      <CategoryReorderForm categories={categories} />
    </>
  );
}
