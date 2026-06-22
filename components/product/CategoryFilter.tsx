import Link from "next/link";
import { cn } from "@/lib/utils";

interface Category {
  id: number;
  name: string;
  _count: { products: number };
}

interface CategoryFilterProps {
  categories: Category[];
  activeCategory?: string;
}

export function CategoryFilter({
  categories,
  activeCategory,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <Link
        href="/products"
        className={cn(
          "px-4 py-2 rounded-full text-sm font-medium transition-colors",
          !activeCategory
            ? "bg-indigo-600 text-white"
            : "bg-white text-gray-600 border border-gray-200 hover:bg-indigo-50 hover:text-indigo-600"
        )}
      >
        All Products
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/products?category=${encodeURIComponent(cat.name.toLowerCase())}`}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-colors",
            activeCategory === cat.name.toLowerCase()
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-indigo-50 hover:text-indigo-600"
          )}
        >
          {cat.name}
          <span className="ml-1.5 text-xs opacity-70">
            ({cat._count.products})
          </span>
        </Link>
      ))}
    </div>
  );
}
