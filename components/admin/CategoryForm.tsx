"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { createCategory, updateCategory } from "@/app/admin/_actions";

type CategoryData = { id: number; name: string };

const inputBase =
  "block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 transition-colors";
const inputNormal = "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500";
const inputError = "border-red-400 focus:border-red-500 focus:ring-red-500 bg-red-50";

export default function CategoryForm({ category }: { category?: CategoryData }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const action = category ? updateCategory : createCategory;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const name = (formData.get("name") as string)?.trim() ?? "";
    if (!name) {
      setNameError("Name is required.");
      return;
    }
    if (name.length < 2) {
      setNameError("Name must be at least 2 characters.");
      return;
    }
    if (name.length > 50) {
      setNameError("Name must be 50 characters or fewer.");
      return;
    }

    setNameError(null);
    setServerError(null);
    startTransition(async () => {
      const result = await action(null, formData);
      if (result?.error) setServerError(result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-sm space-y-5">
      {category && <input type="hidden" name="id" value={category.id} />}

      {serverError && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <div className="space-y-1">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          id="name"
          name="name"
          defaultValue={category?.name}
          maxLength={50}
          aria-describedby={nameError ? "name-error" : undefined}
          aria-invalid={!!nameError}
          className={`${inputBase} ${nameError ? inputError : inputNormal}`}
        />
        {nameError && (
          <p id="name-error" className="text-xs text-red-600 mt-1">{nameError}</p>
        )}
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
