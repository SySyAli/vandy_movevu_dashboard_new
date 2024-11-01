/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import csv from "csv-parser";

const prisma = new PrismaClient();

async function loadCsvToQuickticketData(filePath: string) {
	const data: Record<string, any>[] = [];
	return new Promise<void>((resolve, reject) => {
		fs.createReadStream(filePath)
			.pipe(csv())
			.on("data", (row) => data.push(row))
			.on("end", async () => {
				try {
					const formattedData = data.map((row) => ({
						cardofficeCardNumber: row.CARDOFFICE_CARD_NUMBER,
						campusId: row.CAMPUS_ID,
						rideDate: new Date(row.RIDE_DATE),
						route: Number(row.ROUTE),
						monthYear: row.MONTH_YEAR,
					}));
					await prisma.quickticketData.createMany({
						data: formattedData,
						skipDuplicates: true,
					});
					console.log(`Data successfully added to QuickticketData`);
					resolve();
				} catch (error) {
					console.error(`Error adding data to QuickticketData:`, error);
					reject(error);
				}
			});
	});
}

async function loadCsvToHistoricalCardData(filePath: string) {
	const data: Record<string, any>[] = [];
	const batchSize = 10000;

	return new Promise<void>((resolve, reject) => {
		fs.createReadStream(filePath)
			.pipe(csv())
			.on("data", (row) => data.push(row))
			.on("end", async () => {
				try {
					for (let i = 0; i < data.length; i += batchSize) {
						const batch = data.slice(i, i + batchSize).map((row) => ({
							cardofficeCardNumber: row.CARDOFFICE_CARD_NUMBER,
							cardIdStatus: row.CARD_ID_STATUS,
							rideDate: new Date(row.RIDE_DATE),
							monthYear: row.MONTH_YEAR,
							hour: Number(row.HOUR),
							route: Number(row.ROUTE),
							employeeOrStudent: row.EMPLOYEE_OR_STUDENT,
							campusId: row.CAMPUS_ID,
						}));
						await prisma.historicalCardData.createMany({
							data: batch,
							skipDuplicates: true,
						});
						console.log(`Inserted batch ${i / batchSize + 1}`);
					}
					console.log(`Data successfully added to HistoricalCardData`);
					resolve();
				} catch (error) {
					console.error(`Error adding data to HistoricalCardData:`, error);
					reject(error);
				}
			});
	});
}

async function main() {
	try {
		await loadCsvToQuickticketData(
			path.resolve(__dirname, "../notebooks/data/quickticket.csv")
		);
		await loadCsvToHistoricalCardData(
			path.resolve(__dirname, "../notebooks/data/historical_data.csv")
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
