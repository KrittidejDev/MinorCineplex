-- CreateEnum
CREATE TYPE "public"."booking_status" AS ENUM ('PAID', 'RESERVED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."user_role" AS ENUM ('ADMIN', 'CUSTOMER');

-- CreateTable
CREATE TABLE "public"."cinema" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT,
    "description" TEXT,
    "group_location" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "icon_url" TEXT,
    "opening_hours" TEXT,
    "transportation" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cinema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."hall" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "seat_count" INTEGER DEFAULT 50,
    "cinema_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hall_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."seat" (
    "id" TEXT NOT NULL,
    "seat_number" TEXT NOT NULL,
    "row" TEXT NOT NULL,
    "col" TEXT NOT NULL,
    "hall_id" TEXT NOT NULL,

    CONSTRAINT "seat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."movie" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "duration_min" INTEGER NOT NULL,
    "description" TEXT,
    "poster_url" TEXT,
    "trailer_url" TEXT,
    "genre" TEXT,
    "rating" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "release_date" TIMESTAMP(3),

    CONSTRAINT "movie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."actor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "actor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."director" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "director_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."movie_actor" (
    "id" TEXT NOT NULL,
    "movie_id" TEXT NOT NULL,
    "actor_id" TEXT NOT NULL,

    CONSTRAINT "movie_actor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."movie_director" (
    "id" TEXT NOT NULL,
    "movie_id" TEXT NOT NULL,
    "director_id" TEXT NOT NULL,

    CONSTRAINT "movie_director_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."time_slot" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "time_slot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."showtime" (
    "id" TEXT NOT NULL,
    "movie_id" TEXT NOT NULL,
    "hall_id" TEXT NOT NULL,
    "time_slot_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 200,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "showtime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."showtime_seat" (
    "id" TEXT NOT NULL,
    "showtime_id" TEXT NOT NULL,
    "seat_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "showtime_seat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."user_role" NOT NULL DEFAULT 'CUSTOMER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."booking" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "showtime_id" TEXT NOT NULL,
    "status" "public"."booking_status" NOT NULL DEFAULT 'RESERVED',
    "total_price" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."booking_seat" (
    "id" TEXT NOT NULL,
    "booking_id" TEXT NOT NULL,
    "seat_id" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "booking_seat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cinema_name_key" ON "public"."cinema"("name");

-- CreateIndex
CREATE UNIQUE INDEX "hall_name_cinema_id_key" ON "public"."hall"("name", "cinema_id");

-- CreateIndex
CREATE UNIQUE INDEX "seat_seat_number_hall_id_key" ON "public"."seat"("seat_number", "hall_id");

-- CreateIndex
CREATE UNIQUE INDEX "movie_title_key" ON "public"."movie"("title");

-- CreateIndex
CREATE UNIQUE INDEX "actor_name_key" ON "public"."actor"("name");

-- CreateIndex
CREATE UNIQUE INDEX "director_name_key" ON "public"."director"("name");

-- CreateIndex
CREATE UNIQUE INDEX "movie_actor_movie_id_actor_id_key" ON "public"."movie_actor"("movie_id", "actor_id");

-- CreateIndex
CREATE UNIQUE INDEX "movie_director_movie_id_director_id_key" ON "public"."movie_director"("movie_id", "director_id");

-- CreateIndex
CREATE UNIQUE INDEX "time_slot_name_key" ON "public"."time_slot"("name");

-- CreateIndex
CREATE UNIQUE INDEX "showtime_movie_id_hall_id_time_slot_id_date_key" ON "public"."showtime"("movie_id", "hall_id", "time_slot_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "showtime_seat_showtime_id_seat_id_key" ON "public"."showtime_seat"("showtime_id", "seat_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "public"."user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "public"."user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_phone_key" ON "public"."user"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "booking_seat_booking_id_seat_id_key" ON "public"."booking_seat"("booking_id", "seat_id");

-- AddForeignKey
ALTER TABLE "public"."hall" ADD CONSTRAINT "hall_cinema_id_fkey" FOREIGN KEY ("cinema_id") REFERENCES "public"."cinema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."seat" ADD CONSTRAINT "seat_hall_id_fkey" FOREIGN KEY ("hall_id") REFERENCES "public"."hall"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."movie_actor" ADD CONSTRAINT "movie_actor_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "public"."actor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."movie_actor" ADD CONSTRAINT "movie_actor_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "public"."movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."movie_director" ADD CONSTRAINT "movie_director_director_id_fkey" FOREIGN KEY ("director_id") REFERENCES "public"."director"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."movie_director" ADD CONSTRAINT "movie_director_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "public"."movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."showtime" ADD CONSTRAINT "showtime_hall_id_fkey" FOREIGN KEY ("hall_id") REFERENCES "public"."hall"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."showtime" ADD CONSTRAINT "showtime_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "public"."movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."showtime" ADD CONSTRAINT "showtime_time_slot_id_fkey" FOREIGN KEY ("time_slot_id") REFERENCES "public"."time_slot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."showtime_seat" ADD CONSTRAINT "showtime_seat_seat_id_fkey" FOREIGN KEY ("seat_id") REFERENCES "public"."seat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."showtime_seat" ADD CONSTRAINT "showtime_seat_showtime_id_fkey" FOREIGN KEY ("showtime_id") REFERENCES "public"."showtime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."booking" ADD CONSTRAINT "booking_showtime_id_fkey" FOREIGN KEY ("showtime_id") REFERENCES "public"."showtime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."booking" ADD CONSTRAINT "booking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."booking_seat" ADD CONSTRAINT "booking_seat_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "public"."booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."booking_seat" ADD CONSTRAINT "booking_seat_seat_id_fkey" FOREIGN KEY ("seat_id") REFERENCES "public"."seat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
