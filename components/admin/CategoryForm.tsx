"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { createCategory, updateCategory } from "@/app/admin/_actions";

type CategoryData = { id: number; name: string };

export default function CategoryForm({ category }: { category?: CategoryData }) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const action = category ? updateCategory : createCategory;

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
    <form onSubmit={handleSubmit} className="max-w-sm space-y-5">
      {category && <input type="hidden" name="id" value={category.id} />}

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
          defaultValue={category?.name}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {isPending ? "Saving…" : category ? "Save Changes" : "Create Category"}
        </button>
        <Link
          href="/admin/categories"
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
