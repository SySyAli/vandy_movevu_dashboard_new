/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import csv from "csv-parser";

const prisma = new PrismaClient();

async function clearDatabase() {
  console.log("Clearing database...");
  await prisma.uniqueUsers.deleteMany();
  await prisma.topRoutes.deleteMany();
  await prisma.monthlySwipes.deleteMany();
  console.log("Database cleared.");
}

async function processHistoricalData(filePath: string) {
  const monthlySwipes: Record<string, any> = {};
  const topRoutes: Record<string, any> = {};
  const uniqueUsers: Record<string, Set<string>> = {};

  return new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        const monthYear = row.MONTH_YEAR;
        const route = Number(row.ROUTE);
        const campusId = row.CAMPUS_ID;

        // Monthly swipes
        if (!monthlySwipes[monthYear]) monthlySwipes[monthYear] = 0;
        monthlySwipes[monthYear] += 1;

        // Top routes
        if (!topRoutes[route]) topRoutes[route] = {};
        if (!topRoutes[route][monthYear]) topRoutes[route][monthYear] = 0;
        topRoutes[route][monthYear] += 1;

        // Unique users
        if (!uniqueUsers[monthYear]) uniqueUsers[monthYear] = new Set();
        uniqueUsers[monthYear].add(campusId);
      })
      .on("end", async () => {
        try {
          // Insert Monthly Swipes
          await prisma.monthlySwipes.createMany({
            data: Object.entries(monthlySwipes).map(([monthYear, count]) => ({
              monthYear,
              historical: count,
              quickticket: 0,
            })),
            skipDuplicates: true,
          });

          // Insert Top Routes
          const routeData = [];
          for (const route in topRoutes) {
            for (const monthYear in topRoutes[route]) {
              routeData.push({
                route: Number(route),
                monthYear,
                historical: topRoutes[route][monthYear],
                quickticket: 0,
              });
            }
          }
          await prisma.topRoutes.createMany({ data: routeData, skipDuplicates: true });

          // Insert Unique Users
          await prisma.uniqueUsers.createMany({
            data: Object.entries(uniqueUsers).map(([monthYear, users]) => ({
              monthYear,
              historical: users.size,
              quickticket: 0,
            })),
            skipDuplicates: true,
          });

          console.log("Historical data processed.");
          resolve();
        } catch (error) {
          console.error("Error processing historical data:", error);
          reject(error);
        }
      });
  });
}

async function processQuickticketData(filePath: string) {
  const monthlySwipes: Record<string, any> = {};
  const topRoutes: Record<string, any> = {};
  const uniqueUsers: Record<string, Set<string>> = {};

  return new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        const monthYear = row.MONTH_YEAR;
        const route = Number(row.ROUTE);
        const campusId = row.CAMPUS_ID;

        // Monthly swipes
        if (!monthlySwipes[monthYear]) monthlySwipes[monthYear] = 0;
        monthlySwipes[monthYear] += 1;

        // Top routes
        if (!topRoutes[route]) topRoutes[route] = {};
        if (!topRoutes[route][monthYear]) topRoutes[route][monthYear] = 0;
        topRoutes[route][monthYear] += 1;

        // Unique users
        if (!uniqueUsers[monthYear]) uniqueUsers[monthYear] = new Set();
        uniqueUsers[monthYear].add(campusId);
      })
      .on("end", async () => {
        try {
          // Update Monthly Swipes
          for (const [monthYear, count] of Object.entries(monthlySwipes)) {
            await prisma.monthlySwipes.updateMany({
              where: { monthYear },
              data: { quickticket: { increment: count } },
            });
          }

          // Update Top Routes
          for (const route in topRoutes) {
            for (const monthYear in topRoutes[route]) {
              await prisma.topRoutes.updateMany({
                where: { route: Number(route), monthYear },
                data: { quickticket: { increment: topRoutes[route][monthYear] } },
              });
            }
          }

          // Update Unique Users
          for (const [monthYear, users] of Object.entries(uniqueUsers)) {
            await prisma.uniqueUsers.updateMany({
              where: { monthYear },
              data: { quickticket: { increment: users.size } },
            });
          }

          console.log("Quickticket data processed.");
          resolve();
        } catch (error) {
          console.error("Error processing quickticket data:", error);
          reject(error);
        }
      });
  });
}

async function main() {
  try {
    await clearDatabase();

    await processHistoricalData(
      path.resolve(__dirname, "../public/data/historical_card_data.csv")
    );
    await processQuickticketData(
      path.resolve(__dirname, "../public/data/quickticket_data.csv")
    );
  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("Unexpected error:", error);
  prisma.$disconnect();
});
