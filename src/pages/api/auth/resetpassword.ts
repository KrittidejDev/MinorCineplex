import type { NextApiRequest, NextApiResponse } from "next";
import { resetPassword } from "../../../services/authService";

type ServiceError = {
  status: number;
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await resetPassword(req.body); // ไม่ต้องเก็บค่าไว้
    res.status(200).json({ message: "Reset password successfully" });
  } catch (err: unknown) {
    const error = err as ServiceError;
    if (error.status) {
      return res
        .status(error.status)
        .json({ status: error.status, message: error.message });
    }
    return res.status(500).json({ error: "Server Error" });
  }
}
