import { PrismaClient } from "@prisma/client";

declare global {
  // ป้องกัน Prisma สร้างซ้ำใน development
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query"], // optional: ดู query log
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
