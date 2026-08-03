export function keyValueStorage(initial: Record<string, string> = {}) {
	const values = new Map(Object.entries(initial));
	return {
		getItem(key: string) {
			return values.get(key) ?? null;
		},
		setItem(key: string, value: string) {
			values.set(key, value);
		},
		removeItem(key: string) {
			values.delete(key);
		},
		key(index: number) {
			return Array.from(values.keys())[index] ?? null;
		},
		get length() {
			return values.size;
		}
	};
}
