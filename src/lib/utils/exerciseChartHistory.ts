export type ExerciseChartCursor = { startedAt: Date; id: string };

export type ExerciseChartPage<T> = {
	items: T[];
	nextCursor?: ExerciseChartCursor;
};

export const MAX_EXERCISE_CHART_PERFORMANCES = 2000;

export type ExerciseChartHistoryResult<T> = {
	items: T[];
	truncated: boolean;
};

export function createUserPreservingDefaultSelection<T, Source extends string>(
	initialValue: T,
	sourcePriorities: Record<Source, number>
) {
	let value = initialValue;
	let userSelected = false;
	let appliedDefaultPriority = Number.NEGATIVE_INFINITY;

	return {
		applyDefault(source: Source, defaultValue: T) {
			const sourcePriority = sourcePriorities[source];
			if (!userSelected && sourcePriority >= appliedDefaultPriority) {
				value = defaultValue;
				appliedDefaultPriority = sourcePriority;
			}
			return value;
		},
		select(selectedValue: T) {
			userSelected = true;
			value = selectedValue;
			return value;
		},
		reset() {
			userSelected = false;
			appliedDefaultPriority = Number.NEGATIVE_INFINITY;
		}
	};
}

export type ExerciseChartHistoryResourceState<T> =
	| { status: 'idle' }
	| { status: 'loading' }
	| { status: 'loaded'; data: T[]; truncated: boolean }
	| { status: 'error' };

export async function loadExerciseChartHistoryPages<T>(options: {
	exerciseName: string;
	query: (input: { exerciseName: string; cursor?: ExerciseChartCursor }) => Promise<ExerciseChartPage<T>>;
	isCurrent: () => boolean;
	maxItems?: number;
}) {
	const items: T[] = [];
	const maxItems = options.maxItems ?? MAX_EXERCISE_CHART_PERFORMANCES;
	let cursor: ExerciseChartCursor | undefined;
	const seenCursors = new Set<string>();

	do {
		const page = await options.query({ exerciseName: options.exerciseName, cursor });
		if (!options.isCurrent()) return undefined;
		const remainingItems = maxItems - items.length;
		items.push(...page.items.slice(0, remainingItems));
		if (items.length >= maxItems) {
			return {
				items: items.toReversed(),
				truncated: page.items.length > remainingItems || page.nextCursor !== undefined
			};
		}
		if (page.nextCursor) {
			const cursorKey = `${page.nextCursor.startedAt.toISOString()}:${page.nextCursor.id}`;
			const cursorDidNotAdvance =
				cursor !== undefined &&
				(page.nextCursor.startedAt > cursor.startedAt ||
					(page.nextCursor.startedAt.getTime() === cursor.startedAt.getTime() && page.nextCursor.id >= cursor.id));
			if (cursorDidNotAdvance || seenCursors.has(cursorKey)) {
				throw new Error('Exercise chart history cursor did not advance');
			}
			seenCursors.add(cursorKey);
		}
		cursor = page.nextCursor;
	} while (cursor);

	return { items: items.toReversed(), truncated: false };
}

export function createExerciseChartHistoryResource<T>(options: {
	query: (input: { exerciseName: string; cursor?: ExerciseChartCursor }) => Promise<ExerciseChartPage<T>>;
	onStateChange: (state: ExerciseChartHistoryResourceState<T>) => void;
}) {
	let state: ExerciseChartHistoryResourceState<T> = { status: 'idle' };
	let generation = 0;

	function transition(nextState: ExerciseChartHistoryResourceState<T>) {
		state = nextState;
		options.onStateChange(nextState);
	}

	async function load(exerciseName: string) {
		if (state.status !== 'idle') return;
		const requestGeneration = ++generation;
		transition({ status: 'loading' });

		try {
			const result = await loadExerciseChartHistoryPages({
				exerciseName,
				query: options.query,
				isCurrent: () => requestGeneration === generation
			});
			if (result === undefined || requestGeneration !== generation) return;
			transition({ status: 'loaded', data: result.items, truncated: result.truncated });
		} catch {
			if (requestGeneration === generation) transition({ status: 'error' });
		}
	}

	async function retry(exerciseName: string) {
		if (state.status !== 'error') return;
		transition({ status: 'idle' });
		await load(exerciseName);
	}

	function reset() {
		generation += 1;
		transition({ status: 'idle' });
	}

	function cancelLoading() {
		if (state.status === 'loading') reset();
	}

	return {
		get state() {
			return state;
		},
		load,
		retry,
		reset,
		cancelLoading
	};
}
