import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/product/ProductCard";
import { CategoryFilter } from "@/components/product/CategoryFilter";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const rawCategory = searchParams.category;
  const category =
    typeof rawCategory === "string" ? rawCategory.toLowerCase() : undefined;

  const [categories, products] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } },
    }),
    prisma.product.findMany({
      where: category
        ? { category: { name: { equals: category, mode: "insensitive" } } }
        : undefined,
      include: { category: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const matchedCategory = categories.find(
    (c) => c.name.toLowerCase() === category
  );
  const heading = matchedCategory ? matchedCategory.name : "All Products";

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{heading}</h1>
        <p className="mt-1 text-gray-500">
          {products.length} {products.length === 1 ? "product" : "products"}
        </p>
      </div>

      <CategoryFilter categories={categories} activeCategory={category} />

      {products.length === 0 ? (
        <p className="text-gray-500">No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              description={product.description}
              price={Number(product.price)}
              imageUrl={product.imageUrl}
              category={product.category}
            />
          ))}
        </div>
      )}
    </main>
  );
}
