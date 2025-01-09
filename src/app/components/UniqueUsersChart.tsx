// UniqueUsersChart.tsx
"use client";
import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import "chartjs-adapter-date-fns";
import ChartContainer from "./ChartContainer";
import DateRangePicker from "./DateRangePicker";
import LoadingSpinner from "./LoadingSpinner";

Chart.register(...registerables);

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
				text: "Number of Users",
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

const UniqueUsersChart = () => {
	const [uniqueUsersData, setUniqueUsersData] = useState<
		{ monthYear: string; historical: number; quickticket: number }[]
	>([]);
	const [loading, setLoading] = useState(true);
	const [startDate, setStartDate] = useState(new Date("2016-12-31"));
	const [endDate, setEndDate] = useState(new Date("2024-12-30"));

	useEffect(() => {
		setLoading(true);
		const fetchData = async () => {
			const formattedStartDate = startDate.toISOString();
			const formattedEndDate = endDate.toISOString();
			const url = `/api/uniqueUsers?start=${formattedStartDate}&end=${formattedEndDate}`;
			const res = await fetch(url);
			const data = await res.json();
			setUniqueUsersData(data);
			setLoading(false);
		};

		fetchData();
	}, [startDate, endDate]);

	if (loading) {
		return <LoadingSpinner />;
	}

	const chartData = {
		labels: uniqueUsersData.map((item) => item.monthYear),
		datasets: [
			{
				label: "Commodore Card Unique Users",
				data: uniqueUsersData.map((item) => item.historical),
				backgroundColor: "rgba(207,174,112, 0.8)",
				stack: "users",
			},
			{
				label: "QuickTicket Unique Users",
				data: uniqueUsersData.map((item) => item.quickticket),
				backgroundColor: "rgba(94,73,148,255)",
				stack: "users",
			},
		],
	};

	return (
		<ChartContainer
			title="User Activity Trends"
			description="Monthly active unique users by card type"
		>
			<div className="flex flex-col h-full gap-4">
				<DateRangePicker
					startDate={startDate}
					endDate={endDate}
					onStartDateChange={setStartDate}
					onEndDateChange={setEndDate}
				/>
				<div className="flex-1 min-h-0">
					<Bar
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

export default UniqueUsersChart;
