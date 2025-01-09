// page.tsx
"use client";
import React, { useState } from "react";
import Header from "../components/Header";
import Tabs from "../components/Tabs";
import RideDataChart from "../components/RideDataChart";
import UniqueUsersChart from "../components/UniqueUsersChart";
import TopRoutesChart from "../components/TopRoutesChart";

const Dashboard = () => {
	const [activeTab, setActiveTab] = useState("rideData");

	const renderTabContent = () => {
		switch (activeTab) {
			case "rideData":
				return <RideDataChart />;
			case "uniqueUsers":
				return <UniqueUsersChart />;
			case "topRoutes":
				return <TopRoutesChart />;
			default:
				return null;
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<Header />
			<div className="container mx-auto px-4 py-6">
				<div className="bg-white rounded-lg shadow-lg p-6">
					<Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
					<div className="mt-4 h-[calc(100vh-240px)]">{renderTabContent()}</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
