-- CreateTable
CREATE TABLE "quickticket_data" (
    "id" SERIAL NOT NULL,
    "cardoffice_card_number" BIGINT NOT NULL,
    "campus_id" TEXT NOT NULL,
    "ride_date" TIMESTAMP(3) NOT NULL,
    "route" INTEGER NOT NULL,
    "month_year" TEXT NOT NULL,

    CONSTRAINT "quickticket_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historical_card_data" (
    "id" SERIAL NOT NULL,
    "cardoffice_card_number" TEXT NOT NULL,
    "card_id_status" TEXT NOT NULL,
    "ride_date" TIMESTAMP(3) NOT NULL,
    "month_year" TEXT NOT NULL,
    "hour" INTEGER NOT NULL,
    "route" INTEGER NOT NULL,
    "employee_or_student" TEXT NOT NULL,
    "campus_id" TEXT NOT NULL,

    CONSTRAINT "historical_card_data_pkey" PRIMARY KEY ("id")
);
