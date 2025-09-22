import type { NextApiRequest, NextApiResponse } from "next";
import { registerUser } from "../../../services/authService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({ message: "Register successfully", user });
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
  }
  return res.status(500).json({ error: "Server Error" });
}
