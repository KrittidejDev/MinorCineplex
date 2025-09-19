import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt"
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const { email,useName,phoneNumber,password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Missing fields" });

  const existingUsername = await prisma.user.findUnique({ where: { useName } });
  if (existingUsername) return res.status(400).json({ error: "Username already exists" });
  
  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) return res.status(400).json({ error: "Email already exists" });

  const existingPhone = await prisma.user.findUnique({ where: { phoneNumber } });
  if (existingPhone) return res.status(400).json({ error: "Phone Number already exists" });

  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.create({ data: { email, password: hashed } });

  return res.status(201).json({ message: "Register Sucessfully"});
}
