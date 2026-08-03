export type AdaptiveRepRange = { start: number; end: number };

type WorkingSet = {
	setIndex: number;
	reps: number;
	RIR: number;
	skipped: boolean;
};

export type LearnedAdaptiveRepRanges = {
	standard: AdaptiveRepRange | null;
	top: AdaptiveRepRange | null;
};

export type AdaptivePerformance = {
	workoutExerciseId: string;
	performedAt: Date;
	setType: string;
	isDeload: boolean;
	workoutStatus: string | null;
	sets: WorkingSet[];
};

export type AdaptiveTemplateIdentity = {
	id: string;
	name: string;
	splitDayIndex: number | null;
};

export type AdaptivePerformanceIdentity = {
	mesocycleExerciseTemplateId: string | null;
	exerciseName: string;
	splitDayIndex: number | null;
};

type LearnedRangeSource = {
	range: AdaptiveRepRange;
	sourceWorkoutExerciseId: string;
};

type RepRangeConfiguration = {
	repRangeStart: number;
	repRangeEnd: number;
	topRepRangeStart?: number | null;
	topRepRangeEnd?: number | null;
	adaptiveRepRangeStart?: number | null;
	adaptiveRepRangeEnd?: number | null;
	adaptiveTopRepRangeStart?: number | null;
	adaptiveTopRepRangeEnd?: number | null;
};

export function matchesAdaptivePerformanceIdentity(
	template: AdaptiveTemplateIdentity,
	performance: AdaptivePerformanceIdentity
) {
	if (performance.mesocycleExerciseTemplateId) {
		return performance.mesocycleExerciseTemplateId === template.id;
	}
	return (
		performance.exerciseName === template.name &&
		performance.splitDayIndex !== null &&
		template.splitDayIndex !== null &&
		performance.splitDayIndex === template.splitDayIndex
	);
}

export type ResolvedRepRange = AdaptiveRepRange & { status: 'fixed' | 'pending' | 'established' };

function rangeFromPerformance({ reps, RIR }: WorkingSet): AdaptiveRepRange {
	const normalizedReps = Math.min(30, Math.max(5, reps + RIR - 3));
	return {
		start: Math.max(5, normalizedReps - 2),
		end: Math.min(30, normalizedReps + 2)
	};
}

export function learnAdaptiveRepRanges({
	setType,
	sets
}: {
	setType: string;
	sets: WorkingSet[];
}): LearnedAdaptiveRepRanges {
	const eligibleSets = sets.filter((set) => !set.skipped);
	if (setType !== 'TopBackoff') {
		return { standard: eligibleSets[0] ? rangeFromPerformance(eligibleSets[0]) : null, top: null };
	}

	const topSet = eligibleSets.find((set) => set.setIndex === 0);
	const backoffSet = eligibleSets.find((set) => set.setIndex > 0);
	return {
		standard: backoffSet ? rangeFromPerformance(backoffSet) : null,
		top: topSet ? rangeFromPerformance(topSet) : null
	};
}

export function needsAdaptiveRepRangeConfirmation({
	mode,
	established,
	setType,
	category = 'standard',
	sets
}: {
	mode: 'Fixed' | 'Adaptive';
	established: boolean;
	setType: string;
	category?: 'standard' | 'top';
	sets: WorkingSet[];
}) {
	if (mode !== 'Adaptive' || established) return false;
	const firstEligibleSet = sets.find(
		(set) => !set.skipped && (category === 'top' ? set.setIndex === 0 : setType !== 'TopBackoff' || set.setIndex > 0)
	);
	return Boolean(firstEligibleSet && (firstEligibleSet.reps < 5 || firstEligibleSet.reps > 30));
}

export function reconcileAdaptiveRepRanges(
	performances: AdaptivePerformance[],
	resetAt?: Date | null
): {
	standard: LearnedRangeSource | null;
	top: LearnedRangeSource | null;
} {
	let standard: LearnedRangeSource | null = null;
	let top: LearnedRangeSource | null = null;

	for (const performance of performances.toSorted((a, b) => Number(a.performedAt) - Number(b.performedAt))) {
		if (resetAt && performance.performedAt <= resetAt) continue;
		if (performance.isDeload || performance.workoutStatus !== null) continue;
		const learned = learnAdaptiveRepRanges(performance);
		if (!standard && learned.standard) {
			standard = { range: learned.standard, sourceWorkoutExerciseId: performance.workoutExerciseId };
		}
		if (!top && learned.top) {
			top = { range: learned.top, sourceWorkoutExerciseId: performance.workoutExerciseId };
		}
		if (standard && top) break;
	}

	return { standard, top };
}

export function resolveRepRange(
	configuration: RepRangeConfiguration,
	mode: 'Fixed' | 'Adaptive',
	isTopSet: boolean
): ResolvedRepRange {
	if (mode === 'Fixed') {
		return {
			start:
				isTopSet && typeof configuration.topRepRangeStart === 'number'
					? configuration.topRepRangeStart
					: configuration.repRangeStart,
			end:
				isTopSet && typeof configuration.topRepRangeEnd === 'number'
					? configuration.topRepRangeEnd
					: configuration.repRangeEnd,
			status: 'fixed'
		};
	}

	const start = isTopSet ? configuration.adaptiveTopRepRangeStart : configuration.adaptiveRepRangeStart;
	const end = isTopSet ? configuration.adaptiveTopRepRangeEnd : configuration.adaptiveRepRangeEnd;
	return typeof start !== 'number' || typeof end !== 'number'
		? { start: 5, end: 30, status: 'pending' }
		: { start, end, status: 'established' };
}
