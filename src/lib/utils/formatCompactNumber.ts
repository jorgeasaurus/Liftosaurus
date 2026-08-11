export function formatCompactNumber(value: number) {
	if (value >= 100000) return `${Math.floor(value / 1000)}k`;
	if (value >= 10000) return `${(Math.floor(value / 100) / 10).toFixed(1)}k`;
	return value.toString();
}
