import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

function toCartItem(item: {
  quantity: number;
  product: {
    id: number;
    name: string;
    price: { toNumber: () => number } | number;
    imageUrl: string;
    category: { name: string };
  };
}) {
  return {
    product: {
      id: item.product.id,
      name: item.product.name,
      price: typeof item.product.price === "number"
        ? item.product.price
        : (item.product.price as { toNumber: () => number }).toNumber(),
      imageUrl: item.product.imageUrl,
      category: item.product.category.name,
    },
    quantity: item.quantity,
  };
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { product: { include: { category: true } } },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ items: rows.map(toCartItem) });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId, quantity = 1 } = await req.json() as {
    productId: number;
    quantity?: number;
  };

  const existing = await prisma.cartItem.findUnique({
    where: { userId_productId: { userId: session.user.id, productId } },
  });

  const item = existing
    ? await prisma.cartItem.update({
        where: { userId_productId: { userId: session.user.id, productId } },
        data: { quantity: existing.quantity + quantity },
        include: { product: { include: { category: true } } },
      })
    : await prisma.cartItem.create({
        data: { userId: session.user.id, productId, quantity },
        include: { product: { include: { category: true } } },
      });

  return NextResponse.json(toCartItem(item), { status: existing ? 200 : 201 });
}

export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.cartItem.deleteMany({ where: { userId: session.user.id } });
  return new NextResponse(null, { status: 204 });
}
