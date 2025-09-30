import { createRouter } from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";
import multer, { FileFilterCallback } from "multer";
import { uploadHandler, deleteHandler } from "@/controllers/fileController";
import type { Request, Response } from "express";

// สร้าง storage ของ multer
const upload = multer({ storage: multer.memoryStorage() });

// Adapter แบบ type-safe
const multerAdapter = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: (err?: unknown) => void
) => {
  // ใช้ generic ของ Multer กับ Express.Request / Response
  const handler = upload.single("file");
  handler(req as unknown as Request, res as unknown as Response, next);
};

const router = createRouter<NextApiRequest, NextApiResponse>();

router.post(multerAdapter, uploadHandler);
router.delete(deleteHandler);

export const config = { api: { bodyParser: false } };

export default router.handler({
  onError(err: unknown, req: NextApiRequest, res: NextApiResponse) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Unknown error" });
    }
  },
  onNoMatch(req: NextApiRequest, res: NextApiResponse) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});
