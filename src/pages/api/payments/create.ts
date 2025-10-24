import { NextApiRequest, NextApiResponse } from "next";
import { PaymentMethod, PrismaClient } from "@/generated/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { bookingId, userId, amount, paymentMethod } = req.body;

  if (!bookingId || !userId || !amount || !paymentMethod) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const validPaymentMethods = Object.values(PaymentMethod);
  let normalizedPaymentMethod: PaymentMethod;
  if (paymentMethod === "credit_card") {
    normalizedPaymentMethod = PaymentMethod.CREDIT_CARD;
  } else if (paymentMethod === "qr_code") {
    normalizedPaymentMethod = PaymentMethod.QR_CODE;
  } else if (validPaymentMethods.includes(paymentMethod)) {
    normalizedPaymentMethod = paymentMethod as PaymentMethod;
  } else {
    return res.status(400).json({ error: "Invalid payment method" });
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const existingPayment = await prisma.payment.findUnique({
      where: { booking_id: bookingId },
    });
    if (existingPayment) {
      return res
        .status(400)
        .json({ error: "Payment already exists for this booking" });
    }

    const payment = await prisma.payment.create({
      data: {
        booking_id: bookingId,
        user_id: userId,
        amount: parseFloat(amount.toString()),
        payment_method: normalizedPaymentMethod,
        status: "PENDING",
        transaction_id: null,
      },
    });

    return res.status(200).json({ paymentId: payment.id });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return res
          .status(400)
          .json({ error: "Payment already exists for this booking" });
      }
      console.error("❌ Failed to create payment:", err);
      return res
        .status(500)
        .json({ error: "Failed to create payment", details: err.message });
    }
    console.error("❌ Unexpected error during payment creation:", err);
    return res
      .status(500)
      .json({ error: "Unexpected error during payment creation" });
  } finally {
    await prisma.$disconnect();
  }
}
