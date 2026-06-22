import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import type { Metadata } from "next";

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const id = parseInt(params.id);
  if (isNaN(id)) return { title: "Product not found" };

  const product = await prisma.product.findUnique({
    where: { id },
    select: { name: true, description: true },
  });

  if (!product) return { title: "Product not found" };
  return { title: product.name, description: product.description };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const id = parseInt(params.id);
  if (isNaN(id)) notFound();

  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!product) notFound();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/products" className="hover:text-indigo-600 transition-colors">
          Products
        </Link>
        <span>/</span>
        <Link
          href={`/products?category=${encodeURIComponent(
            product.category.name.toLowerCase()
          )}`}
          className="hover:text-indigo-600 transition-colors"
        >
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
          />
        </div>

        {/* Details */}
        <div className="flex flex-col justify-center">
          <span className="text-sm font-medium text-indigo-600 uppercase tracking-wide">
            {product.category.name}
          </span>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900">
            {product.name}
          </h1>
          <p className="mt-4 text-3xl font-bold text-indigo-600">
            {formatPrice(Number(product.price))}
          </p>
          <p className="mt-4 text-gray-600 leading-relaxed">
            {product.description}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button className="flex-1 px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors">
              Add to Cart
            </button>
            <Link
              href="/products"
              className="flex-1 text-center px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
