import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const id = parseInt(params.id);
  if (isNaN(id)) notFound();

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/products" className="text-sm text-indigo-600 hover:underline">
          ← Products
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Edit Product</h1>
      </div>
      <ProductForm
        categories={categories}
        product={{
          id: product.id,
          name: product.name,
          description: product.description,
          price: Number(product.price),
          imageUrl: product.imageUrl,
          categoryId: product.categoryId,
        }}
      />
    </div>
  );
}
