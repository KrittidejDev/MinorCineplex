import type { NextApiRequest, NextApiResponse } from "next";

const OMISE_SECRET_KEY = process.env.OMISE_SECRET_KEY;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { amount, type = "promptpay", metadata } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: "Invalid amount" });
  }

  if (!OMISE_SECRET_KEY) {
    return res.status(500).json({ error: "Omise secret key not configured" });
  }

  try {
    const basicAuth = Buffer.from(`${OMISE_SECRET_KEY}:`).toString("base64");

    // 1. สร้าง Source (QR Code)
    const sourceResponse = await fetch("https://api.omise.co/sources", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type,
        amount,
        currency: "THB",
      }),
    });

    const source = await sourceResponse.json();

    if (!sourceResponse.ok) {
      return res.status(sourceResponse.status).json({
        success: false,
        error: source.message || "Failed to create payment source",
      });
    }

    // 2. สร้าง Charge ด้วย Source
    const chargeResponse = await fetch("https://api.omise.co/charges", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        currency: "THB",
        source: source.id,
        return_uri: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/payment/callback`,
        metadata: metadata || {},
      }),
    });

    const charge = await chargeResponse.json();

    if (!chargeResponse.ok) {
      return res.status(chargeResponse.status).json({
        success: false,
        error: charge.message || "Failed to create charge",
      });
    }

    // 3. ดึง QR Code URL
    const qrCodeUrl =
      charge.source?.scannable_code?.image?.download_uri ||
      source.scannable_code?.image?.download_uri ||
      charge.authorize_uri ||
      null;

    if (!qrCodeUrl) {
      return res.status(500).json({
        success: false,
        error: "QR code generation failed - no image URL",
        debug: { source, charge },
      });
    }

    res.status(200).json({
      success: true,
      sourceId: source.id,
      chargeId: charge.id,
      qrCodeUrl,
      charge,
    });
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to create QR payment";

    res.status(500).json({
      success: false,
      error: errorMessage,
      details:
        process.env.NODE_ENV === "development" && err instanceof Error
          ? err.stack
          : undefined,
    });
  }
}
