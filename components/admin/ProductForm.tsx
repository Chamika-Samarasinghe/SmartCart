"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { createProduct, updateProduct } from "@/app/admin/_actions";

type Category = { id: number; name: string };

type ProductData = {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: number;
};

export default function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: ProductData;
}) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const action = product ? updateProduct : createProduct;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      const result = await action(null, formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      {product && <input type="hidden" name="id" value={product.id} />}

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-1">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          defaultValue={product?.name}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={3}
          defaultValue={product?.description}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Price ($)
        </label>
        <input
          id="price"
          name="price"
          type="number"
          step="0.01"
          min="0"
          required
          defaultValue={product?.price}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
          Image URL
        </label>
        <input
          id="imageUrl"
          name="imageUrl"
          type="url"
          required
          defaultValue={product?.imageUrl}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="categoryId"
          name="categoryId"
          required
          defaultValue={product?.categoryId}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">Select a category…</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {isPending ? "Saving…" : product ? "Save Changes" : "Create Product"}
        </button>
        <Link
          href="/admin/products"
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
