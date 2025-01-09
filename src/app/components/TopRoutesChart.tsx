/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import ChartContainer from "./ChartContainer";
import DateRangePicker from "./DateRangePicker";
import LoadingSpinner from "./LoadingSpinner";

Chart.register(...registerables);

const TopRoutesChart = () => {
	const [topRoutesData, setTopRoutesData] = useState<
		{ route: string; monthlyData: { monthYear: string; count: number }[] }[]
	>([]);
	const [loading, setLoading] = useState(true);
	const [startDate, setStartDate] = useState(new Date("2016-12-31"));
	const [endDate, setEndDate] = useState(new Date("2024-12-30"));

	// Define color palette for routes
	const colorPalette = [
		"rgba(75, 192, 192, 1)", // Teal
		"rgba(153, 102, 255, 1)", // Purple
		"rgba(255, 159, 64, 1)", // Orange
		"rgba(255, 99, 132, 1)", // Red
		"rgba(54, 162, 235, 1)", // Blue
		"rgba(255, 205, 86, 1)", // Yellow
	];

	useEffect(() => {
		setLoading(true);
		const fetchData = async () => {
			const formattedStartDate = startDate.toISOString();
			const formattedEndDate = endDate.toISOString();
			const url = `/api/topRoutes?start=${formattedStartDate}&end=${formattedEndDate}`;
			const res = await fetch(url);
			const data = await res.json();

			// Create a combined map of all monthYears
			const allMonths = new Set<string>();
			data.forEach((route: any) => {
				route.monthlyData.forEach((entry: any) =>
					allMonths.add(entry.monthYear)
				);
			});
			const sortedMonths = Array.from(allMonths).sort();

			// Fill missing months with zero counts
			const filledData = data.map((route: any) => {
				const monthlyDataMap = new Map(
					route.monthlyData.map((entry: any) => [entry.monthYear, entry.count])
				);
				const filledMonthlyData = sortedMonths.map((month) => ({
					monthYear: month,
					count: monthlyDataMap.get(month) || 0,
				}));
				return { route: route.route, monthlyData: filledMonthlyData };
			});

			setTopRoutesData(filledData);
			setLoading(false);
		};

		fetchData();
	}, [startDate, endDate]);

	// Handle loading state
	if (loading) {
		return <LoadingSpinner />;
	}

	// Prepare chart data
	const chartData = {
		labels: topRoutesData[0]?.monthlyData.map((data) => data.monthYear) || [],
		datasets: topRoutesData.map((routeData, index) => ({
			label: `Route ${routeData.route}`,
			data: routeData.monthlyData.map((data) => data.count),
			borderColor: colorPalette[index % colorPalette.length],
			backgroundColor: colorPalette[index % colorPalette.length].replace(
				"1)",
				"0.2)"
			),
			fill: false,
		})),
	};

	// Chart options
	const chartOptions = {
		scales: {
			x: {
				type: "category" as const,
				title: {
					display: true,
					text: "Month-Year",
				},
			},
			y: {
				title: {
					display: true,
					text: "Number of Rides",
				},
			},
		},
		plugins: {
			legend: {
				display: true,
				position: "right" as const,
				labels: {
					usePointStyle: true,
					color: "#333",
					font: {
						size: 12,
					},
				},
			},
		},
	};

	return (
		<ChartContainer
			title="Popular Routes Analysis"
			description="Top 5 used bus routes over time"
		>
			<div className="flex flex-col h-full gap-4">
				<DateRangePicker
					startDate={startDate}
					endDate={endDate}
					onStartDateChange={setStartDate}
					onEndDateChange={setEndDate}
				/>
				<div className="flex-1 min-h-0">
					<Line
						data={chartData}
						options={{
							...chartOptions,
							maintainAspectRatio: false,
							responsive: true,
						}}
					/>
				</div>
			</div>
		</ChartContainer>
	);
};

export default TopRoutesChart;
