import type { NextApiRequest, NextApiResponse } from "next";
import { registerUser } from "../../../services/authService";

type ServiceError = {
  status: number;
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const user = await registerUser(req.body);

    const { password: _password, ...userData } = user;
    void _password; // ป้องกัน warning no-unused-vars

    res.status(201).json({ message: "Register successfully", userData });
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
