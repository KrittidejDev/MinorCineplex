/*
  Warnings:

  - The primary key for the `coupon` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "public"."UserCoupon" DROP CONSTRAINT "UserCoupon_coupon_id_fkey";

-- AlterTable
ALTER TABLE "public"."UserCoupon" ALTER COLUMN "coupon_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."coupon" DROP CONSTRAINT "coupon_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "coupon_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "coupon_id_seq";

-- AlterTable
ALTER TABLE "public"."showtime_seat" ADD COLUMN     "locked_at" TIMESTAMP(3),
ADD COLUMN     "locked_by" TEXT;

-- AddForeignKey
ALTER TABLE "public"."UserCoupon" ADD CONSTRAINT "UserCoupon_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "public"."coupon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
