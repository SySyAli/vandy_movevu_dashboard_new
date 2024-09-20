import { NextResponse } from "next/server";
import { createReadStream } from "fs";
import path from "path";
import csv from "csv-parser";

// TODO: have it be a stacked barchart and add a datepicker to select the range of dates to display
// TODO: 1. add quickticket data to the backend, then add a stacked barchart to the frontend, then add date picker
// TODO: Figure out what graphics to put up and design as well?

interface Options {
	CheckUnknown?: boolean;
}

interface MonthYearCounts {
	[monthYear: string]: number;
}

interface CombinedData {
	[monthYear: string]: {
		historical: number;
		quickticket: number;
	};
}

async function fetchDataFromCSV(
	filePath: string,
	options: Options = { CheckUnknown: true }
): Promise<MonthYearCounts> {
	const csvStream = createReadStream(filePath);
	const monthYearCounts: MonthYearCounts = {};

	return new Promise((resolve, reject) => {
		csvStream
			.pipe(csv())
			.on("data", (row) => {
				const monthYear = row.MONTH_YEAR;
				if (options.CheckUnknown) {
					const cardIdStatus = row.CARD_ID_STATUS;
					if (cardIdStatus !== "UNKNOWN") {
						monthYearCounts[monthYear] = (monthYearCounts[monthYear] || 0) + 1;
					}
				} else {
					monthYearCounts[monthYear] = (monthYearCounts[monthYear] || 0) + 1;
				}
			})
			.on("end", () => {
				resolve(monthYearCounts);
			})
			.on("error", (error) => {
				console.error("Error reading CSV file:", error);
				reject(error);
			});
	});
}

export async function GET() {
	try {
		const historicalDataPath = path.join(
			process.cwd(),
			"public/data/historical/historical_data.csv"
		);
		const quickticketDataPath = path.join(
			process.cwd(),
			"public/data/quickticket/quickticket_data.csv"
		);

		const historicalData = await fetchDataFromCSV(historicalDataPath, {
			CheckUnknown: true,
		});
		const quickticketData = await fetchDataFromCSV(quickticketDataPath, {
			CheckUnknown: false,
		});

		const combinedDataKeys = Object.keys({
			...historicalData,
			...quickticketData,
		}).sort((a, b) => new Date(a).getTime() - new Date(b).getTime()); // Sort keys chronologically

		const combinedData: CombinedData = combinedDataKeys.reduce<CombinedData>((acc, key) => {
			acc[key] = {
				historical: historicalData[key] || 0,
				quickticket: quickticketData[key] || 0,
			};
			return acc;
		}, {} as CombinedData);

		return NextResponse.json(combinedData);
	} catch (error) {
		console.error("Error combining data:", error);
		return NextResponse.error();
	}
}
