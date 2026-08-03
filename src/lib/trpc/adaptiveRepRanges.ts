import {
	matchesAdaptivePerformanceIdentity,
	needsAdaptiveRepRangeConfirmation,
	reconcileAdaptiveRepRanges,
	type AdaptivePerformance
} from '$lib/utils/adaptiveRepRanges';
import type { Prisma, RepRangeMode, SetType, WorkoutStatus } from '@prisma/client';

export type ProposedAdaptivePerformance = AdaptivePerformance & {
	mesocycleExerciseTemplateId: string | null;
	exerciseName: string;
	splitDayIndex: number;
};

type AdaptiveTemplateConfiguration = {
	id: string;
	name: string;
	setType: SetType;
	repRangeMode: RepRangeMode | null;
	adaptiveRepRangeStart: number | null;
	adaptiveRepRangeEnd: number | null;
	adaptiveTopRepRangeStart: number | null;
	adaptiveTopRepRangeEnd: number | null;
	adaptiveRepRangeSourceId: string | null;
	adaptiveTopRepRangeSourceId: string | null;
	adaptiveRepRangeResetAt: Date | null;
	splitDayIndex: number;
};

function proposedPerformanceNeedsConfirmation(
	template: AdaptiveTemplateConfiguration,
	existing: ReturnType<typeof reconcileAdaptiveRepRanges>,
	performance: ProposedAdaptivePerformance
) {
	if (template.setType !== 'TopBackoff') {
		return needsAdaptiveRepRangeConfirmation({
			mode: 'Adaptive',
			established: Boolean(existing.standard),
			setType: template.setType,
			sets: performance.sets
		});
	}

	return (
		needsAdaptiveRepRangeConfirmation({
			mode: 'Adaptive',
			established: Boolean(existing.top),
			setType: template.setType,
			category: 'top',
			sets: performance.sets
		}) ||
		needsAdaptiveRepRangeConfirmation({
			mode: 'Adaptive',
			established: Boolean(existing.standard),
			setType: template.setType,
			sets: performance.sets
		})
	);
}

function existingSourceNeedsConfirmation(
	template: AdaptiveTemplateConfiguration,
	existing: ReturnType<typeof reconcileAdaptiveRepRanges>,
	performances: AdaptivePerformance[]
) {
	const standardEstablished = template.adaptiveRepRangeStart !== null && template.adaptiveRepRangeEnd !== null;
	const standardSource = performances.find(
		(performance) => performance.workoutExerciseId === existing.standard?.sourceWorkoutExerciseId
	);
	if (
		!standardEstablished &&
		standardSource &&
		needsAdaptiveRepRangeConfirmation({
			mode: 'Adaptive',
			established: false,
			setType: standardSource.setType,
			sets: standardSource.sets
		})
	) {
		return true;
	}

	const topEstablished = template.adaptiveTopRepRangeStart !== null && template.adaptiveTopRepRangeEnd !== null;
	const topSource = performances.find(
		(performance) => performance.workoutExerciseId === existing.top?.sourceWorkoutExerciseId
	);
	return Boolean(
		!topEstablished &&
			topSource &&
			needsAdaptiveRepRangeConfirmation({
				mode: 'Adaptive',
				established: false,
				setType: topSource.setType,
				category: 'top',
				sets: topSource.sets
			})
	);
}

export async function reconcileAdaptiveRepRangesInTransaction({
	tx,
	mesocycleId,
	userId,
	proposedPerformances = [],
	excludedWorkoutIds = []
}: {
	tx: Prisma.TransactionClient;
	mesocycleId: string;
	userId: string;
	proposedPerformances?: ProposedAdaptivePerformance[];
	excludedWorkoutIds?: string[];
}): Promise<{ confirmationRequired: boolean }> {
	const snapshot = await tx.mesocycle.findFirst({
		where: { id: mesocycleId, userId },
		select: {
			repRangeMode: true,
			mesocycleExerciseSplitDays: {
				select: { dayIndex: true, mesocycleSplitDayExercises: true }
			},
			workoutsOfMesocycle: {
				where: excludedWorkoutIds.length ? { workoutId: { notIn: excludedWorkoutIds } } : undefined,
				select: {
					splitDayIndex: true,
					workoutStatus: true,
					workout: {
						select: {
							endedAt: true,
							workoutExercises: {
								select: {
									id: true,
									name: true,
									mesocycleExerciseTemplateId: true,
									setType: true,
									isDeload: true,
									sets: {
										select: { setIndex: true, reps: true, RIR: true, skipped: true },
										orderBy: { setIndex: 'asc' }
									}
								}
							}
						}
					}
				}
			}
		}
	});
	if (!snapshot) return { confirmationRequired: false };

	const templates: AdaptiveTemplateConfiguration[] = snapshot.mesocycleExerciseSplitDays.flatMap((day) =>
		day.mesocycleSplitDayExercises.map((template) => ({ ...template, splitDayIndex: day.dayIndex }))
	);
	let confirmationRequired = false;

	for (const template of templates) {
		if ((template.repRangeMode ?? snapshot.repRangeMode) !== 'Adaptive') continue;
		const existingPerformances: AdaptivePerformance[] = snapshot.workoutsOfMesocycle.flatMap(
			({ splitDayIndex, workout, workoutStatus }) =>
				workout.workoutExercises.flatMap((exercise) =>
					matchesAdaptivePerformanceIdentity(template, {
						mesocycleExerciseTemplateId: exercise.mesocycleExerciseTemplateId,
						exerciseName: exercise.name,
						splitDayIndex
					})
						? [
								{
									workoutExerciseId: exercise.id,
									performedAt: workout.endedAt,
									setType: exercise.setType,
									isDeload: exercise.isDeload,
									workoutStatus: workoutStatus as WorkoutStatus | null,
									sets: exercise.sets
								}
							]
						: []
				)
		);
		const proposedForTemplate = proposedPerformances.filter((performance) =>
			matchesAdaptivePerformanceIdentity(template, performance)
		);
		const existing = reconcileAdaptiveRepRanges(existingPerformances, template.adaptiveRepRangeResetAt);
		confirmationRequired ||= existingSourceNeedsConfirmation(template, existing, existingPerformances);
		confirmationRequired ||= proposedForTemplate.some((performance) =>
			proposedPerformanceNeedsConfirmation(template, existing, performance)
		);

		const learned = reconcileAdaptiveRepRanges(
			[...existingPerformances, ...proposedForTemplate],
			template.adaptiveRepRangeResetAt
		);
		const updated = await tx.mesocycleExerciseTemplate.updateMany({
			where: {
				id: template.id,
				mesocycleExerciseSplitDay: { mesocycle: { id: mesocycleId, userId } }
			},
			data: {
				adaptiveRepRangeStart: learned.standard?.range.start ?? null,
				adaptiveRepRangeEnd: learned.standard?.range.end ?? null,
				adaptiveRepRangeSourceId: learned.standard?.sourceWorkoutExerciseId ?? null,
				adaptiveTopRepRangeStart: learned.top?.range.start ?? null,
				adaptiveTopRepRangeEnd: learned.top?.range.end ?? null,
				adaptiveTopRepRangeSourceId: learned.top?.sourceWorkoutExerciseId ?? null
			}
		});
		if (updated.count !== 1) throw new Error('Adaptive exercise template changed during reconciliation');
	}

	return { confirmationRequired };
}

export function toProposedAdaptivePerformance({
	exercise,
	sets,
	performedAt,
	workoutStatus,
	splitDayIndex
}: {
	exercise: {
		id: string;
		name: string;
		mesocycleExerciseTemplateId?: string | null;
		setType: SetType;
		isDeload?: boolean;
	};
	sets: { setIndex: number; reps: number; RIR: number; skipped: boolean }[];
	performedAt: Date;
	workoutStatus: WorkoutStatus | null;
	splitDayIndex: number;
}): ProposedAdaptivePerformance {
	return {
		workoutExerciseId: exercise.id,
		mesocycleExerciseTemplateId: exercise.mesocycleExerciseTemplateId ?? null,
		exerciseName: exercise.name,
		splitDayIndex,
		performedAt,
		setType: exercise.setType,
		isDeload: exercise.isDeload ?? false,
		workoutStatus,
		sets
	};
}
