import type { RouterInputs, RouterOutputs } from '$lib/trpc/router';
import {
	ADAPTIVE_REP_RANGE_CONFIRMATION_REQUIRED,
	getPendingAdaptiveRepRangeConfirmation
} from '$lib/utils/adaptiveRepRanges';
import type { WorkoutExerciseInProgress } from '$lib/utils/workoutUtils';
import { TRPCClientError } from '@trpc/client';

export type AdaptiveOutlier = { name: string; targets: string[] };

type CompletionDraft = {
	ownerUserId: string;
	workoutData: RouterOutputs['workouts']['getTodaysWorkoutData'];
	workoutExercises: WorkoutExerciseInProgress[];
};

export function buildWorkoutCreateInput({
	ownerUserId,
	workoutData,
	workoutExercises
}: CompletionDraft): RouterInputs['workouts']['create'] {
	if (typeof workoutData.userBodyweight !== 'number') throw new Error('Bodyweight is required');

	const workoutExercisesSets = workoutExercises.map((exercise) =>
		exercise.sets.map(({ completed: _completed, plannedReps: _plannedReps, ...set }, setIndex) => {
			if (set.skipped) [set.reps, set.load, set.RIR] = [0, 0, 0];
			if (set.reps === undefined || set.load === undefined || set.RIR === undefined) {
				throw new Error('Every set needs reps, load, and RIR');
			}
			const { miniSets, ...setData } = set;
			return { ...setData, reps: set.reps, load: set.load, RIR: set.RIR, setIndex };
		})
	);

	return {
		draftOwnerUserId: ownerUserId,
		workoutData: {
			...workoutData,
			userBodyweight: workoutData.userBodyweight,
			note: workoutData.note ?? undefined
		},
		workoutExercises: workoutExercises.map(
			({ sets: _sets, manualDeloadMetadata: _metadata, workStarted: _started, ...exercise }, exerciseIndex) => ({
				...exercise,
				exerciseIndex
			})
		),
		manualDeloadMetadata: workoutExercises.map((exercise) =>
			exercise.isDeload ? (exercise.manualDeloadMetadata ?? null) : null
		),
		workoutExercisesSets,
		workoutExercisesMiniSets: workoutExercises.map((exercise) =>
			exercise.sets.map((parentSet) =>
				parentSet.miniSets.map(({ completed: _completed, ...miniSet }, miniSetIndex) => {
					if (parentSet.skipped) [miniSet.reps, miniSet.load, miniSet.RIR] = [0, 0, 0];
					if (miniSet.reps === undefined || miniSet.load === undefined || miniSet.RIR === undefined) {
						throw new Error('Every mini-set needs reps, load, and RIR');
					}
					return { ...miniSet, reps: miniSet.reps, load: miniSet.load, RIR: miniSet.RIR, miniSetIndex };
				})
			)
		),
		confirmAdaptiveRepRangeOutliers: false
	};
}

export function getAdaptiveOutliers(
	workoutData: RouterOutputs['workouts']['getTodaysWorkoutData'],
	workoutExercises: WorkoutExerciseInProgress[]
): AdaptiveOutlier[] {
	const mesocycleMode = workoutData.workoutOfMesocycle?.mesocycle.repRangeMode ?? 'Fixed';
	return workoutExercises.flatMap((exercise) => {
		if ((exercise.repRangeMode ?? mesocycleMode) !== 'Adaptive') return [];
		const targets: string[] = [];
		const sets = exercise.sets.flatMap((set, setIndex) =>
			set.reps === undefined || set.RIR === undefined
				? []
				: [{ setIndex, reps: set.reps, RIR: set.RIR, skipped: set.skipped }]
		);
		const standard = getPendingAdaptiveRepRangeConfirmation({
			mode: 'Adaptive',
			established: exercise.repRangeStart !== 5 || exercise.repRangeEnd !== 30,
			setType: exercise.setType,
			sets
		});
		if (standard) targets.push(`${standard.reps} standard reps`);
		if (exercise.setType === 'TopBackoff') {
			const top = getPendingAdaptiveRepRangeConfirmation({
				mode: 'Adaptive',
				established: exercise.topRepRangeStart !== 5 || exercise.topRepRangeEnd !== 30,
				setType: exercise.setType,
				category: 'top',
				sets
			});
			if (top) targets.push(`${top.reps} top-set reps`);
		}
		return targets.length ? [{ name: exercise.name, targets }] : [];
	});
}

export function needsAdaptiveApproval(error: unknown, input: RouterInputs['workouts']['create']) {
	return (
		error instanceof TRPCClientError &&
		error.message === ADAPTIVE_REP_RANGE_CONFIRMATION_REQUIRED &&
		!input.confirmAdaptiveRepRangeOutliers
	);
}
