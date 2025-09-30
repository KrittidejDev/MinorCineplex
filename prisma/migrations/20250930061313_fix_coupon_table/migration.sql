/*
  Warnings:

  - You are about to drop the column `createdAt` on the `coupon` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `coupon` table. All the data in the column will be lost.
  - You are about to drop the column `maxDiscount` on the `coupon` table. All the data in the column will be lost.
  - You are about to drop the column `minAmount` on the `coupon` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `coupon` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `coupon` table. All the data in the column will be lost.
  - You are about to drop the column `usageLimit` on the `coupon` table. All the data in the column will be lost.
  - You are about to drop the column `usedCount` on the `coupon` table. All the data in the column will be lost.
  - Added the required column `end_date` to the `coupon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `coupon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `coupon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."coupon" DROP COLUMN "createdAt",
DROP COLUMN "endDate",
DROP COLUMN "maxDiscount",
DROP COLUMN "minAmount",
DROP COLUMN "startDate",
DROP COLUMN "updatedAt",
DROP COLUMN "usageLimit",
DROP COLUMN "usedCount",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "end_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "max_discount" DOUBLE PRECISION,
ADD COLUMN     "min_amount" DOUBLE PRECISION,
ADD COLUMN     "start_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "usage_limit" INTEGER,
ADD COLUMN     "used_count" INTEGER NOT NULL DEFAULT 0;
