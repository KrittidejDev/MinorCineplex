-- CreateEnum
CREATE TYPE "MovieStatus" AS ENUM ('COMING_SOON', 'NOW_SHOWING', 'ENDED');

-- CreateEnum
CREATE TYPE "SeatStatus" AS ENUM ('AVAILABLE', 'RESERVED', 'BOOKED');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'RESERVED', 'PAID', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'CUSTOMER');

-- CreateEnum
CREATE TYPE "CouponStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'EXPIRED');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('FIXED', 'PERCENTAGE', 'BUY_X_GET_Y', 'GIFT');

-- CreateEnum
CREATE TYPE "GiftType" AS ENUM ('POPCORN', 'COUPON_CODE', 'OTHER');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CREDIT_CARD', 'QR_CODE');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- CreateTable
CREATE TABLE "Cinema" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "translations" JSONB,
    "address" TEXT NOT NULL,
    "phone" TEXT,
    "city" TEXT,
    "city_en" TEXT,
    "group" TEXT,
    "group_en" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "icon_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cinema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hall" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "seat_count" INTEGER NOT NULL DEFAULT 50,
    "cinema_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hall_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeatTemplate" (
    "id" TEXT NOT NULL,
    "seat_number" TEXT NOT NULL,
    "row" TEXT NOT NULL,
    "col" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeatTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Genre" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "translations" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Movie" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "translations" JSONB,
    "duration_min" INTEGER NOT NULL,
    "poster_url" TEXT,
    "trailer_url" TEXT,
    "rating" TEXT,
    "release_date" TIMESTAMP(3),
    "status" "MovieStatus" NOT NULL DEFAULT 'COMING_SOON',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovieGenre" (
    "id" TEXT NOT NULL,
    "movie_id" TEXT NOT NULL,
    "genre_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MovieGenre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Actor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Actor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Director" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Director_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Language" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovieActor" (
    "id" TEXT NOT NULL,
    "movie_id" TEXT NOT NULL,
    "actor_id" TEXT NOT NULL,

    CONSTRAINT "MovieActor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovieDirector" (
    "id" TEXT NOT NULL,
    "movie_id" TEXT NOT NULL,
    "director_id" TEXT NOT NULL,

    CONSTRAINT "MovieDirector_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovieLanguage" (
    "id" TEXT NOT NULL,
    "movie_id" TEXT NOT NULL,
    "language_id" TEXT NOT NULL,

    CONSTRAINT "MovieLanguage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeSlot" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimeSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Showtime" (
    "id" TEXT NOT NULL,
    "movie_id" TEXT NOT NULL,
    "hall_id" TEXT NOT NULL,
    "cinema_id" TEXT NOT NULL,
    "time_slot_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 200.0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Showtime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShowtimeSeat" (
    "id" TEXT NOT NULL,
    "showtime_id" TEXT NOT NULL,
    "seat_template_id" TEXT NOT NULL,
    "status" "SeatStatus" NOT NULL DEFAULT 'AVAILABLE',
    "price" DOUBLE PRECISION,
    "locked_until" TIMESTAMP(3),
    "locked_by_user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShowtimeSeat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "avatar_url" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "public_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "showtime_id" TEXT NOT NULL,
    "coupon_id" TEXT,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "total_price" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingSeat" (
    "id" TEXT NOT NULL,
    "booking_id" TEXT NOT NULL,
    "showtime_seat_id" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookingSeat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coupon" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "code" TEXT,
    "translations" JSONB,
    "discount_type" "DiscountType" NOT NULL,
    "discount_value" DOUBLE PRECISION,
    "buy_quantity" INTEGER,
    "get_quantity" INTEGER,
    "gift_type" "GiftType",
    "gift_details" JSONB,
    "status" "CouponStatus" NOT NULL DEFAULT 'ACTIVE',
    "image_url" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "max_discount" DOUBLE PRECISION,
    "min_amount" DOUBLE PRECISION,
    "usage_limit" INTEGER,
    "used_count" INTEGER NOT NULL DEFAULT 0,
    "cinema_id" TEXT,
    "movie_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCoupon" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "coupon_id" TEXT NOT NULL,
    "is_collected" BOOLEAN NOT NULL DEFAULT false,
    "collected_at" TIMESTAMP(3),
    "is_used" BOOLEAN NOT NULL DEFAULT false,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserCoupon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "booking_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "payment_method" "PaymentMethod" NOT NULL DEFAULT 'CREDIT_CARD',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "transaction_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cinema_slug_key" ON "Cinema"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Cinema_name_key" ON "Cinema"("name");

-- CreateIndex
CREATE INDEX "Cinema_slug_idx" ON "Cinema"("slug");

-- CreateIndex
CREATE INDEX "Cinema_city_idx" ON "Cinema"("city");

-- CreateIndex
CREATE UNIQUE INDEX "Hall_slug_key" ON "Hall"("slug");

-- CreateIndex
CREATE INDEX "Hall_slug_idx" ON "Hall"("slug");

-- CreateIndex
CREATE INDEX "Hall_cinema_id_idx" ON "Hall"("cinema_id");

-- CreateIndex
CREATE UNIQUE INDEX "Hall_name_cinema_id_key" ON "Hall"("name", "cinema_id");

-- CreateIndex
CREATE UNIQUE INDEX "SeatTemplate_seat_number_key" ON "SeatTemplate"("seat_number");

-- CreateIndex
CREATE INDEX "SeatTemplate_seat_number_idx" ON "SeatTemplate"("seat_number");

-- CreateIndex
CREATE UNIQUE INDEX "Genre_slug_key" ON "Genre"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Genre_name_key" ON "Genre"("name");

-- CreateIndex
CREATE INDEX "Genre_slug_idx" ON "Genre"("slug");

-- CreateIndex
CREATE INDEX "Genre_name_idx" ON "Genre"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Movie_slug_key" ON "Movie"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Movie_title_key" ON "Movie"("title");

-- CreateIndex
CREATE INDEX "Movie_slug_idx" ON "Movie"("slug");

-- CreateIndex
CREATE INDEX "Movie_release_date_idx" ON "Movie"("release_date");

-- CreateIndex
CREATE INDEX "Movie_status_idx" ON "Movie"("status");

-- CreateIndex
CREATE INDEX "MovieGenre_movie_id_idx" ON "MovieGenre"("movie_id");

-- CreateIndex
CREATE INDEX "MovieGenre_genre_id_idx" ON "MovieGenre"("genre_id");

-- CreateIndex
CREATE UNIQUE INDEX "MovieGenre_movie_id_genre_id_key" ON "MovieGenre"("movie_id", "genre_id");

-- CreateIndex
CREATE UNIQUE INDEX "Actor_name_key" ON "Actor"("name");

-- CreateIndex
CREATE INDEX "Actor_name_idx" ON "Actor"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Director_name_key" ON "Director"("name");

-- CreateIndex
CREATE INDEX "Director_name_idx" ON "Director"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Language_name_key" ON "Language"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Language_code_key" ON "Language"("code");

-- CreateIndex
CREATE INDEX "Language_code_idx" ON "Language"("code");

-- CreateIndex
CREATE INDEX "MovieActor_movie_id_idx" ON "MovieActor"("movie_id");

-- CreateIndex
CREATE INDEX "MovieActor_actor_id_idx" ON "MovieActor"("actor_id");

-- CreateIndex
CREATE UNIQUE INDEX "MovieActor_movie_id_actor_id_key" ON "MovieActor"("movie_id", "actor_id");

-- CreateIndex
CREATE INDEX "MovieDirector_movie_id_idx" ON "MovieDirector"("movie_id");

-- CreateIndex
CREATE INDEX "MovieDirector_director_id_idx" ON "MovieDirector"("director_id");

-- CreateIndex
CREATE UNIQUE INDEX "MovieDirector_movie_id_director_id_key" ON "MovieDirector"("movie_id", "director_id");

-- CreateIndex
CREATE INDEX "MovieLanguage_movie_id_idx" ON "MovieLanguage"("movie_id");

-- CreateIndex
CREATE INDEX "MovieLanguage_language_id_idx" ON "MovieLanguage"("language_id");

-- CreateIndex
CREATE UNIQUE INDEX "MovieLanguage_movie_id_language_id_key" ON "MovieLanguage"("movie_id", "language_id");

-- CreateIndex
CREATE UNIQUE INDEX "TimeSlot_name_key" ON "TimeSlot"("name");

-- CreateIndex
CREATE INDEX "TimeSlot_name_idx" ON "TimeSlot"("name");

-- CreateIndex
CREATE INDEX "Showtime_movie_id_idx" ON "Showtime"("movie_id");

-- CreateIndex
CREATE INDEX "Showtime_hall_id_idx" ON "Showtime"("hall_id");

-- CreateIndex
CREATE INDEX "Showtime_cinema_id_idx" ON "Showtime"("cinema_id");

-- CreateIndex
CREATE INDEX "Showtime_date_idx" ON "Showtime"("date");

-- CreateIndex
CREATE UNIQUE INDEX "Showtime_movie_id_hall_id_time_slot_id_date_key" ON "Showtime"("movie_id", "hall_id", "time_slot_id", "date");

-- CreateIndex
CREATE INDEX "ShowtimeSeat_showtime_id_idx" ON "ShowtimeSeat"("showtime_id");

-- CreateIndex
CREATE INDEX "ShowtimeSeat_seat_template_id_idx" ON "ShowtimeSeat"("seat_template_id");

-- CreateIndex
CREATE INDEX "ShowtimeSeat_locked_by_user_id_idx" ON "ShowtimeSeat"("locked_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "ShowtimeSeat_showtime_id_seat_template_id_key" ON "ShowtimeSeat"("showtime_id", "seat_template_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_phone_idx" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_public_id_key" ON "Booking"("public_id");

-- CreateIndex
CREATE INDEX "Booking_public_id_idx" ON "Booking"("public_id");

-- CreateIndex
CREATE INDEX "Booking_user_id_idx" ON "Booking"("user_id");

-- CreateIndex
CREATE INDEX "Booking_showtime_id_idx" ON "Booking"("showtime_id");

-- CreateIndex
CREATE INDEX "Booking_coupon_id_idx" ON "Booking"("coupon_id");

-- CreateIndex
CREATE INDEX "BookingSeat_booking_id_idx" ON "BookingSeat"("booking_id");

-- CreateIndex
CREATE INDEX "BookingSeat_showtime_seat_id_idx" ON "BookingSeat"("showtime_seat_id");

-- CreateIndex
CREATE UNIQUE INDEX "BookingSeat_booking_id_showtime_seat_id_key" ON "BookingSeat"("booking_id", "showtime_seat_id");

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_slug_key" ON "Coupon"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_code_key" ON "Coupon"("code");

-- CreateIndex
CREATE INDEX "Coupon_slug_idx" ON "Coupon"("slug");

-- CreateIndex
CREATE INDEX "Coupon_code_idx" ON "Coupon"("code");

-- CreateIndex
CREATE INDEX "Coupon_cinema_id_idx" ON "Coupon"("cinema_id");

-- CreateIndex
CREATE INDEX "Coupon_movie_id_idx" ON "Coupon"("movie_id");

-- CreateIndex
CREATE INDEX "Coupon_start_date_end_date_idx" ON "Coupon"("start_date", "end_date");

-- CreateIndex
CREATE INDEX "UserCoupon_user_id_idx" ON "UserCoupon"("user_id");

-- CreateIndex
CREATE INDEX "UserCoupon_coupon_id_idx" ON "UserCoupon"("coupon_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserCoupon_user_id_coupon_id_key" ON "UserCoupon"("user_id", "coupon_id");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_booking_id_key" ON "Payment"("booking_id");

-- CreateIndex
CREATE INDEX "Payment_booking_id_idx" ON "Payment"("booking_id");

-- CreateIndex
CREATE INDEX "Payment_user_id_idx" ON "Payment"("user_id");

-- CreateIndex
CREATE INDEX "Payment_transaction_id_idx" ON "Payment"("transaction_id");

-- AddForeignKey
ALTER TABLE "Hall" ADD CONSTRAINT "Hall_cinema_id_fkey" FOREIGN KEY ("cinema_id") REFERENCES "Cinema"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieGenre" ADD CONSTRAINT "MovieGenre_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieGenre" ADD CONSTRAINT "MovieGenre_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieActor" ADD CONSTRAINT "MovieActor_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "Actor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieActor" ADD CONSTRAINT "MovieActor_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieDirector" ADD CONSTRAINT "MovieDirector_director_id_fkey" FOREIGN KEY ("director_id") REFERENCES "Director"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieDirector" ADD CONSTRAINT "MovieDirector_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieLanguage" ADD CONSTRAINT "MovieLanguage_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieLanguage" ADD CONSTRAINT "MovieLanguage_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Showtime" ADD CONSTRAINT "Showtime_hall_id_fkey" FOREIGN KEY ("hall_id") REFERENCES "Hall"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Showtime" ADD CONSTRAINT "Showtime_cinema_id_fkey" FOREIGN KEY ("cinema_id") REFERENCES "Cinema"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Showtime" ADD CONSTRAINT "Showtime_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Showtime" ADD CONSTRAINT "Showtime_time_slot_id_fkey" FOREIGN KEY ("time_slot_id") REFERENCES "TimeSlot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShowtimeSeat" ADD CONSTRAINT "ShowtimeSeat_seat_template_id_fkey" FOREIGN KEY ("seat_template_id") REFERENCES "SeatTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShowtimeSeat" ADD CONSTRAINT "ShowtimeSeat_showtime_id_fkey" FOREIGN KEY ("showtime_id") REFERENCES "Showtime"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShowtimeSeat" ADD CONSTRAINT "ShowtimeSeat_locked_by_user_id_fkey" FOREIGN KEY ("locked_by_user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_showtime_id_fkey" FOREIGN KEY ("showtime_id") REFERENCES "Showtime"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "Coupon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingSeat" ADD CONSTRAINT "BookingSeat_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingSeat" ADD CONSTRAINT "BookingSeat_showtime_seat_id_fkey" FOREIGN KEY ("showtime_seat_id") REFERENCES "ShowtimeSeat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coupon" ADD CONSTRAINT "Coupon_cinema_id_fkey" FOREIGN KEY ("cinema_id") REFERENCES "Cinema"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coupon" ADD CONSTRAINT "Coupon_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "Movie"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCoupon" ADD CONSTRAINT "UserCoupon_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "Coupon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCoupon" ADD CONSTRAINT "UserCoupon_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
