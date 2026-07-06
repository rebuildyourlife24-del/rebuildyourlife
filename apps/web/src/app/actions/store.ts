"use server";

import { prisma } from "@rebuildyourlife/database";
import { getSessionAction } from "./auth";

export async function createDigitalProduct(data: {
  title: string;
  description: string;
  price: number;
  fileUrl: string;
}) {
  try {
    const session = await getSessionAction();
    if (!session || !session.user) {
      throw new Error("Unauthorized");
    }

    const product = await prisma.digitalProduct.create({
      data: {
        userId: session.user.id,
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

export async function getDigitalProducts() {
  try {
    const session = await getSessionAction();
    if (!session || !session.user) {
      throw new Error("Unauthorized");
    }

    const products = await prisma.digitalProduct.findMany({
      where: { userId: session.user.id },
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
