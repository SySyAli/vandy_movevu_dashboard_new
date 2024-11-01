// Tabs.tsx
import React from "react";

interface TabsProps {
	activeTab: string;
	setActiveTab: (tab: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => (
	<div className="tabs flex justify-center my-4 space-x-4">
		<button
			className={`px-4 py-2 ${activeTab === "rideData" ? "bg-blue-500 text-white" : "bg-gray-500"}`}
			onClick={() => setActiveTab("rideData")}
		>
			Swipes Per Month
		</button>
		<button
			className={`px-4 py-2 ${activeTab === "uniqueUsers" ? "bg-blue-500 text-white" : "bg-gray-500"}`}
			onClick={() => setActiveTab("uniqueUsers")}
		>
			Unique Users per Month
		</button>
		<button
			className={`px-4 py-2 ${activeTab === "topRoutes" ? "bg-blue-500 text-white" : "bg-gray-500"}`}
			onClick={() => setActiveTab("topRoutes")}
		>
			Top Routes Over Time
		</button>
	</div>
);

export default Tabs;
