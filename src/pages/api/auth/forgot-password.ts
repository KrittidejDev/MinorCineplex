import type { NextApiRequest, NextApiResponse } from "next";
import { sendResetPasswordEmail } from "../../../services/authService";

type ServiceError = {
  status: number;
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const normalizedEmail = String(email).toLowerCase().trim();
    // Small delay to reduce enumeration speed
    await new Promise((r) => setTimeout(r, 400));
    try {
      await sendResetPasswordEmail(normalizedEmail);
    } catch (e) {
      // Swallow specific errors to avoid email enumeration
    }
    // Always respond generically
    return res
      .status(200)
      .json({ message: "If that account exists, we'll email a reset link." });
  } catch (err: unknown) {
    const error = err as ServiceError;
    if (error.status) {
      return res.status(error.status).json({ status: error.status, message: error.message });
    }
    return res.status(500).json({ error: "Server Error" });
  }
}