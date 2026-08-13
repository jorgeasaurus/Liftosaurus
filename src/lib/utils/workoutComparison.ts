import {
	getComparableWorkoutExercisePairs,
	getSetVolume,
	type WorkoutExerciseInProgress,
	type WorkoutExerciseWithPreviousBodyweight
} from './workoutUtils';

export function buildWorkoutComparison(
	currentExercises: WorkoutExerciseInProgress[],
	previousExercises: WorkoutExerciseWithPreviousBodyweight[],
	currentUserBodyweight: number
) {
	const pairs = getComparableWorkoutExercisePairs(currentExercises, previousExercises);
	const rows = pairs.map(({ currentExercise, previousExercise }) => {
		const previousVolume = previousExercise.sets.reduce(
			(volume, set) =>
				set.skipped
					? volume
					: volume + getSetVolume(set, previousExercise.userBodyweight, previousExercise.bodyweightFraction),
			0
		);
		const currentVolume = currentExercise.sets.reduce((volume, set) => {
			if (!set.completed || set.skipped || set.reps === undefined || set.load === undefined || set.RIR === undefined)
				return volume;
			const miniSets = set.miniSets.flatMap((miniSet) =>
				!miniSet.completed || miniSet.reps === undefined || miniSet.load === undefined || miniSet.RIR === undefined
					? []
					: [{ reps: miniSet.reps, load: miniSet.load, RIR: miniSet.RIR }]
			);
			return (
				volume +
				getSetVolume(
					{ reps: set.reps, load: set.load, RIR: set.RIR, miniSets },
					currentUserBodyweight,
					currentExercise.bodyweightFraction ?? null
				)
			);
		}, 0);
		return {
			name: currentExercise.name,
			previousVolume,
			currentVolume,
			change: previousVolume === 0 ? null : ((currentVolume - previousVolume) / previousVolume) * 100
		};
	});

	return {
		rows,
		baselineWorkoutIds: new Set(pairs.map(({ previousExercise }) => previousExercise.workoutId)),
		previousSetCount: pairs.reduce((count, { previousExercise }) => count + previousExercise.sets.length, 0),
		currentSetCount: pairs.reduce((count, { currentExercise }) => count + currentExercise.sets.length, 0),
		previousVolume: rows.reduce((volume, row) => volume + row.previousVolume, 0),
		currentVolume: rows.reduce((volume, row) => volume + row.currentVolume, 0)
	};
}
