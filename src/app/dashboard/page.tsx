"use client";
import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

Chart.register(...registerables);

const Dashboard = () => {
	interface RideData {
		historical: number;
		quickticket: number;
	}

	const [rideData, setRideData] = useState<Record<string, RideData>>({});
	const [loading, setLoading] = useState(true);
	const [startDate, setStartDate] = useState(new Date("2016-12-25"));
	const [endDate, setEndDate] = useState(new Date("2024-08-31"));

	useEffect(() => {
		setLoading(true); // Ensure loading is true when fetching
		const fetchData = async () => {
			const res = await fetch(
				`/api/getHistoricalData?start=${startDate.toISOString()}&end=${endDate.toISOString()}`
			);
			const data = await res.json();
			setRideData(data);
			setLoading(false);
		};

		fetchData();
	}, [startDate, endDate]);

	if (loading) {
		return <p>Loading...</p>;
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
			<h1>Ridership Dashboard</h1>
			<DatePicker
				selected={startDate}
				onChange={(date) => date && setStartDate(date)}
				selectsStart
				startDate={startDate}
				endDate={endDate}
			/>
			<DatePicker
				selected={endDate}
				onChange={(date) => date && setEndDate(date)}
				selectsEnd
				startDate={startDate}
				endDate={endDate}
				minDate={startDate}
			/>
			<div>
				<Bar
					data={chartData}
					options={{ scales: { x: { stacked: true }, y: { stacked: true } } }}
				/>
			</div>
		</div>
	);
};

export default Dashboard;
