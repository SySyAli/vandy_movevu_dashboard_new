interface ChartContainerProps {
	title: string;
	description: string;
	children: React.ReactNode;
}

const ChartContainer: React.FC<ChartContainerProps> = ({
	title,
	description,
	children,
}) => {
	return (
		<div className="flex flex-col h-full">
			<div className="mb-4">
				<h3 className="text-xl font-semibold text-gray-900">{title}</h3>
				<p className="text-sm text-gray-600">{description}</p>
			</div>
			<div className="flex-1 min-h-0">{children}</div>
		</div>
	);
};

export default ChartContainer;
