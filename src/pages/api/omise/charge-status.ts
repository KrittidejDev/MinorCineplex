import type { NextApiRequest, NextApiResponse } from "next";

const OMISE_SECRET_KEY = process.env.OMISE_SECRET_KEY;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { chargeId } = req.query;

  if (!chargeId || typeof chargeId !== "string") {
    return res.status(400).json({ error: "Charge ID is required" });
  }

  try {
    const basicAuth = Buffer.from(`${OMISE_SECRET_KEY}:`).toString("base64");

    // เรียก charge เดี่ยว
    const response = await fetch(`https://api.omise.co/charges/${chargeId}`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${basicAuth}`,
      },
    });

    const charge = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: charge.message || "Charge not found",
      });
    }

    res.status(200).json({
      success: true,
      status: charge.status,
      paid: charge.paid,
      charge,
    });
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Internal server error";
    res.status(500).json({ success: false, error: errorMessage });
  }
}
