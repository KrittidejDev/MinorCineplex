-- AlterTable
ALTER TABLE "public"."cinema" ADD COLUMN     "province" TEXT,
ADD COLUMN     "province_en" TEXT;

-- AlterTable
ALTER TABLE "public"."showtime_seat" ALTER COLUMN "price" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."time_slot" ALTER COLUMN "start_time" SET DATA TYPE TEXT,
ALTER COLUMN "end_time" SET DATA TYPE TEXT;
