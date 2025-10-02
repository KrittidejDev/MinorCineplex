import type { NextApiRequest, NextApiResponse } from "next";
import { uploadFile } from "@/services/fileServices";
import type { MulterFile } from "@/types/file";

// Upload Handler
export const uploadHandler = async (
  req: NextApiRequest & { file?: MulterFile },
  res: NextApiResponse
) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  try {
    const result = await uploadFile(req.file.buffer);

    res.status(200).json({
      url: result.secure_url,
      public_id: result.public_id,
      originalname: req.file.originalname,
      size: req.file.size,
    });
  } catch (err) {
    if (err instanceof Error) res.status(500).json({ error: err.message });
    else res.status(500).json({ error: "Unknown error" });
  }
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
