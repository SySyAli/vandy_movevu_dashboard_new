import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET(
	req: NextRequest
) {
	const url = new URL(req.url);
	const startDate = url.searchParams.get("start") || "2016-12-25";
	const endDate = url.searchParams.get("end") || "2024-08-31";

	try {
		const historicalData = await prisma.historicalCardData.groupBy({
			by: ["monthYear"],
			where: {
				rideDate: {
					gte: startDate,
					lte: endDate,
				},
				cardIdStatus: {
					not: "UNKNOWN",
				},
			},
			_count: {
				monthYear: true,
			},
		});

		const quickTicketData = await prisma.quickticketData.groupBy({
			by: ["monthYear"],
			where: {
				rideDate: {
					gte: startDate,
					lte: endDate,
				},
			},
			_count: {
				monthYear: true,
			},
		});

		// Mapping data to a combined format
		const combinedData: { [key: string]: { historical: number; quickticket: number } } = {};
		historicalData.forEach((data) => {
			combinedData[data.monthYear] = {
				historical: data._count.monthYear,
				quickticket: 0,
			};
		});

		quickTicketData.forEach((data) => {
			if (combinedData[data.monthYear]) {
				combinedData[data.monthYear].quickticket = data._count.monthYear;
			} else {
				combinedData[data.monthYear] = {
					historical: 0,
					quickticket: data._count.monthYear,
				};
			}
		});

		return new NextResponse(JSON.stringify(combinedData), { status: 200 });
	} catch (error) {
		console.error("Error processing data:", error);
		return new NextResponse(JSON.stringify({ error: (error as Error).message }), {
			status: 500,
		});
	}
}
