import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt"
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Missing fields" });

  const existing = await prisma.User.findUnique({ where: { email } });
  if (existing) return res.status(400).json({ error: "Email already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.User.create({ data: { email, password: hashed } });

  return res.status(201).json({ id: user.id, email: user.email });
}
