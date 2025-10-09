-- CreateTable
CREATE TABLE "cinema" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT,
    "description" TEXT,
    "group_location" TEXT,
    "lat" REAL,
    "lng" REAL,
    "icon_url" TEXT,
    "opening_hours" TEXT,
    "transportation" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "name_en" TEXT,
    "description_en" TEXT,
    "group_location_en" TEXT,
    "province" TEXT,
    "province_en" TEXT
);

-- CreateTable
CREATE TABLE "hall" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "seat_count" INTEGER DEFAULT 50,
    "cinema_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "hall_cinema_id_fkey" FOREIGN KEY ("cinema_id") REFERENCES "cinema" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "seat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "seat_number" TEXT NOT NULL,
    "row" TEXT NOT NULL,
    "col" TEXT NOT NULL,
    "hall_id" TEXT NOT NULL,
    CONSTRAINT "seat_hall_id_fkey" FOREIGN KEY ("hall_id") REFERENCES "hall" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "movie" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "duration_min" INTEGER NOT NULL,
    "description" TEXT,
    "poster_url" TEXT,
    "trailer_url" TEXT,
    "genre" TEXT,
    "rating" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "release_date" DATETIME,
    "title_en" TEXT,
    "description_en" TEXT,
    "genre_en" TEXT
);

-- CreateTable
CREATE TABLE "actor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "image_url" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "name_en" TEXT
);

-- CreateTable
CREATE TABLE "director" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "image_url" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "name_en" TEXT
);

-- CreateTable
CREATE TABLE "movie_actor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "movie_id" TEXT NOT NULL,
    "actor_id" TEXT NOT NULL,
    CONSTRAINT "movie_actor_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "actor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "movie_actor_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movie" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "movie_director" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "movie_id" TEXT NOT NULL,
    "director_id" TEXT NOT NULL,
    CONSTRAINT "movie_director_director_id_fkey" FOREIGN KEY ("director_id") REFERENCES "director" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "movie_director_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movie" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "time_slot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "showtime" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "movie_id" TEXT NOT NULL,
    "hall_id" TEXT NOT NULL,
    "time_slot_id" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "price" REAL NOT NULL DEFAULT 200,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "showtime_hall_id_fkey" FOREIGN KEY ("hall_id") REFERENCES "hall" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "showtime_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movie" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "showtime_time_slot_id_fkey" FOREIGN KEY ("time_slot_id") REFERENCES "time_slot" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "showtime_seat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "showtime_id" TEXT NOT NULL,
    "seat_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "price" REAL,
    CONSTRAINT "showtime_seat_seat_id_fkey" FOREIGN KEY ("seat_id") REFERENCES "seat" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "showtime_seat_showtime_id_fkey" FOREIGN KEY ("showtime_id") REFERENCES "showtime" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'CUSTOMER',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "avatar_id" TEXT,
    "avatar_url" TEXT
);

-- CreateTable
CREATE TABLE "booking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "showtime_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'RESERVED',
    "total_price" REAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "booking_showtime_id_fkey" FOREIGN KEY ("showtime_id") REFERENCES "showtime" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "booking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "booking_seat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "booking_id" TEXT NOT NULL,
    "seat_id" TEXT NOT NULL,
    "price" REAL NOT NULL,
    CONSTRAINT "booking_seat_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "booking" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "booking_seat_seat_id_fkey" FOREIGN KEY ("seat_id") REFERENCES "seat" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "coupon" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "title_en" TEXT NOT NULL,
    "title_th" TEXT NOT NULL,
    "discription_en" TEXT NOT NULL,
    "discription_th" TEXT NOT NULL,
    "discount_type" TEXT NOT NULL,
    "discount_value" REAL NOT NULL,
    "status" TEXT NOT NULL,
    "image" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" DATETIME NOT NULL,
    "max_discount" REAL,
    "min_amount" REAL,
    "start_date" DATETIME NOT NULL,
    "updated_at" DATETIME NOT NULL,
    "usage_limit" INTEGER,
    "used_count" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "UserCoupon" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "coupon_id" INTEGER NOT NULL,
    "is_collected" BOOLEAN NOT NULL DEFAULT false,
    "collected_at" DATETIME,
    CONSTRAINT "UserCoupon_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserCoupon_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "coupon" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "cinema_name_key" ON "cinema"("name");

-- CreateIndex
CREATE UNIQUE INDEX "hall_name_cinema_id_key" ON "hall"("name", "cinema_id");

-- CreateIndex
CREATE UNIQUE INDEX "seat_seat_number_hall_id_key" ON "seat"("seat_number", "hall_id");

-- CreateIndex
CREATE UNIQUE INDEX "movie_title_key" ON "movie"("title");

-- CreateIndex
CREATE UNIQUE INDEX "actor_name_key" ON "actor"("name");

-- CreateIndex
CREATE UNIQUE INDEX "director_name_key" ON "director"("name");

-- CreateIndex
CREATE UNIQUE INDEX "movie_actor_movie_id_actor_id_key" ON "movie_actor"("movie_id", "actor_id");

-- CreateIndex
CREATE UNIQUE INDEX "movie_director_movie_id_director_id_key" ON "movie_director"("movie_id", "director_id");

-- CreateIndex
CREATE UNIQUE INDEX "time_slot_name_key" ON "time_slot"("name");

-- CreateIndex
CREATE UNIQUE INDEX "showtime_movie_id_hall_id_time_slot_id_date_key" ON "showtime"("movie_id", "hall_id", "time_slot_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "showtime_seat_showtime_id_seat_id_key" ON "showtime_seat"("showtime_id", "seat_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_phone_key" ON "user"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "booking_seat_booking_id_seat_id_key" ON "booking_seat"("booking_id", "seat_id");

-- CreateIndex
CREATE UNIQUE INDEX "coupon_code_key" ON "coupon"("code");

-- CreateIndex
CREATE UNIQUE INDEX "UserCoupon_user_id_coupon_id_key" ON "UserCoupon"("user_id", "coupon_id");
