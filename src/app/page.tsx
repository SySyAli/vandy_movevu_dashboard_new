// TODO: Add Auth for Vanderbilt

import Link from "next/link";

export default function Home() {
	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
			{/* Hero Section */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<div className="text-center">
					<h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
						MoveVU Analytics <span className="text-[#CFB991]">Dashboard</span>
					</h1>
					<p className="mt-3 max-w-md mx-auto text-base text-gray-600 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
						Comprehensive insights into Vanderbilt&apos;s transportation
						patterns and sustainability initiatives
					</p>
					<div className="mt-8 max-w-md mx-auto sm:flex sm:justify-center md:mt-8 space-x-4">
						<Link
							href="/dashboard"
							className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#CFB991] hover:bg-[#B5985A] transition-colors duration-300 shadow-md font-sans"
						>
							Go to Dashboard
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
