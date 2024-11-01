// Tabs.tsx
import React from "react";

interface TabsProps {
	activeTab: string;
	setActiveTab: (tab: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => (
	<div className="tabs flex justify-center my-4 space-x-4">
		<button
			className={`px-4 py-2 ${activeTab === "rideData" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
			onClick={() => setActiveTab("rideData")}
		>
			Swipes Per Month Histogram
		</button>
		{/* Add buttons for additional tabs as needed */}
	</div>
);

export default Tabs;
