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

async function ensureAllMonthsPresent(startYear: number, endYear: number) {
	console.log("Ensuring all months are present...");
	const months = [];
	for (let year = startYear; year <= endYear; year++) {
		for (let month = 1; month <= 12; month++) {
			const formattedMonth = `${year}-${month.toString().padStart(2, "0")}`;
			if (formattedMonth === "2024-12") continue; // Skip 2024-12
			months.push(formattedMonth);
		}
	}

	for (const monthYear of months) {
		const existingRecord = await prisma.monthlySwipes.findUnique({
			where: { monthYear },
		});

		if (!existingRecord) {
			console.log(`Adding missing month: ${monthYear}`);
			await prisma.monthlySwipes.create({
				data: {
					monthYear,
					historical: 0,
					quickticket: 0,
				},
			});
		}
	}

	console.log("All months ensured.");
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
				if (monthYear === "2024-12") return; // Skip 2024-12

				console.log(`Processing row: ${JSON.stringify(row)}`);

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
				console.log("Monthly Swipes Data:", monthlySwipes);
				try {
					// Insert or update Monthly Swipes
					for (const [monthYear, count] of Object.entries(monthlySwipes)) {
						try {
							console.log(
								`Upserting monthly swipes for ${monthYear}: historical = ${count}`
							);
							await prisma.monthlySwipes.upsert({
								where: { monthYear },
								update: { historical: { increment: count } },
								create: { monthYear, historical: count, quickticket: 0 },
							});

							if (monthYear === "2024-09") {
								console.log(
									`Successfully upserted historical data for ${monthYear}: historical = ${count}`
								);
							}
						} catch (error) {
							if (monthYear === "2024-09") {
								console.error(
									`Error upserting historical data for ${monthYear}: ${(error as Error).message}`
								);
							}
							throw error; // Re-throw to propagate failure
						}
					}

					// Insert or update Top Routes
					for (const route in topRoutes) {
						for (const monthYear in topRoutes[route]) {
							try {
								console.log(
									`Upserting top routes for ${monthYear}: route = ${route}, historical = ${topRoutes[route][monthYear]}`
								);
								await prisma.topRoutes.upsert({
									where: {
										route_monthYear: { route: Number(route), monthYear },
									},
									update: {
										historical: { increment: topRoutes[route][monthYear] },
									},
									create: {
										route: Number(route),
										monthYear,
										historical: topRoutes[route][monthYear],
										quickticket: 0,
									},
								});

								if (monthYear === "2024-09") {
									console.log(
										`Successfully upserted top routes for ${monthYear}: route = ${route}, historical = ${topRoutes[route][monthYear]}`
									);
								}
							} catch (error) {
								if (monthYear === "2024-09") {
									console.error(
										`Error upserting top routes for ${monthYear}: ${(error as Error).message}`
									);
								}
								throw error; // Re-throw to propagate failure
							}
						}
					}

					// Insert or update Unique Users
					for (const [monthYear, users] of Object.entries(uniqueUsers)) {
						try {
							console.log(
								`Upserting unique users for ${monthYear}: historical = ${users.size}`
							);
							await prisma.uniqueUsers.upsert({
								where: { monthYear },
								update: { historical: { increment: users.size } },
								create: { monthYear, historical: users.size, quickticket: 0 },
							});

							if (monthYear === "2024-09") {
								console.log(
									`Successfully upserted unique users for ${monthYear}: historical = ${users.size}`
								);
							}
						} catch (error) {
							if (monthYear === "2024-09") {
								console.error(
									`Error upserting unique users for ${monthYear}: ${(error as Error).message}`
								);
							}
							throw error; // Re-throw to propagate failure
						}
					}

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
				if (monthYear === "2024-12") return; // Skip 2024-12

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
					// Update or Insert Monthly Swipes
					for (const [monthYear, count] of Object.entries(monthlySwipes)) {
						await prisma.monthlySwipes.upsert({
							where: { monthYear },
							update: { quickticket: { increment: count } },
							create: { monthYear, historical: 0, quickticket: count },
						});
					}

					// Update or Insert Top Routes
					for (const route in topRoutes) {
						for (const monthYear in topRoutes[route]) {
							await prisma.topRoutes.upsert({
								where: { route_monthYear: { route: Number(route), monthYear } },
								update: {
									quickticket: { increment: topRoutes[route][monthYear] },
								},
								create: {
									route: Number(route),
									monthYear,
									historical: 0,
									quickticket: topRoutes[route][monthYear],
								},
							});
						}
					}

					// Update or Insert Unique Users
					for (const [monthYear, users] of Object.entries(uniqueUsers)) {
						await prisma.uniqueUsers.upsert({
							where: { monthYear },
							update: { quickticket: { increment: users.size } },
							create: { monthYear, historical: 0, quickticket: users.size },
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

		// Ensure all months are present
		await ensureAllMonthsPresent(2017, 2024);

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
