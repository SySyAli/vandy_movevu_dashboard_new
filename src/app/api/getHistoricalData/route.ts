import { NextRequest, NextResponse } from "next/server";
import { createReadStream } from "fs";
import path from "path";
import csv from "csv-parser";

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
				if (!options.CheckUnknown || row.CARD_ID_STATUS !== "UNKNOWN") {
					monthYearCounts[monthYear] = (monthYearCounts[monthYear] || 0) + 1;
				}
			})
			.on("end", () => {
				resolve(monthYearCounts);
			})
			.on("error", (error) => {
				reject(new Error(`Error reading CSV file: ${error.message}`));
			});
	});
}

export async function GET(request: NextRequest) {
	const url = new URL(request.url);
	const startDate = url.searchParams.get("start") || "2016-12-25";
	const endDate = url.searchParams.get("end") || "2024-08-31";

	try {
		const historicalDataPath = path.join(
			process.cwd(),
			"public/data/historical/historical_data.csv"
		);
		const quickticketDataPath = path.join(
			process.cwd(),
			"public/data/quickticket/quickticket_data.csv"
		);

		const [historicalData, quickticketData] = await Promise.all([
			fetchDataFromCSV(historicalDataPath, { CheckUnknown: true }),
			fetchDataFromCSV(quickticketDataPath, { CheckUnknown: false }),
		]);

		const filteredKeys = Object.keys({ ...historicalData, ...quickticketData })
			.filter((key) => key >= startDate && key <= endDate)
			.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

		const combinedData: CombinedData = filteredKeys.reduce((acc, key) => {
			acc[key] = {
				historical: historicalData[key] || 0,
				quickticket: quickticketData[key] || 0,
			};
			return acc;
		}, {} as CombinedData);

		return new NextResponse(JSON.stringify(combinedData), { status: 200 });
	} catch (error) {
		console.error("Error processing data:", error);
		return new NextResponse(JSON.stringify({ error: (error as Error).message }), {
			status: 500,
		});
	}
}
