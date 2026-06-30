import { prisma } from "@/lib/db";
import Link from "next/link";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/products" className="text-sm text-indigo-600 hover:underline">
          ← Products
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Add Product</h1>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
