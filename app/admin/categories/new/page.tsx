import Link from "next/link";
import CategoryForm from "@/components/admin/CategoryForm";

export default function NewCategoryPage() {
  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/categories" className="text-sm text-indigo-600 hover:underline">
          ← Categories
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Add Category</h1>
      </div>
      <CategoryForm />
    </div>
  );
}
