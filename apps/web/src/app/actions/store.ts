"use server";

import { prisma } from "@rebuildyourlife/database";

export async function createDigitalProduct(data: {
  userId: string;
  title: string;
  description: string;
  price: number;
  fileUrl: string;
}) {
  try {
    const product = await prisma.digitalProduct.create({
      data: {
        userId: data.userId,
        title: data.title,
        description: data.description,
        price: data.price,
        fileUrl: data.fileUrl,
      },
    });

    return { success: true, product };
  } catch (error: any) {
    console.error("Error creating digital product:", error);
    return { success: false, error: error.message };
  }
}

export async function getDigitalProducts(userId: string) {
  try {
    const products = await prisma.digitalProduct.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, products };
  } catch (error: any) {
    console.error("Error fetching digital products:", error);
    return { success: false, error: error.message };
  }
}

// Mocked purchase function until Mollie is integrated
export async function buyDigitalProduct(productId: string, buyerEmail: string) {
  try {
    const order = await prisma.digitalOrder.create({
      data: {
        productId,
        buyerEmail,
        status: "PAID", // We auto-approve for now
        molliePaymentId: "mock_payment_" + Date.now(),
      },
      include: {
        product: true,
      },
    });

    return { success: true, order };
  } catch (error: any) {
    console.error("Error buying digital product:", error);
    return { success: false, error: error.message };
  }
}
