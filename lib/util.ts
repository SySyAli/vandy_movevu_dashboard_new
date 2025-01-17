function getMonthYear(date: string): string {
	const d = new Date(date);
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export { getMonthYear };
