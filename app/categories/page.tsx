import { prisma } from "@/lib/db";
import Link from "next/link";
import { LuLeaf, LuApple, LuCake, LuCookie } from "react-icons/lu";
import type { IconType } from "react-icons";

const CATEGORY_ICONS: Record<string, { Icon: IconType; color: string; bg: string }> = {
  Vegetables: { Icon: LuLeaf,   color: "text-green-600",  bg: "bg-green-50"  },
  Fruits:     { Icon: LuApple,  color: "text-orange-500", bg: "bg-orange-50" },
  Cakes:      { Icon: LuCake,   color: "text-pink-500",   bg: "bg-pink-50"   },
  Biscuits:   { Icon: LuCookie, color: "text-amber-600",  bg: "bg-amber-50"  },
};

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
        <p className="mt-1 text-gray-500">Browse products by category</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${encodeURIComponent(
              cat.name.toLowerCase()
            )}`}
            className="group flex flex-col items-center justify-center p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all"
          >
            {(() => {
              const entry = CATEGORY_ICONS[cat.name];
              if (!entry) return null;
              const { Icon, color, bg } = entry;
              return (
                <div className={`${bg} ${color} p-4 rounded-2xl mb-3`}>
                  <Icon size={36} />
                </div>
              );
            })()}
            <h2 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
              {cat.name}
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              {cat._count.products}{" "}
              {cat._count.products === 1 ? "item" : "items"}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
