// TODO: cache the data and make a basic ui
// TODO: Figure out what graphics to put up and design as well?
// TODO: cache the data in the backend and seperate the api resuts
// TODO: Figure out what to do with this website
// TODO: Add Auth for Vanderbilt

export default function Home() {
	return (
		<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
			<main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
				<h1 className="text-4xl text-center sm:text-left">
					Go to \dashboard to see actual results.
				</h1>
			</main>
		</div>
	);
}
