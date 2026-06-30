import { prisma } from "@/lib/db";
import Link from "next/link";
import { deleteCategory } from "../_actions";
import { DeleteButton } from "@/components/admin/DeleteButton";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500">{categories.length} total</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
        >
          + Add Category
        </Link>
      </div>

      {categories.length === 0 ? (
        <p className="text-gray-500 text-sm">No categories yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Name</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">Products</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((cat) => {
                const deleteAction = deleteCategory.bind(null, cat.id);
                return (
                  <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{cat.name}</td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {cat._count.products}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex items-center gap-4">
                        <Link
                          href={`/admin/categories/${cat.id}/edit`}
                          className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                          Edit
                        </Link>
                        <DeleteButton action={deleteAction} label="category" />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
