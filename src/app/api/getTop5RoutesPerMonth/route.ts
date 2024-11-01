/* eslint-disable @typescript-eslint/no-explicit-any */
// /api/getTopRoutesOverTime/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
	const url = new URL(req.url);
	const startDate = url.searchParams.get("start") || "2016-12-25";
	const endDate = url.searchParams.get("end") || "2024-08-31";

	try {
		// Step 1: Fetch ridership by route and month for historical data
		const historicalData = await prisma.historicalCardData.groupBy({
			by: ["route", "monthYear"],
			where: {
				rideDate: {
					gte: new Date(startDate),
					lte: new Date(endDate),
				},
			},
			_count: {
				route: true,
			},
		});

		// Step 2: Fetch ridership by route and month for quickticket data
		const quickticketData = await prisma.quickticketData.groupBy({
			by: ["route", "monthYear"],
			where: {
				rideDate: {
					gte: new Date(startDate),
					lte: new Date(endDate),
				},
			},
			_count: {
				route: true,
			},
		});

		// Step 3: Combine routes (3 with 5, and 25 with 75) and aggregate counts
		const aggregateRoutes = (data: any[]) => {
			return data.reduce(
				(acc: Record<string, Record<string, number>>, curr) => {
					// Combine routes as per specified rules
					const route =
						curr.route === 5 ? 3 : curr.route === 25 ? 75 : curr.route;
					const monthYear = curr.monthYear;

					if (!acc[route]) {
						acc[route] = {};
					}
					if (!acc[route][monthYear]) {
						acc[route][monthYear] = 0;
					}

					acc[route][monthYear] += curr._count.route;
					return acc;
				},
				{}
			);
		};

		const historicalAggregated = aggregateRoutes(historicalData);
		const quickticketAggregated = aggregateRoutes(quickticketData);

		// Step 4: Calculate total ridership for each route and find the top 5
		const calculateTopRoutes = (
			data: Record<string, Record<string, number>>
		) => {
			const totalRidershipByRoute = Object.keys(data).map((route) => ({
				route,
				totalRidership: Object.values(data[route]).reduce(
					(sum, count) => sum + count,
					0
				),
			}));

			// Sort routes by total ridership and pick the top 5
			const topRoutes = totalRidershipByRoute
				.sort((a, b) => b.totalRidership - a.totalRidership)
				.slice(0, 5)
				.map((item) => item.route);

			// Filter data to include only the top 5 routes
			return topRoutes.reduce(
				(acc: Record<string, Record<string, number>>, route) => {
					acc[route] = data[route];
					return acc;
				},
				{}
			);
		};

		const topHistoricalRoutes = calculateTopRoutes(historicalAggregated);
		const topQuickticketRoutes = calculateTopRoutes(quickticketAggregated);

		// Step 5: Structure data for response
		const formatData = (data: Record<string, Record<string, number>>) => {
			return Object.entries(data).map(([route, monthlyCounts]) => ({
				route,
				monthlyData: Object.entries(monthlyCounts)
					.map(([monthYear, count]) => ({ monthYear, count }))
					.sort((a, b) => a.monthYear.localeCompare(b.monthYear)),
			}));
		};

		const response = {
			historical: formatData(topHistoricalRoutes),
			quickticket: formatData(topQuickticketRoutes),
		};

		return new NextResponse(JSON.stringify(response), { status: 200 });
	} catch (error) {
		console.error("Error processing top routes data:", error);
		return new NextResponse(
			JSON.stringify({ error: (error as Error).message }),
			{
				status: 500,
			}
		);
	}
}
