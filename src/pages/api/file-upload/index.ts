import { createRouter } from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";
import { uploadHandler, deleteHandler } from "@/controllers/fileController";

const upload = multer({ storage: multer.memoryStorage() });

const router = createRouter<NextApiRequest, NextApiResponse>();

// Adapt Express-style Multer middleware to Next.js API handler signature
const multerAdapter = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: (err?: unknown) => void
) => upload.single("file")(req as any, res as any, next as any);
// Upload single file
router.post(multerAdapter as any, uploadHandler);

// Delete file
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
