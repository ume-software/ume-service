-- CreateEnum
CREATE TYPE "CoinType" AS ENUM ('SPEND_BOOKING', 'SPEND_GIFT', 'SPEND_DONATE', 'GET_BOOKING', 'GET_DONATE', 'GET_GIFT', 'BUY_COIN', 'GET_MISSION', 'WITHDRAW', 'ADMIN');

-- CreateEnum
CREATE TYPE "LoginType" AS ENUM ('INAPP', 'FACEBOOK', 'GOOGLE', 'KAKAO', 'APPLE', 'PHONE');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "login_type" "LoginType",

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "provider" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "user_id" TEXT NOT NULL,
    "name" TEXT,
    "avatar_url" TEXT,
    "voice_url" TEXT,
    "description" TEXT,

    CONSTRAINT "provider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skill" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "name" TEXT,
    "image_url" TEXT,

    CONSTRAINT "skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "provider_skill" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "user_id" TEXT NOT NULL,
    "skill_id" TEXT NOT NULL,

    CONSTRAINT "provider_skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_cost" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "provider_skill_id" TEXT NOT NULL,
    "start_time_of_day" TEXT,
    "end_time_of_day" TEXT,
    "amount" DOUBLE PRECISION,

    CONSTRAINT "booking_cost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coin_history" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "user_id" TEXT NOT NULL,
    "coinType" "CoinType",
    "amount" DOUBLE PRECISION,

    CONSTRAINT "coin_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_history" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "booker_id" TEXT,
    "provider_id" TEXT,

    CONSTRAINT "booking_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vote_history" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "booker_id" TEXT NOT NULL,
    "booking_id" TEXT NOT NULL,
    "amount_start" INTEGER,

    CONSTRAINT "vote_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "provider_user_id_key" ON "provider"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "provider_skill_user_id_key" ON "provider_skill"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "provider_skill_skill_id_key" ON "provider_skill"("skill_id");

-- CreateIndex
CREATE UNIQUE INDEX "booking_cost_provider_skill_id_key" ON "booking_cost"("provider_skill_id");

-- AddForeignKey
ALTER TABLE "provider" ADD CONSTRAINT "provider_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "provider_skill" ADD CONSTRAINT "provider_skill_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "provider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "provider_skill" ADD CONSTRAINT "provider_skill_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_cost" ADD CONSTRAINT "booking_cost_provider_skill_id_fkey" FOREIGN KEY ("provider_skill_id") REFERENCES "provider_skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coin_history" ADD CONSTRAINT "coin_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_history" ADD CONSTRAINT "booking_history_booker_id_fkey" FOREIGN KEY ("booker_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_history" ADD CONSTRAINT "booking_history_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "provider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vote_history" ADD CONSTRAINT "vote_history_booker_id_fkey" FOREIGN KEY ("booker_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vote_history" ADD CONSTRAINT "vote_history_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "booking_history"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
