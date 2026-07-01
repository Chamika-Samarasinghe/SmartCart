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

type FieldErrors = Partial<Record<"name" | "description" | "price" | "imageUrl" | "categoryId", string>>;

function validateProductForm(formData: FormData): FieldErrors {
  const errors: FieldErrors = {};

  const name = (formData.get("name") as string)?.trim() ?? "";
  if (!name) {
    errors.name = "Name is required.";
  } else if (name.length < 2) {
    errors.name = "Name must be at least 2 characters.";
  } else if (name.length > 100) {
    errors.name = "Name must be 100 characters or fewer.";
  }

  const description = (formData.get("description") as string)?.trim() ?? "";
  if (!description) {
    errors.description = "Description is required.";
  } else if (description.length < 10) {
    errors.description = "Description must be at least 10 characters.";
  }

  const priceRaw = formData.get("price") as string;
  const price = parseFloat(priceRaw);
  if (!priceRaw) {
    errors.price = "Price is required.";
  } else if (isNaN(price) || price < 0.01) {
    errors.price = "Price must be greater than $0.00.";
  }

  const imageUrl = (formData.get("imageUrl") as string)?.trim() ?? "";
  if (!imageUrl) {
    errors.imageUrl = "Image URL is required.";
  } else {
    try {
      const parsed = new URL(imageUrl);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        errors.imageUrl = "Must be a valid https:// URL.";
      }
    } catch {
      errors.imageUrl = "Must be a valid URL (e.g. https://example.com/image.jpg).";
    }
  }

  const categoryId = formData.get("categoryId") as string;
  if (!categoryId) {
    errors.categoryId = "Please select a category.";
  }

  return errors;
}

const inputBase =
  "block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 transition-colors";
const inputNormal = "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500";
const inputError = "border-red-400 focus:border-red-500 focus:ring-red-500 bg-red-50";

export default function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: ProductData;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isPending, startTransition] = useTransition();

  const action = product ? updateProduct : createProduct;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const errors = validateProductForm(formData);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setServerError(null);
    startTransition(async () => {
      const result = await action(null, formData);
      if (result?.error) setServerError(result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-xl space-y-5">
      {product && <input type="hidden" name="id" value={product.id} />}

      {serverError && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      {/* Name */}
      <div className="space-y-1">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          id="name"
          name="name"
          defaultValue={product?.name}
          aria-describedby={fieldErrors.name ? "name-error" : undefined}
          aria-invalid={!!fieldErrors.name}
          className={`${inputBase} ${fieldErrors.name ? inputError : inputNormal}`}
        />
        {fieldErrors.name && (
          <p id="name-error" className="text-xs text-red-600 mt-1">{fieldErrors.name}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-1">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={product?.description}
          aria-describedby={fieldErrors.description ? "description-error" : undefined}
          aria-invalid={!!fieldErrors.description}
          className={`${inputBase} ${fieldErrors.description ? inputError : inputNormal}`}
        />
        {fieldErrors.description && (
          <p id="description-error" className="text-xs text-red-600 mt-1">{fieldErrors.description}</p>
        )}
      </div>

      {/* Price */}
      <div className="space-y-1">
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Price ($)
        </label>
        <input
          id="price"
          name="price"
          type="number"
          step="0.01"
          min="0.01"
          defaultValue={product?.price}
          aria-describedby={fieldErrors.price ? "price-error" : undefined}
          aria-invalid={!!fieldErrors.price}
          className={`${inputBase} ${fieldErrors.price ? inputError : inputNormal}`}
        />
        {fieldErrors.price && (
          <p id="price-error" className="text-xs text-red-600 mt-1">{fieldErrors.price}</p>
        )}
      </div>

      {/* Image URL */}
      <div className="space-y-1">
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
          Image URL
        </label>
        <input
          id="imageUrl"
          name="imageUrl"
          type="url"
          placeholder="https://example.com/image.jpg"
          defaultValue={product?.imageUrl}
          aria-describedby={fieldErrors.imageUrl ? "imageUrl-error" : undefined}
          aria-invalid={!!fieldErrors.imageUrl}
          className={`${inputBase} ${fieldErrors.imageUrl ? inputError : inputNormal}`}
        />
        {fieldErrors.imageUrl && (
          <p id="imageUrl-error" className="text-xs text-red-600 mt-1">{fieldErrors.imageUrl}</p>
        )}
      </div>

      {/* Category */}
      <div className="space-y-1">
        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="categoryId"
          name="categoryId"
          defaultValue={product?.categoryId ?? ""}
          aria-describedby={fieldErrors.categoryId ? "categoryId-error" : undefined}
          aria-invalid={!!fieldErrors.categoryId}
          className={`${inputBase} ${fieldErrors.categoryId ? inputError : inputNormal}`}
        >
          <option value="">Select a category…</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {fieldErrors.categoryId && (
          <p id="categoryId-error" className="text-xs text-red-600 mt-1">{fieldErrors.categoryId}</p>
        )}
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
