import type { NextApiRequest, NextApiResponse } from "next";

const OMISE_SECRET_KEY = process.env.OMISE_SECRET_KEY;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { amount, token, description, metadata } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: "Invalid amount" });
  }

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    const basicAuth = Buffer.from(`${OMISE_SECRET_KEY}:`).toString("base64");

    const response = await fetch("https://api.omise.co/charges", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        currency: "THB",
        card: token,
        description: description || "Payment",
        metadata: metadata || {},
      }),
    });

    const charge = await response.json();

    if (!response.ok) {
      console.error("Omise charge error:", charge);
      return res.status(response.status).json({
        success: false,
        error: charge.message || "Payment failed",
      });
    }

    res.status(200).json({
      success: true,
      charge,
    });
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Internal server error";
    console.error("Charge error:", err instanceof Error ? err : err);

    res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
}
