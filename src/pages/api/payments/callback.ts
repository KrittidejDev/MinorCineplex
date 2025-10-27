import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { chargeId } = req.query;

  if (!chargeId) {
    return res.status(400).json({ error: "Charge ID is required" });
  }

  try {
    const basicAuth = Buffer.from(`${process.env.OMISE_SECRET_KEY}:`).toString(
      "base64"
    );
    const response = await fetch(`https://api.omise.co/charges/${chargeId}`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/json",
      },
    });

    const charge = await response.json();

    if (!response.ok) {
      console.error("Failed to fetch charge:", charge);
      return res.status(response.status).json({
        success: false,
        error: charge.message || "Failed to fetch charge",
      });
    }

    if (charge.status === "successful") {
      // อัปเดตสถานะการจองในฐานข้อมูล
      // เช่น เรียก /api/payments/confirm
      res.redirect(302, "/booking/success");
    } else {
      res.redirect(302, "/booking/failure");
    }
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Internal server error";
    console.error("Callback error:", errorMessage);
    res.status(500).json({ success: false, error: errorMessage });
  }
}
