import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import CategoryForm from "@/components/admin/CategoryForm";

export default async function EditCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const id = parseInt(params.id);
  if (isNaN(id)) notFound();

  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) notFound();

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/categories" className="text-sm text-indigo-600 hover:underline">
          ← Categories
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Edit Category</h1>
      </div>
      <CategoryForm category={category} />
    </div>
  );
}
