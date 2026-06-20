import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-xl">
        <h1 className="text-5xl font-bold tracking-tight mb-4">SmartCart</h1>
        <p className="text-lg text-gray-600 mb-8">
          A modern, fast shopping cart built with Next.js 14, TypeScript, and Tailwind CSS.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/products"
            className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Browse Products
          </Link>
          <Link
            href="/cart"
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            View Cart
          </Link>
        </div>
      </div>
    </main>
  );
}
