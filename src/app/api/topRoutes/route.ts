/* eslint-disable @typescript-eslint/no-explicit-any */
// /api/getTopRoutesOverTime/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getMonthYear } from "../../../../lib/util";
import prisma from "../../../../lib/prisma";

// TODO: Make this dynamic
const TOP_ROUTES = [3, 50, 55, 56, 7, 75]; // Fixed top routes

// Top Routes API
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const startDate = url.searchParams.get("start") || "2016-12-25";
  const endDate = url.searchParams.get("end") || "2024-08-31";

  const startMonth = getMonthYear(startDate);
  const endMonth = getMonthYear(endDate);

  try {
    const data = await prisma.topRoutes.findMany({
      where: {
        route: { in: TOP_ROUTES }, // Filter by fixed routes
        monthYear: {
          gte: startMonth,
          lte: endMonth,
        },
      },
      orderBy: [{ route: "asc" }, { monthYear: "asc" }],
    });

    // Organize data by route
    const formattedData = TOP_ROUTES.map((route) => {
      const routeData = data
        .filter((item) => item.route === route)
        .map(({ monthYear, historical, quickticket }) => ({
          monthYear,
          count: historical + quickticket,
        }));
      return { route, monthlyData: routeData };
    });

    return new NextResponse(JSON.stringify(formattedData), { status: 200 });
  } catch (error) {
    console.error("Error fetching top routes:", error);
    return new NextResponse(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
    });
  }
}
