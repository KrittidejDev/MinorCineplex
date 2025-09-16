import { NextApiRequest, NextApiResponse } from "next";
import { uploadFile, deleteFile } from "@/services/fileServices";

export const uploadHandler = async (req: any, res: NextApiResponse) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const result = await uploadFile(req.file.buffer);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const { public_id } = req.body;
    if (!public_id) return res.status(400).json({ error: "Missing public_id" });

    const result = await deleteFile(public_id);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
