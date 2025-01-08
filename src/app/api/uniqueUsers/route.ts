import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { getMonthYear } from "../../../../lib/util";

// Unique Users API
export async function GET(req: NextRequest) {
	const url = new URL(req.url);
	const startDate = url.searchParams.get("start") || "2016-12-25";
	const endDate = url.searchParams.get("end") || "2024-09-31";
  
	const startMonth = getMonthYear(startDate);
	const endMonth = getMonthYear(endDate);
  
	try {
	  const data = await prisma.uniqueUsers.findMany({
		where: {
		  monthYear: {
			gte: startMonth,
			lte: endMonth,
		  },
		},
		orderBy: { monthYear: "asc" },
	  });
  
	  return new NextResponse(JSON.stringify(data), { status: 200 });
	} catch (error) {
	  console.error("Error fetching unique users:", error);
	  return new NextResponse(JSON.stringify({ error: (error as Error).message }), {
		status: 500,
	  });
	}
  }