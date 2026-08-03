import { arrayAverage } from '$lib/utils';
import { solveBergerFormula, type SetDetails } from '$lib/utils/workoutUtils';

type DashboardSet = SetDetails & {
	setIndex: number;
	skipped: boolean;
};

type DashboardExercise = {
	exerciseIndex: number;
	name: string;
	bodyweightFraction: number | null;
	sets: DashboardSet[];
};

export type DashboardWorkout = {
	startedAt: Date;
	userBodyweight: number;
	workoutExercises: DashboardExercise[];
};

export type DashboardMetricPoint = {
	timestamp: number;
	value: number;
};

export function buildBodyweightSeries(
	workouts: Pick<DashboardWorkout, 'startedAt' | 'userBodyweight'>[]
): DashboardMetricPoint[] {
	return workouts
		.map((workout) => ({ timestamp: workout.startedAt.getTime(), value: workout.userBodyweight }))
		.toSorted((a, b) => a.timestamp - b.timestamp);
}

export function buildSevenDayAverageSeries(points: DashboardMetricPoint[]): DashboardMetricPoint[] {
	const sortedPoints = points.toSorted((a, b) => a.timestamp - b.timestamp);
	const sevenDaysInMilliseconds = 7 * 24 * 60 * 60 * 1000;
	let windowStart = 0;
	let windowTotal = 0;

	return sortedPoints.map((point, pointIndex) => {
		windowTotal += point.value;
		while (sortedPoints[windowStart].timestamp <= point.timestamp - sevenDaysInMilliseconds) {
			windowTotal -= sortedPoints[windowStart].value;
			windowStart++;
		}

		return {
			timestamp: point.timestamp,
			value: windowTotal / (pointIndex - windowStart + 1)
		};
	});
}

export function buildWorkVolumeSeries(workouts: DashboardWorkout[]): DashboardMetricPoint[] {
	function performedSetVolume(set: DashboardSet, userBodyweight: number, bodyweightFraction: number | null) {
		const bodyweightLoad = (bodyweightFraction ?? 0) * userBodyweight;
		const mainSetVolume = set.reps * (set.load + bodyweightLoad);
		return set.miniSets.reduce(
			(total, miniSet) => total + miniSet.reps * (miniSet.load + bodyweightLoad),
			mainSetVolume
		);
	}

	return workouts
		.map((workout) => ({
			timestamp: workout.startedAt.getTime(),
			value: workout.workoutExercises.reduce(
				(workoutTotal, exercise) =>
					workoutTotal +
					exercise.sets.reduce(
						(setTotal, set) =>
							setTotal +
							(set.skipped ? 0 : performedSetVolume(set, workout.userBodyweight, exercise.bodyweightFraction)),
						0
					),
				0
			)
		}))
		.toSorted((a, b) => a.timestamp - b.timestamp);
}

function workoutSetsByLogicalKey(workout: DashboardWorkout) {
	const exerciseNameOccurrences = new Map<string, number>();
	const keyedSets: {
		key: string;
		set: DashboardSet;
		bodyweightFraction: number | null;
	}[] = [];

	for (const exercise of workout.workoutExercises.toSorted((a, b) => a.exerciseIndex - b.exerciseIndex)) {
		const occurrence = exerciseNameOccurrences.get(exercise.name) ?? 0;
		exerciseNameOccurrences.set(exercise.name, occurrence + 1);

		for (const set of exercise.sets) {
			if (set.skipped) continue;
			keyedSets.push({
				key: `${exercise.name}\u0000${occurrence}\u0000${set.setIndex}`,
				set,
				bodyweightFraction: exercise.bodyweightFraction
			});
		}
	}

	return keyedSets;
}

export function buildRelativePerformanceSeries(workouts: DashboardWorkout[]): DashboardMetricPoint[] {
	const sortedWorkouts = workouts.toSorted((a, b) => a.startedAt.getTime() - b.startedAt.getTime());
	const baselineSets = new Map<
		string,
		{ set: DashboardSet; userBodyweight: number; bodyweightFraction: number | null }
	>();

	return sortedWorkouts.flatMap((workout) => {
		const changes: number[] = [];
		for (const keyedSet of workoutSetsByLogicalKey(workout)) {
			const baseline = baselineSets.get(keyedSet.key);
			if (!baseline) {
				baselineSets.set(keyedSet.key, {
					set: keyedSet.set,
					userBodyweight: workout.userBodyweight,
					bodyweightFraction: keyedSet.bodyweightFraction
				});
				changes.push(0);
				continue;
			}

			const change = solveBergerFormula({
				variableToSolve: 'OverloadPercentage',
				knownValues: {
					oldSet: baseline.set,
					newSet: keyedSet.set,
					oldBodyweightFraction: baseline.bodyweightFraction,
					newBodyweightFraction: keyedSet.bodyweightFraction,
					oldUserBodyweight: baseline.userBodyweight,
					newUserBodyweight: workout.userBodyweight
				}
			});
			if (Number.isFinite(change)) changes.push(change);
		}

		if (changes.length === 0) return [];
		return [{ timestamp: workout.startedAt.getTime(), value: arrayAverage(changes) }];
	});
}
