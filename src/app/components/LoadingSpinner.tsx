import React from "react";

const LoadingSpinner = () => {
	return (
		<div className="flex items-center justify-center h-full">
			<div className="relative">
				<div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-blue-600 animate-spin"></div>
				
			</div>
		</div>
	);
};

export default LoadingSpinner;
