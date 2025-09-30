import type { NextApiRequest, NextApiResponse } from "next";
import type { MulterFile } from "@/types/file";

// Upload Handler
export const uploadHandler = async (
  req: NextApiRequest & { file?: MulterFile },
  res: NextApiResponse
) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const file = req.file;
  res.status(200).json({ filename: file.originalname, size: file.size });
};

// Delete Handler
export const deleteHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { filename } = req.query;
  if (!filename) return res.status(400).json({ error: "Filename required" });

  // ลบไฟล์ logic ที่นี่
  res.status(200).json({ message: `File ${filename} deleted` });
};
