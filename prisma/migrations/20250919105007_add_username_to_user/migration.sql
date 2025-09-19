/*
  Warnings:

  - You are about to drop the column `username` on the `Cinema` table. All the data in the column will be lost.
  - Added the required column `name` to the `Cinema` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Cinema" DROP COLUMN "username",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "username" TEXT NOT NULL;
