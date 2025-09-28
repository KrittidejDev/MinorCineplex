import type { NextApiRequest, NextApiResponse } from "next";
import { registerUser } from "../../../services/authService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({ message: "Register successfully", user });
  } catch (err: any) {
    console.error("Register failed:", err);

    if (err.status) {
      return res
        .status(err.status)
        .json({ status: err.status, message: err.message });
    }
  }
  return res.status(500).json({ error: "Server Error" });
}
