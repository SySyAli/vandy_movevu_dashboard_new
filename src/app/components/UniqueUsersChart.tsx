// UniqueUsersChart.tsx
"use client";
import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import "chartjs-adapter-date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

Chart.register(...registerables);

const UniqueUsersChart = () => {
	const [uniqueUsersData, setUniqueUsersData] = useState<{ monthYear: string; historical: number; quickticket: number }[]>([]);
	const [loading, setLoading] = useState(true);
	const [startDate, setStartDate] = useState(new Date("2016-12-31"));
	const [endDate, setEndDate] = useState(new Date("2024-12-30"));

	useEffect(() => {
		setLoading(true);
		const fetchData = async () => {
			const formattedStartDate = startDate.toISOString();
			const formattedEndDate = endDate.toISOString();
			const url = `/api/getUniqueUsersPerMonth?start=${formattedStartDate}&end=${formattedEndDate}`;
			const res = await fetch(url);
			const data = await res.json();
			setUniqueUsersData(data);
			setLoading(false);
		};

		fetchData();
	}, [startDate, endDate]);

	if (loading) {
		return <p className="text-center mt-5">Loading...</p>;
	}

	const chartData = {
		labels: uniqueUsersData.map((item) => item.monthYear),
		datasets: [
			{
				label: "Commodore Card Unique Users",
				data: uniqueUsersData.map((item) => item.historical),
				backgroundColor: "rgba(75, 192, 192, 0.8)",
			},
			{
				label: "QuickTicket Unique Users",
				data: uniqueUsersData.map((item) => item.quickticket),
				backgroundColor: "rgba(153, 102, 255, 0.8)",
			},
		],
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
			<Bar 
				data={chartData} 
				options={{ 
					scales: { 
						x: { 
							stacked: true,
							type: "category",
						}, 
						y: { 
							stacked: true 
						} 
					} 
				}} 
			/>
		</div>
	);
};

export default UniqueUsersChart;
