// Header.tsx
import React from "react";

const Header = () => {
	return (
		<header className="bg-white border-b border-gray-200">
			<div className="container mx-auto px-4 py-6">
				<div className="flex flex-col gap-2">
					<h1 className="text-3xl font-bold text-gray-900">
						MoveVU Analytics Dashboard
					</h1>
					<p className="text-gray-600">
						Comprehensive insights into Vanderbilt&apos;s transportation
						patterns
					</p>
				</div>
			</div>
		</header>
	);
};

export default Header;
