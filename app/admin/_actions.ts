"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

// ─── Products ────────────────────────────────────────────────────────────────

export async function createProduct(_prev: unknown, formData: FormData) {
  await requireAdmin();

  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const price = parseFloat(formData.get("price") as string);
  const imageUrl = (formData.get("imageUrl") as string)?.trim();
  const categoryId = parseInt(formData.get("categoryId") as string);

  if (!name || !description || isNaN(price) || price < 0 || !imageUrl || isNaN(categoryId)) {
    return { error: "All fields are required and price must be a positive number." };
  }

  try {
    await prisma.product.create({
      data: { name, description, price, imageUrl, categoryId },
    });
  } catch {
    return { error: "Failed to create product. Check that the category exists." };
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function updateProduct(_prev: unknown, formData: FormData) {
  await requireAdmin();

  const id = parseInt(formData.get("id") as string);
  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const price = parseFloat(formData.get("price") as string);
  const imageUrl = (formData.get("imageUrl") as string)?.trim();
  const categoryId = parseInt(formData.get("categoryId") as string);

  if (isNaN(id) || !name || !description || isNaN(price) || price < 0 || !imageUrl || isNaN(categoryId)) {
    return { error: "All fields are required and price must be a positive number." };
  }

  try {
    await prisma.product.update({
      where: { id },
      data: { name, description, price, imageUrl, categoryId },
    });
  } catch {
    return { error: "Failed to update product." };
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function deleteProduct(id: number) {
  await requireAdmin();

  try {
    await prisma.product.delete({ where: { id } });
  } catch {
    throw new Error("Cannot delete product — it may be referenced elsewhere.");
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function createCategory(_prev: unknown, formData: FormData) {
  await requireAdmin();

  const name = (formData.get("name") as string)?.trim();

  if (!name) {
    return { error: "Name is required." };
  }

  try {
    await prisma.category.create({ data: { name } });
  } catch {
    return { error: "A category with that name already exists." };
  }

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function updateCategory(_prev: unknown, formData: FormData) {
  await requireAdmin();

  const id = parseInt(formData.get("id") as string);
  const name = (formData.get("name") as string)?.trim();

  if (isNaN(id) || !name) {
    return { error: "All fields are required." };
  }

  try {
    await prisma.category.update({ where: { id }, data: { name } });
  } catch {
    return { error: "A category with that name already exists." };
  }

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function deleteCategory(id: number) {
  await requireAdmin();

  try {
    await prisma.category.delete({ where: { id } });
  } catch {
    throw new Error("Cannot delete category — it still has products assigned to it.");
  }

  revalidatePath("/admin/categories");
}
