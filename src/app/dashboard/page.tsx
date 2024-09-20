'use client'
import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface RideData {
  [monthYear: string]: { historical: number; quickticket: number; };
}

const Dashboard = () => {
  const [rideData, setRideData] = useState<RideData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  const chartData = {
    labels: Object.keys(rideData).sort(),
    datasets: [
      {
        label: 'Historical Rides',
        data: Object.values(rideData).map(data => data.historical),
        backgroundColor: 'rgba(207,174,112, 0.8)',
      },
      {
        label: 'QuickTicket Rides',
        data: Object.values(rideData).map(data => data.quickticket),
        backgroundColor: 'rgba(94,73,148,255)',
      }
    ],
  };

  return (
    <div>
      <h1>Ridership per Month (Bar)</h1>
      <div>
        <Bar data={chartData} options={{ scales: { x: { stacked: true }, y: { stacked: true } } }} />
      </div>
    </div>
  );
};

export default Dashboard;
