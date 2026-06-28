import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const productId = parseInt(params.productId, 10);
  const { quantity } = await req.json() as { quantity: number };

  if (quantity <= 0) {
    await prisma.cartItem.delete({
      where: { userId_productId: { userId: session.user.id, productId } },
    });
    return new NextResponse(null, { status: 204 });
  }

  await prisma.cartItem.update({
    where: { userId_productId: { userId: session.user.id, productId } },
    data: { quantity },
  });

  return new NextResponse(null, { status: 204 });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { productId: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const productId = parseInt(params.productId, 10);

  await prisma.cartItem.delete({
    where: { userId_productId: { userId: session.user.id, productId } },
  });

  return new NextResponse(null, { status: 204 });
}
