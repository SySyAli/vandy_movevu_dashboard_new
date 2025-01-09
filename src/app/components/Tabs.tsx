// Tabs.tsx
import { motion } from "framer-motion";
import { IconType } from "react-icons";
import { FaChartBar, FaUsers, FaRoute } from "react-icons/fa";

interface TabsProps {
	activeTab: string;
	setActiveTab: (tab: string) => void;
}

interface TabOption {
	id: string;
	label: string;
	description: string;
	icon: IconType;
}

const tabOptions: TabOption[] = [
	{
		id: "rideData",
		label: "Monthly Rides",
		description: "Total rides per month",
		icon: FaChartBar,
	},
	{
		id: "uniqueUsers",
		label: "User Activity",
		description: "Monthly active unique users",
		icon: FaUsers,
	},
	{
		id: "topRoutes",
		label: "Popular Routes",
		description: "Most frequented paths",
		icon: FaRoute,
	},
];

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => (
	<div className="flex flex-col gap-6">
		<div className="tabs flex flex-wrap gap-4">
			{tabOptions.map((tab) => {
				const Icon = tab.icon;
				const isActive = activeTab === tab.id;

				return (
					<motion.button
						key={tab.id}
						className={`
							relative px-6 py-4 rounded-lg transition-all duration-200 
							flex items-center gap-3 min-w-[240px]
							${
								isActive
									? "bg-vanderbilt-gold text-white shadow-lg"
									: "bg-vanderbilt-gray-100 text-gray-600 hover:bg-vanderbilt-gray-200"
							}
						`}
						onClick={() => setActiveTab(tab.id)}
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
					>
						<Icon
							className={`text-xl ${isActive ? "text-white" : "text-vanderbilt-gold"}`}
						/>
						<div className="flex flex-col items-start">
							<span className="font-semibold">{tab.label}</span>
							<span className="text-sm opacity-80">{tab.description}</span>
						</div>
						{isActive && (
							<motion.div
								className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-full"
								layoutId="activeTab"
								initial={false}
								transition={{ type: "spring", stiffness: 300, damping: 30 }}
							/>
						)}
					</motion.button>
				);
			})}
		</div>
	</div>
);

export default Tabs;
