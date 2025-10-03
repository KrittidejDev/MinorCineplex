import { updateUser, getUserById } from "@/services/userService";
import type { NextApiRequest, NextApiResponse } from "next";

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
        const { password, ...userWithoutPassword } = updatedUser;
        res.status(200).json({ user: userWithoutPassword });
      } catch (error) {
        console.log(error);

        res.status(500).json({ error: "Failed to update profile" });
      }
    }

    case "GET": {
      try {
        const data = await getUserById(id);
        res.status(200).json({ docs: data, status: 200 });
        return;
      } catch (error: unknown) {
        console.error(error);
        if (error instanceof Error) {
          return res.status(500).json({ error: error.message });
        }
      }
    }

    default: {
      return res.status(405).json({ error: "Method not allowed", status: 405 });
    }
  }
}
