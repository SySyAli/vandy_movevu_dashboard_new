// Tabs.tsx
import React from "react";

interface TabsProps {
	activeTab: string;
	setActiveTab: (tab: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => (
	<div className="flex flex-col gap-6">
		<div className="tabs flex flex-wrap gap-4">
			<button
				className={`px-6 py-3 rounded-lg transition-all duration-200 flex flex-col items-center gap-1 min-w-[200px] ${
					activeTab === "rideData"
						? "bg-blue-600 text-white shadow-md"
						: "bg-gray-50 text-gray-600 hover:bg-gray-100"
				}`}
				onClick={() => setActiveTab("rideData")}
			>
				<span className="font-semibold">Monthly Rides</span>
				<span className="text-sm opacity-80">Total rides per month</span>
			</button>
			<button
				className={`px-6 py-3 rounded-lg transition-all duration-200 flex flex-col items-center gap-1 min-w-[200px] ${
					activeTab === "uniqueUsers"
						? "bg-blue-600 text-white shadow-md"
						: "bg-gray-50 text-gray-600 hover:bg-gray-100"
				}`}
				onClick={() => setActiveTab("uniqueUsers")}
			>
				<span className="font-semibold">User Activity</span>
				<span className="text-sm opacity-80">Monthly active unique users</span>
			</button>
			<button
				className={`px-6 py-3 rounded-lg transition-all duration-200 flex flex-col items-center gap-1 min-w-[200px] ${
					activeTab === "topRoutes"
						? "bg-blue-600 text-white shadow-md"
						: "bg-gray-50 text-gray-600 hover:bg-gray-100"
				}`}
				onClick={() => setActiveTab("topRoutes")}
			>
				<span className="font-semibold">Popular Routes</span>
				<span className="text-sm opacity-80">Most frequented paths</span>
			</button>
		</div>
	</div>
);

export default Tabs;
