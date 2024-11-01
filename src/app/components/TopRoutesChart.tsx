import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

Chart.register(...registerables);

const TopRoutesChart = () => {
	const [topRoutesData, setTopRoutesData] = useState<
		{ route: string; monthlyData: { monthYear: string; count: number }[] }[]
	>([]);
	const [loading, setLoading] = useState(true);
	const [startDate, setStartDate] = useState(new Date("2017-01-01"));
	const [endDate, setEndDate] = useState(new Date("2024-09-30"));

	const colorPalette = [
		"rgba(75, 192, 192, 1)", // Teal
		"rgba(153, 102, 255, 1)", // Purple
		"rgba(255, 159, 64, 1)", // Orange
		"rgba(255, 99, 132, 1)", // Red
		"rgba(54, 162, 235, 1)", // Blue
	];

	useEffect(() => {
		setLoading(true);
		const fetchData = async () => {
			const formattedStartDate = startDate.toISOString();
			const formattedEndDate = endDate.toISOString();
			const url = `/api/getTop5RoutesPerMonth?start=${formattedStartDate}&end=${formattedEndDate}`;
			const res = await fetch(url);
			const data = await res.json();

			// Combine historical and quickticket data by route and monthYear
			const combinedData: { [key: string]: { [key: string]: number } } = {};

			data.historical.forEach(
				(routeData: {
					route: string;
					monthlyData: { monthYear: string; count: number }[];
				}) => {
					routeData.monthlyData.forEach(({ monthYear, count }) => {
						if (!combinedData[routeData.route])
							combinedData[routeData.route] = {};
						combinedData[routeData.route][monthYear] =
							(combinedData[routeData.route][monthYear] || 0) + count;
					});
				}
			);

			data.quickticket.forEach(
				(routeData: {
					route: string;
					monthlyData: { monthYear: string; count: number }[];
				}) => {
					routeData.monthlyData.forEach(({ monthYear, count }) => {
						if (!combinedData[routeData.route])
							combinedData[routeData.route] = {};
						combinedData[routeData.route][monthYear] =
							(combinedData[routeData.route][monthYear] || 0) + count;
					});
				}
			);

			// Calculate total ridership per route and sort to get top 5 routes
			const routeTotals = Object.keys(combinedData).map((route) => ({
				route,
				totalCount: Object.values(combinedData[route]).reduce(
					(sum, count) => sum + count,
					0
				),
			}));

			const topRoutes = routeTotals
				.sort((a, b) => b.totalCount - a.totalCount)
				.slice(0, 5)
				.map((item) => item.route);

			// Format data for Chart.js
			const topRoutesData = topRoutes.map((route) => ({
				route,
				monthlyData: Object.keys(combinedData[route])
					.map((monthYear) => ({
						monthYear,
						count: combinedData[route][monthYear],
					}))
					.sort((a, b) => a.monthYear.localeCompare(b.monthYear)),
			}));

			setTopRoutesData(topRoutesData);
			setLoading(false);
		};

		fetchData();
	}, [startDate, endDate]);

	if (loading) {
		return <p className="text-center mt-5">Loading...</p>;
	}

	const chartData = {
		labels: Array.from(
			new Set(
				topRoutesData.flatMap((route) =>
					route.monthlyData.map((data) => data.monthYear)
				)
			)
		).sort(),
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

	const chartOptions = {
		scales: {
			x: { type: "time" as const },
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
				position: "right" as const, // Set to a valid position type
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
		<div>
			<div className="flex flex-col md:flex-row justify-center items-end space-x-2 mb-4">
				<DatePicker
					className="datepicker_custom"
					selected={startDate}
					onChange={(date) => date && setStartDate(date)}
					selectsStart
					startDate={startDate}
					endDate={endDate}
					dateFormat="MM/yyyy"
					showMonthYearPicker
				/>
				<DatePicker
					className="datepicker_custom"
					selected={endDate}
					onChange={(date) => date && setEndDate(date)}
					selectsEnd
					startDate={startDate}
					endDate={endDate}
					minDate={startDate}
					dateFormat="MM/yyyy"
					showMonthYearPicker
				/>
			</div>
			<Line data={chartData} options={chartOptions} />
		</div>
	);
};

export default TopRoutesChart;
