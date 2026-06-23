import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

interface ProductCardProps {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: { name: string };
}

export function ProductCard({
  id,
  name,
  description,
  price,
  imageUrl,
  category,
}: ProductCardProps) {
  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100 flex flex-col">
      <Link href={`/products/${id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        </div>
        <div className="p-4 pb-2">
          <span className="text-xs font-medium text-indigo-600 uppercase tracking-wide">
            {category.name}
          </span>
          <h3 className="mt-1 font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
            {name}
          </h3>
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{description}</p>
          <p className="mt-3 text-lg font-bold text-indigo-600">{formatPrice(price)}</p>
        </div>
      </Link>
      <div className="px-4 pb-4 mt-auto pt-2">
        <AddToCartButton
          product={{ id, name, price, imageUrl, category: category.name }}
          className="w-full py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 active:scale-95 transition-all"
        />
      </div>
    </div>
  );
}
