/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import "./DatePickerStyles.css";

Chart.register(...registerables);

const RideDataChart = () => {
	interface RideData {
		historical: number;
		quickticket: number;
	}

	const [rideData, setRideData] = useState<Record<string, RideData>>({});
	const [loading, setLoading] = useState(true);
	const [startDate, setStartDate] = useState(new Date("2016-12-31"));
	const [endDate, setEndDate] = useState(new Date("2024-12-30"));

	// Generate all months between start and end date
	const generateMonthRange = (start: Date, end: Date) => {
		const months = [];
		const current = new Date(start);

		while (current <= end) {
			const year = current.getFullYear();
			const month = (current.getMonth() + 1).toString().padStart(2, "0");
			months.push(`${year}-${month}`);
			current.setMonth(current.getMonth() + 1);
		}

		return months;
	};

	// Fetch data
	useEffect(() => {
		setLoading(true);
		const fetchData = async () => {
			const formattedStartDate = startDate.toISOString();
			const formattedEndDate = endDate.toISOString();
			const url = `/api/monthlySwipes?start=${formattedStartDate}&end=${formattedEndDate}`;
			const res = await fetch(url);
			const data = await res.json();

			// Generate all months between start and end dates
			const months = generateMonthRange(startDate, endDate);

			// Create a filled dataset with missing months defaulted to 0
			const filledData: Record<string, RideData> = {};
			months.forEach((month) => {
				const match = data.find((entry: any) => entry.monthYear === month);
				filledData[month] = match
					? {
							historical: match.historical || 0,
							quickticket: match.quickticket || 0,
						}
					: { historical: 0, quickticket: 0 };
			});

			setRideData(filledData);
			setLoading(false);
		};

		fetchData();
	}, [startDate, endDate]);

	// Handle loading state
	if (loading) {
		return <p className="text-center mt-5">Loading...</p>;
	}

	// Sort labels by year and month
	const sortedLabels = Object.keys(rideData).sort((a, b) => {
		const [yearA, monthA] = a.split("-").map(Number);
		const [yearB, monthB] = b.split("-").map(Number);
		return yearA !== yearB ? yearA - yearB : monthA - monthB;
	});

	// Prepare chart data
	const chartData = {
		labels: sortedLabels,
		datasets: [
			{
				label: "Commodore Card Rides",
				data: sortedLabels.map((label) => rideData[label]?.historical || 0),
				backgroundColor: "rgba(207,174,112, 0.8)",
				stack: "rides", // Ensure stacking
			},
			{
				label: "QuickTicket Rides",
				data: sortedLabels.map((label) => rideData[label]?.quickticket || 0),
				backgroundColor: "rgba(94,73,148,255)",
				stack: "rides", // Ensure stacking
			},
		],
	};

	// Chart options
	const chartOptions = {
		responsive: true,
		scales: {
			x: {
				stacked: true,
				title: {
					display: true,
					text: "Month-Year",
				},
			},
			y: {
				stacked: true,
				title: {
					display: true,
					text: "Number of Rides",
				},
			},
		},
		plugins: {
			legend: {
				display: true,
				position: "top" as const,
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
			<Bar data={chartData} options={chartOptions} />
		</div>
	);
};

export default RideDataChart;
