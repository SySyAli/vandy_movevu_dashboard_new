'use client'; // This makes the component a client-side component

import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface RideData {
  [monthYear: string]: number;
}

const Dashboard = () => {
  const [rideData, setRideData] = useState<RideData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from the API route
    const fetchData = async () => {
      const res = await fetch('/api/getHistoricalData');
      const data: RideData = await res.json();
      setRideData(data);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  // Prepare the chart data
  const chartData = {
    labels: Object.keys(rideData).sort(), // Ensure the labels (months) are sorted
    datasets: [
      {
        label: 'Rides per Month',
        data: Object.values(rideData),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h1>Ridership Dashboard</h1>
      <div>
        <Bar data={chartData} />
      
      </div>
    </div>
  );
};

// TODO: have it be a stacked barchart and add a datepicker to select the range of dates to display

export default Dashboard;
