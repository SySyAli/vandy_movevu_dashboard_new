// /api/getUniqueUsersPerMonth/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
	const url = new URL(req.url);
	const startDate = url.searchParams.get("start") || "2016-12-25";
	const endDate = url.searchParams.get("end") || "2024-09-31";

	try {
		// Step 1: Filter and deduplicate historical data
		const historicalData = await prisma.historicalCardData.findMany({
			where: {
				rideDate: {
					gte: new Date(startDate),
					lte: new Date(endDate),
				},
			},
			select: {
				monthYear: true,
				campusId: true,
			},
			distinct: ["monthYear", "campusId"],
		});

		// Step 2: Filter and deduplicate quickticket data
		const quickticketData = await prisma.quickticketData.findMany({
			where: {
				rideDate: {
					gte: new Date(startDate),
					lte: new Date(endDate),
				},
			},
			select: {
				monthYear: true,
				campusId: true,
			},
			distinct: ["monthYear", "campusId"],
		});

		// Step 3: Count unique users by month for historical data
		const historicalUniqueUsers = historicalData.reduce((acc: Record<string, number>, item) => {
			const month = item.monthYear;
			if (!acc[month]) {
				acc[month] = 0;
			}
			acc[month] += 1;
			return acc;
		}, {});

		// Step 4: Count unique users by month for quickticket data
		const quickticketUniqueUsers = quickticketData.reduce((acc: Record<string, number>, item) => {
			const month = item.monthYear;
			if (!acc[month]) {
				acc[month] = 0;
			}
			acc[month] += 1;
			return acc;
		}, {});

		// Step 5: Combine and sort results
		const combinedData: { [key: string]: { historical: number; quickticket: number } } = {};

		for (const [month, count] of Object.entries(historicalUniqueUsers)) {
			combinedData[month] = {
				historical: count,
				quickticket: 0,
			};
		}

		for (const [month, count] of Object.entries(quickticketUniqueUsers)) {
			if (combinedData[month]) {
				combinedData[month].quickticket = count;
			} else {
				combinedData[month] = {
					historical: 0,
					quickticket: count,
				};
			}
		}

		// Convert to array and sort by monthYear
		const sortedData = Object.entries(combinedData)
			.map(([monthYear, counts]) => ({ monthYear, ...counts }))
			.sort((a, b) => a.monthYear.localeCompare(b.monthYear));

		return new NextResponse(JSON.stringify(sortedData), { status: 200 });
	} catch (error) {
		console.error("Error processing unique users data:", error);
		return new NextResponse(JSON.stringify({ error: (error as Error).message }), {
			status: 500,
		});
	}
}
