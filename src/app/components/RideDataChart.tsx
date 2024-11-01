// RideDataChart.tsx
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
	const [startDate, setStartDate] = useState(new Date("2017-01-01"));
	const [endDate, setEndDate] = useState(new Date("2024-09-30"));

	useEffect(() => {
		setLoading(true);
		const fetchData = async () => {
			const formattedStartDate = startDate.toISOString();
			const formattedEndDate = endDate.toISOString();
			const url = `/api/getSwipesPerMonth?start=${formattedStartDate}&end=${formattedEndDate}`;
			const res = await fetch(url);
			const data = await res.json();
			setRideData(data);
			setLoading(false);
		};

		fetchData();
	}, [startDate, endDate]);

	if (loading) {
		return <p className="text-center mt-5">Loading...</p>;
	}

	const chartData = {
		labels: Object.keys(rideData).sort(),
		datasets: [
			{
				label: "Historical Rides",
				data: Object.values(rideData).map((data) => data.historical),
				backgroundColor: "rgba(207,174,112, 0.8)",
			},
			{
				label: "QuickTicket Rides",
				data: Object.values(rideData).map((data) => data.quickticket),
				backgroundColor: "rgba(94,73,148,255)",
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
			<Bar data={chartData} options={{ scales: { x: { stacked: true }, y: { stacked: true } } }} />
		</div>
	);
};

export default RideDataChart;
