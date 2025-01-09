/*
  Warnings:

  - You are about to drop the `historical_card_data` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `quickticket_data` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "historical_card_data";

-- DropTable
DROP TABLE "quickticket_data";

-- CreateTable
CREATE TABLE "monthly_swipes" (
    "id" SERIAL NOT NULL,
    "month_year" TEXT NOT NULL,
    "historical" INTEGER NOT NULL,
    "quickticket" INTEGER NOT NULL,

    CONSTRAINT "monthly_swipes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "top_routes" (
    "id" SERIAL NOT NULL,
    "route" INTEGER NOT NULL,
    "month_year" TEXT NOT NULL,
    "historical" INTEGER NOT NULL,
    "quickticket" INTEGER NOT NULL,

    CONSTRAINT "top_routes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unique_users" (
    "id" SERIAL NOT NULL,
    "month_year" TEXT NOT NULL,
    "historical" INTEGER NOT NULL,
    "quickticket" INTEGER NOT NULL,

    CONSTRAINT "unique_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "monthly_swipes_month_year_key" ON "monthly_swipes"("month_year");

-- CreateIndex
CREATE UNIQUE INDEX "top_routes_route_month_year_key" ON "top_routes"("route", "month_year");

-- CreateIndex
CREATE UNIQUE INDEX "unique_users_month_year_key" ON "unique_users"("month_year");
