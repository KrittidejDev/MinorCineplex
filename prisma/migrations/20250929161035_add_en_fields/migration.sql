-- AlterTable
ALTER TABLE "public"."actor" ADD COLUMN     "name_en" TEXT;

-- AlterTable
ALTER TABLE "public"."cinema" ADD COLUMN     "description_en" TEXT,
ADD COLUMN     "group_location_en" TEXT;

-- AlterTable
ALTER TABLE "public"."director" ADD COLUMN     "name_en" TEXT;

-- AlterTable
ALTER TABLE "public"."movie" ADD COLUMN     "description_en" TEXT,
ADD COLUMN     "genre_en" TEXT;
