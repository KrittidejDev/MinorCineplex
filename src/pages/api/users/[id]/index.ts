import { updateUser, getUserById } from "@/services/userService";
import type { NextApiRequest, NextApiResponse } from "next";

type ServiceError = {
  status: number;
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid user id", status: 400 });
  }

  switch (req.method) {
    case "PUT": {
      const { username, avatar_url, avatar_id } = req.body;

      try {
        const updatedUser = await updateUser(id as string, {
          username,
          avatar_url,
          avatar_id,
        });

        // สร้าง object ใหม่โดยไม่เอา password
        const { password, ...userWithoutPassword } = updatedUser;

        res.status(200).json({ user: userWithoutPassword });
      } catch (err: unknown) {
        const error = err as ServiceError;
        if (error.status) {
          return res
            .status(error.status)
            .json({ status: error.status, message: error.message });
        }
        return res.status(500).json({ error: "Server Error" });
      }
      return;
    }

    case "GET": {
      try {
        const data = await getUserById(id);
        if (!data) {
          return res.status(404).json({ error: "User not found" });
        }

        // สร้าง object ใหม่โดยไม่เอา password
        const { password, ...userWithoutPassword } = data;

        res.status(200).json({ docs: userWithoutPassword, status: 200 });
        return;
      } catch (error: unknown) {
        console.error(error);
        if (error instanceof Error) {
          return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: "Server Error" });
      }
    }

    default: {
      return res.status(405).json({ error: "Method not allowed", status: 405 });
    }
  }
}
