// page.tsx
"use client";
import React, { useState } from "react";
import Header from "../components/Header";
import Tabs from "../components/Tabs";
import RideDataChart from "../components/RideDataChart";

const Dashboard = () => {
	const [activeTab, setActiveTab] = useState("rideData");

	const renderTabContent = () => {
		switch (activeTab) {
			case "rideData":
				return <RideDataChart />;
			default:
				return null;
		}
	};

	return (
		<div className="container mx-auto px-4">
			<Header />
			<Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
			<div className="tab-content mt-4">{renderTabContent()}</div>
		</div>
	);
};

export default Dashboard;
