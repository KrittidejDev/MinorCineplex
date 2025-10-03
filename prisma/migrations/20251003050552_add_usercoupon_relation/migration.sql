/*
  Warnings:

  - You are about to drop the column `is_collected` on the `coupon` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."coupon" DROP COLUMN "is_collected";

-- CreateTable
CREATE TABLE "public"."UserCoupon" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "coupon_id" INTEGER NOT NULL,
    "is_collected" BOOLEAN NOT NULL DEFAULT false,
    "collected_at" TIMESTAMP(3),

    CONSTRAINT "UserCoupon_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserCoupon_user_id_coupon_id_key" ON "public"."UserCoupon"("user_id", "coupon_id");

-- AddForeignKey
ALTER TABLE "public"."UserCoupon" ADD CONSTRAINT "UserCoupon_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserCoupon" ADD CONSTRAINT "UserCoupon_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "public"."coupon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
