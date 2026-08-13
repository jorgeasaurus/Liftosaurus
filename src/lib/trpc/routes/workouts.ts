import { prisma } from '$lib/prisma';
import { reconcileAdaptiveRepRangesInTransaction, toProposedAdaptivePerformance } from '$lib/trpc/adaptiveRepRanges';
import { t } from '$lib/trpc/t';
import { runSerializableTransaction } from '$lib/trpc/transaction';
import { createWorkoutGraph, syncWorkoutExerciseTemplates } from '$lib/trpc/workoutCompletion';
import { arraySum } from '$lib/utils';
import { ADAPTIVE_REP_RANGE_CONFIRMATION_REQUIRED } from '$lib/utils/adaptiveRepRanges';
import {
	buildBodyFatSeries,
	buildBodyweightSeries,
	buildRelativePerformanceSeries,
	buildSevenDayAverageSeries,
	buildWorkVolumeSeries
} from '$lib/utils/dashboardMetrics';
import {
	getPreviousWorkoutExercisePerformances,
	hasAlignedManualDeloadMetadata,
	progressiveOverloadMagic,
	type WorkoutExerciseInProgress,
	type WorkoutExerciseWithPreviousBodyweight
} from '$lib/utils/workoutUtils';
import {
	WorkoutExerciseCreateWithoutWorkoutInputSchema,
	WorkoutExerciseMiniSetCreateWithoutParentSetInputSchema,
	WorkoutExerciseSetCreateWithoutWorkoutExerciseInputSchema
} from '$lib/zodSchemas';
import {
	Prisma,
	WorkoutStatus,
	type Mesocycle,
	type MesocycleExerciseSplitDay,
	type MuscleGroup,
	type WorkoutExercise,
	type WorkoutOfMesocycle
} from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { createId } from '@paralleldrive/cuid2';
import { createHash } from 'node:crypto';
import { z } from 'zod';

type TodaysWorkoutData = {
	completionId: string;
	startedAt: Date | string;
	endedAt: Date | string | null;
	userBodyweight: number | null;
	userBodyFat?: number | null;
	workoutExercises: Pick<WorkoutExercise, 'name' | 'targetMuscleGroup' | 'customMuscleGroup'>[];
	workoutOfMesocycle?: Pick<WorkoutOfMesocycle, 'workoutStatus' | 'splitDayIndex'> & {
		mesocycle: Mesocycle;
		cycleNumber: number;
		splitDayName: string;
	};
	note: string | null;
	isLastWorkout: boolean;
};

type WorkoutExercisesWithPreviousData = {
	todaysWorkoutExercises: WorkoutExerciseInProgress[];
	previousWorkoutData: null | {
		exercises: WorkoutExerciseWithPreviousBodyweight[];
	};
};

const MAX_WORKOUT_EXERCISES = 50;
const MAX_SETS_PER_EXERCISE = 30;
const MAX_MINI_SETS_PER_SET = 20;

async function getLatestBodyMeasurements(userId: string) {
	const [latestWorkout, latestBodyFatWorkout] = await Promise.all([
		prisma.workout.findFirst({
			where: { userId },
			orderBy: { startedAt: 'desc' },
			select: { userBodyweight: true }
		}),
		prisma.workout.findFirst({
			where: { userId, userBodyFat: { not: null } },
			orderBy: { startedAt: 'desc' },
			select: { userBodyFat: true }
		})
	]);

	return {
		userBodyweight: latestWorkout?.userBodyweight ?? null,
		userBodyFat: latestBodyFatWorkout?.userBodyFat ?? null
	};
}

function completionFingerprint(input: z.infer<typeof createWorkoutSchema>) {
	const { confirmAdaptiveRepRangeOutliers: _confirmation, workoutData, ...rest } = input;
	const { completionId: _completionId, ...stableWorkoutData } = workoutData;
	const stableInput = { ...rest, workoutData: stableWorkoutData };
	return createHash('sha256').update(JSON.stringify(stableInput)).digest('hex');
}

async function getCompletedWorkoutResult(userId: string, completionId: string, fingerprint: string) {
	const completedWorkout = await prisma.workout.findUnique({
		where: { userId_completionId: { userId, completionId } },
		select: {
			completionFingerprint: true,
			mesocycleCompleted: true,
			workoutOfMesocycle: {
				select: { workoutStatus: true }
			}
		}
	});
	if (!completedWorkout) return null;
	if (completedWorkout.completionFingerprint !== fingerprint) {
		throw new TRPCError({ code: 'CONFLICT', message: 'Completion ID was already used for different workout data' });
	}
	const status = completedWorkout.workoutOfMesocycle?.workoutStatus;
	const message =
		status === 'RestDay'
			? 'Rest day completed successfully'
			: status === 'Skipped'
				? 'Workout skipped successfully'
				: 'Workout created successfully';
	return {
		message,
		mesocycleCompleted: completedWorkout.mesocycleCompleted
	};
}

const createActiveMesocycleWithProgressionDataInclude = (splitDayIndex?: number) => {
	const workoutsWhere = splitDayIndex !== undefined ? { where: { splitDayIndex } } : {};

	return Prisma.validator<Prisma.MesocycleInclude>()({
		mesocycleExerciseSplitDays: {
			include: { mesocycleSplitDayExercises: { orderBy: { exerciseIndex: 'asc' } } },
			orderBy: { dayIndex: 'asc' }
		},
		mesocycleCyclicSetChanges: true,
		workoutsOfMesocycle: {
			include: {
				workout: {
					include: {
						workoutExercises: {
							include: {
								sets: { include: { miniSets: { orderBy: { miniSetIndex: 'asc' } } }, orderBy: { setIndex: 'asc' } }
							},
							orderBy: { exerciseIndex: 'asc' }
						}
					}
				}
			},
			orderBy: { workout: { startedAt: 'asc' } },
			...workoutsWhere
		}
	});
};

export type ActiveMesocycleWithProgressionData = Prisma.MesocycleGetPayload<{
	include: ReturnType<typeof createActiveMesocycleWithProgressionDataInclude>;
}>;

const workoutInputDataSchema = z.object({
	completionId: z.string().cuid2().optional(),
	startedAt: z.date().or(z.string().datetime()).optional(),
	userBodyweight: z.number(),
	userBodyFat: z.number().min(0).max(100).nullable().optional(),
	workoutOfMesocycle: z
		.object({
			mesocycle: z.object({ id: z.string().cuid2() }),
			splitDayIndex: z.number().int(),
			cycleNumber: z.number().int().positive().optional(),
			workoutStatus: z.nativeEnum(WorkoutStatus).nullable()
		})
		.optional(),
	note: z.string().optional()
});

const createWorkoutSchema = z
	.strictObject({
		draftOwnerUserId: z.string().cuid2(),
		workoutData: workoutInputDataSchema,
		workoutExercises: z.array(WorkoutExerciseCreateWithoutWorkoutInputSchema).max(MAX_WORKOUT_EXERCISES),
		workoutExercisesSets: z
			.array(z.array(WorkoutExerciseSetCreateWithoutWorkoutExerciseInputSchema).max(MAX_SETS_PER_EXERCISE))
			.max(MAX_WORKOUT_EXERCISES),
		workoutExercisesMiniSets: z
			.array(
				z
					.array(z.array(WorkoutExerciseMiniSetCreateWithoutParentSetInputSchema).max(MAX_MINI_SETS_PER_SET))
					.max(MAX_SETS_PER_EXERCISE)
			)
			.max(MAX_WORKOUT_EXERCISES),
		manualDeloadMetadata: z
			.array(
				z
					.strictObject({
						sourceTemplateId: z.string().cuid2().nullable(),
						originalSetCount: z.number().int().nonnegative()
					})
					.nullable()
			)
			.max(MAX_WORKOUT_EXERCISES)
			.optional(),
		confirmAdaptiveRepRangeOutliers: z.boolean().optional()
	})
	.superRefine((input, ctx) => {
		if (input.workoutData.completionId && input.workoutData.workoutOfMesocycle?.cycleNumber === undefined) {
			ctx.addIssue({
				code: 'custom',
				message: 'Current mesocycle submissions require a cycle number',
				path: ['workoutData', 'workoutOfMesocycle', 'cycleNumber']
			});
		}
		if (input.workoutExercises.length !== input.workoutExercisesSets.length) {
			ctx.addIssue({ code: 'custom', message: 'Every workout exercise must have a set list' });
		}
		if (input.workoutExercises.length !== input.workoutExercisesMiniSets.length) {
			ctx.addIssue({ code: 'custom', message: 'Every workout exercise must have a mini-set list' });
		}
		for (let index = 0; index < input.workoutExercisesSets.length; index += 1) {
			if (input.workoutExercisesSets[index].length !== input.workoutExercisesMiniSets[index]?.length) {
				ctx.addIssue({
					code: 'custom',
					message: 'Every workout set must have a mini-set list',
					path: ['workoutExercisesMiniSets', index]
				});
			}
		}
	});

const loadWorkoutsSchema = z.strictObject({
	cursorId: z.string().cuid2().optional(),
	filters: z
		.object({
			startDate: z.date().optional(),
			endDate: z.date().optional(),
			selectedWorkoutStatuses: z.array(z.union([z.literal('RestDay'), z.literal('Skipped'), z.null()])).optional(),
			selectedMesocycles: z.array(z.union([z.string(), z.null()])).optional()
		})
		.optional()
});

export const workouts = t.router({
	getDashboardChartData: t.procedure.query(async ({ ctx }) => {
		const [activeMesocycle, bodyweightWorkouts] = await Promise.all([
			prisma.mesocycle.findFirst({
				where: { userId: ctx.userId, startDate: { not: null }, endDate: null },
				orderBy: { id: 'asc' },
				select: {
					id: true,
					_count: { select: { mesocycleExerciseSplitDays: true, workoutsOfMesocycle: true } }
				}
			}),
			prisma.workout.findMany({
				where: { userId: ctx.userId },
				select: { startedAt: true, userBodyweight: true, userBodyFat: true },
				orderBy: [{ startedAt: 'desc' }, { id: 'desc' }],
				take: 365
			})
		]);

		const splitDayIndex =
			activeMesocycle && activeMesocycle._count.mesocycleExerciseSplitDays > 0
				? activeMesocycle._count.workoutsOfMesocycle % activeMesocycle._count.mesocycleExerciseSplitDays
				: null;
		const splitWorkouts =
			splitDayIndex === null
				? []
				: await prisma.workout.findMany({
						where: {
							userId: ctx.userId,
							workoutOfMesocycle: { mesocycleId: activeMesocycle!.id, splitDayIndex }
						},
						select: {
							startedAt: true,
							userBodyweight: true,
							workoutExercises: {
								select: {
									exerciseIndex: true,
									name: true,
									bodyweightFraction: true,
									sets: {
										select: {
											setIndex: true,
											reps: true,
											load: true,
											RIR: true,
											skipped: true,
											miniSets: {
												select: { reps: true, load: true, RIR: true },
												orderBy: { miniSetIndex: 'asc' }
											}
										},
										orderBy: { setIndex: 'asc' }
									}
								},
								orderBy: { exerciseIndex: 'asc' }
							}
						},
						orderBy: [{ startedAt: 'desc' }, { id: 'desc' }],
						take: 24
					});

		const bodyweight = buildBodyweightSeries(bodyweightWorkouts);
		const bodyFat = buildBodyFatSeries(bodyweightWorkouts);
		return {
			relativePerformance: buildRelativePerformanceSeries(splitWorkouts),
			bodyweight,
			sevenDayBodyweight: buildSevenDayAverageSeries(bodyweight),
			bodyFat,
			sevenDayBodyFat: buildSevenDayAverageSeries(bodyFat),
			workVolume: buildWorkVolumeSeries(splitWorkouts)
		};
	}),

	load: t.procedure.input(loadWorkoutsSchema).query(async ({ input, ctx }) => {
		let whereClause: Prisma.WorkoutWhereInput = { userId: ctx.userId };
		const andConditions: Prisma.WorkoutWhereInput['AND'] = [];
		const { filters } = input;

		const startedAtFilter: Prisma.DateTimeFilter = {};
		if (filters?.startDate) {
			startedAtFilter.gte = filters.startDate;
		}
		if (filters?.endDate) {
			const endDate = new Date(Number(filters.endDate) + 1000 * 60 * 60 * 24);
			startedAtFilter.lte = endDate;
		}
		if (Object.keys(startedAtFilter).length > 0) {
			whereClause = { ...whereClause, startedAt: startedAtFilter };
		}

		if (filters?.selectedWorkoutStatuses) {
			const orClause: Prisma.WorkoutWhereInput['OR'] = [
				{ workoutOfMesocycle: { workoutStatus: { in: filters.selectedWorkoutStatuses.filter((m) => m !== null) } } }
			];

			if (filters.selectedWorkoutStatuses.includes(null)) {
				orClause.push({ workoutOfMesocycle: { workoutStatus: { equals: null } } });
				orClause.push({ workoutOfMesocycle: null });
			}

			andConditions.push({ OR: orClause });
		}

		if (filters?.selectedMesocycles) {
			const orClause: Prisma.WorkoutWhereInput['OR'] = [
				{ workoutOfMesocycle: { mesocycle: { name: { in: filters.selectedMesocycles.filter((m) => m !== null) } } } }
			];

			if (filters.selectedMesocycles.includes(null)) {
				orClause.push({ workoutOfMesocycle: null });
			}

			andConditions.push({ OR: orClause });
		}

		whereClause = { ...whereClause, AND: andConditions };

		return prisma.workout.findMany({
			where: whereClause,
			orderBy: { startedAt: 'desc' },
			include: {
				workoutOfMesocycle: {
					include: {
						mesocycle: {
							select: {
								id: true,
								name: true,
								mesocycleExerciseSplitDays: {
									select: { name: true },
									orderBy: { dayIndex: 'asc' }
								}
							}
						}
					}
				}
			},
			cursor: input.cursorId !== undefined ? { id: input.cursorId } : undefined,
			skip: input.cursorId !== undefined ? 1 : 0,
			take: 10
		});
	}),

	getFilterData: t.procedure.query(async ({ ctx }) => {
		const firstWorkout = await prisma.workout.findFirst({
			where: { userId: ctx.userId },
			select: { startedAt: true },
			orderBy: { startedAt: 'asc' }
		});

		if (!firstWorkout) {
			return null;
		}
		const firstWorkoutDate = firstWorkout.startedAt;

		const lastWorkout = await prisma.workout.findFirst({
			where: { userId: ctx.userId },
			select: { startedAt: true },
			orderBy: { startedAt: 'desc' }
		});
		const lastWorkoutDate = lastWorkout!.startedAt;

		const allMesocycles = await prisma.mesocycle.findMany({
			where: { userId: ctx.userId },
			select: { name: true, startDate: true, endDate: true }
		});

		return { firstWorkoutDate, lastWorkoutDate, allMesocycles };
	}),

	findById: t.procedure.input(z.string().cuid2()).query(({ input, ctx }) =>
		prisma.workout.findUnique({
			where: { id: input, userId: ctx.userId },
			include: {
				workoutOfMesocycle: {
					include: {
						mesocycle: {
							include: {
								mesocycleExerciseSplitDays: { select: { name: true }, orderBy: { dayIndex: 'asc' } }
							}
						}
					}
				},
				workoutExercises: {
					orderBy: { exerciseIndex: 'asc' },
					include: {
						sets: { include: { miniSets: { orderBy: { miniSetIndex: 'asc' } } }, orderBy: { setIndex: 'asc' } }
					}
				}
			}
		})
	),

	deleteById: t.procedure
		.input(
			z.union([
				z.string().cuid2(),
				z.strictObject({ id: z.string().cuid2(), confirmAdaptiveRepRangeOutliers: z.boolean().optional() })
			])
		)
		.mutation(async ({ input, ctx }) => {
			const workoutId = typeof input === 'string' ? input : input.id;
			const confirmAdaptiveRepRangeOutliers =
				typeof input === 'string' ? false : (input.confirmAdaptiveRepRangeOutliers ?? false);
			await runSerializableTransaction(async (tx) => {
				const workoutToDelete = await tx.workout.findUniqueOrThrow({
					where: { userId: ctx.userId, id: workoutId },
					select: {
						workoutOfMesocycle: {
							select: {
								id: true,
								splitDayIndex: true,
								mesocycle: {
									select: {
										id: true,
										startDate: true,
										endDate: true,
										mesocycleExerciseSplitDays: {
											select: { name: true },
											orderBy: { dayIndex: 'asc' }
										}
									}
								}
							}
						}
					}
				});

				const mesocycle = workoutToDelete.workoutOfMesocycle?.mesocycle;
				if (mesocycle && mesocycle.startDate && mesocycle.endDate === null) {
					const wom = workoutToDelete.workoutOfMesocycle!;
					const workoutsOfMeso = await tx.workout.findMany({
						where: { workoutOfMesocycle: { mesocycleId: mesocycle.id } },
						select: { workoutOfMesocycle: { select: { splitDayIndex: true } } }
					});

					const workoutsPerSplitDay: number[] = Array(mesocycle.mesocycleExerciseSplitDays.length).fill(0);
					workoutsOfMeso.forEach((w) => workoutsPerSplitDay[w.workoutOfMesocycle!.splitDayIndex]++);

					const maxSplitDayWorkouts = Math.max(...workoutsPerSplitDay);
					const lastSplitDayPerformed = workoutsPerSplitDay.findLastIndex((count) => count === maxSplitDayWorkouts);

					if (lastSplitDayPerformed !== wom.splitDayIndex) {
						throw new TRPCError({
							code: 'BAD_REQUEST',
							message: `You can only delete the latest workout of the active mesocycle: ${mesocycle.mesocycleExerciseSplitDays[lastSplitDayPerformed].name} (Day ${lastSplitDayPerformed + 1})`
						});
					}
				}

				await tx.workout.delete({ where: { id: workoutId, userId: ctx.userId } });
				if (mesocycle) {
					const adaptiveResult = await reconcileAdaptiveRepRangesInTransaction({
						tx,
						mesocycleId: mesocycle.id,
						userId: ctx.userId
					});
					if (adaptiveResult.confirmationRequired && !confirmAdaptiveRepRangeOutliers) {
						throw new TRPCError({
							code: 'BAD_REQUEST',
							message: ADAPTIVE_REP_RANGE_CONFIRMATION_REQUIRED
						});
					}
				}
			});
			return { message: 'Workout deleted successfully' };
		}),

	getTodaysWorkoutData: t.procedure.query(async ({ ctx }) => {
		const [data, measurements] = await Promise.all([
			prisma.mesocycle.findFirst({
				where: { userId: ctx.userId, startDate: { not: null }, endDate: null },
				include: {
					mesocycleExerciseSplitDays: {
						include: {
							mesocycleSplitDayExercises: {
								select: { name: true, targetMuscleGroup: true, customMuscleGroup: true },
								orderBy: { exerciseIndex: 'asc' }
							}
						},
						orderBy: { dayIndex: 'asc' }
					},
					mesocycleCyclicSetChanges: true,
					workoutsOfMesocycle: {
						include: { workout: true },
						orderBy: { workout: { startedAt: 'desc' } }
					}
				}
			}),
			getLatestBodyMeasurements(ctx.userId)
		]);

		const todaysWorkoutData: TodaysWorkoutData = {
			completionId: createId(),
			workoutExercises: [],
			userBodyweight: measurements.userBodyweight,
			userBodyFat: measurements.userBodyFat,
			startedAt: new Date(),
			endedAt: null,
			note: null,
			isLastWorkout: false
		};

		if (data === null) {
			return todaysWorkoutData;
		}

		const { isRestDay, splitDayIndex, cycleNumber, todaysSplitDay, isLastWorkout } = getBasicDayInfo(
			data,
			data.workoutsOfMesocycle.length
		);
		const { mesocycleCyclicSetChanges, workoutsOfMesocycle, mesocycleExerciseSplitDays, ...mesocycleData } = data;

		todaysWorkoutData.workoutOfMesocycle = {
			mesocycle: mesocycleData,
			splitDayName: todaysSplitDay.name,
			workoutStatus: isRestDay ? 'RestDay' : null,
			cycleNumber,
			splitDayIndex
		};

		todaysWorkoutData.isLastWorkout = isLastWorkout;

		if (!isRestDay) {
			todaysWorkoutData.workoutExercises = todaysSplitDay.mesocycleSplitDayExercises.map((exercise) => ({
				name: exercise.name,
				targetMuscleGroup: exercise.targetMuscleGroup,
				customMuscleGroup: exercise.customMuscleGroup
			}));
		}

		return todaysWorkoutData;
	}),

	getSkippedWorkoutData: t.procedure.input(z.number().int()).query(async ({ ctx, input }) => {
		const splitDayIndex = input;

		const [data, measurements] = await Promise.all([
			prisma.mesocycle.findFirst({
				where: { userId: ctx.userId, startDate: { not: null }, endDate: null },
				include: {
					mesocycleExerciseSplitDays: {
						include: {
							mesocycleSplitDayExercises: {
								select: { name: true, targetMuscleGroup: true, customMuscleGroup: true },
								orderBy: { exerciseIndex: 'asc' }
							}
						},
						orderBy: { dayIndex: 'asc' }
					},
					mesocycleCyclicSetChanges: true,
					workoutsOfMesocycle: {
						include: { workout: true },
						orderBy: { workout: { startedAt: 'desc' } }
					}
				}
			}),
			getLatestBodyMeasurements(ctx.userId)
		]);

		const todaysWorkoutData: TodaysWorkoutData = {
			completionId: createId(),
			workoutExercises: [],
			userBodyweight: measurements.userBodyweight,
			userBodyFat: measurements.userBodyFat,
			startedAt: new Date(),
			endedAt: null,
			note: null,
			isLastWorkout: false
		};

		if (data === null) {
			return todaysWorkoutData;
		}

		const { isRestDay, cycleNumber, todaysSplitDay } = getBasicDayInfoForSkippedWorkout(
			data,
			data.workoutsOfMesocycle.length,
			splitDayIndex
		);
		const { mesocycleCyclicSetChanges, workoutsOfMesocycle, mesocycleExerciseSplitDays, ...mesocycleData } = data;

		todaysWorkoutData.workoutOfMesocycle = {
			mesocycle: mesocycleData,
			splitDayName: todaysSplitDay.name,
			workoutStatus: isRestDay ? 'RestDay' : null,
			cycleNumber,
			splitDayIndex
		};

		if (!isRestDay) {
			todaysWorkoutData.workoutExercises = todaysSplitDay.mesocycleSplitDayExercises.map((exercise) => ({
				name: exercise.name,
				targetMuscleGroup: exercise.targetMuscleGroup,
				customMuscleGroup: exercise.customMuscleGroup
			}));
		}

		return todaysWorkoutData;
	}),

	getSkippedWorkoutsOfCurrentCycle: t.procedure.query(async ({ ctx }) => {
		const data = await prisma.mesocycle.findFirst({
			where: { userId: ctx.userId, startDate: { not: null }, endDate: null },
			select: {
				mesocycleExerciseSplitDays: {
					select: { name: true },
					orderBy: { dayIndex: 'asc' }
				},
				workoutsOfMesocycle: {
					select: { splitDayIndex: true, workoutStatus: true },
					orderBy: { workout: { startedAt: 'desc' } }
				}
			}
		});

		if (data === null) {
			return [];
		}

		const { workoutsOfMesocycle, mesocycleExerciseSplitDays } = data;
		const currentCycleWorkouts = workoutsOfMesocycle.slice(
			0,
			workoutsOfMesocycle.length % mesocycleExerciseSplitDays.length
		);
		const skippedWorkouts = currentCycleWorkouts.filter((wm) => wm.workoutStatus === 'Skipped');
		const skippedWorkoutsWithNames = skippedWorkouts
			.map((workout) => ({
				...workout,
				splitDayName: mesocycleExerciseSplitDays[workout.splitDayIndex].name
			}))
			.toReversed();

		return skippedWorkoutsWithNames;
	}),

	getWorkoutExercisesWithPreviousData: t.procedure
		.input(z.strictObject({ userBodyweight: z.number(), splitDayIndex: z.number().int() }))
		.query(async ({ ctx, input }) => {
			const { splitDayIndex } = input;
			const data: ActiveMesocycleWithProgressionData | null = await prisma.mesocycle.findFirst({
				where: {
					userId: ctx.userId,
					startDate: { not: null },
					endDate: null
				},
				include: createActiveMesocycleWithProgressionDataInclude()
			});

			const workoutExercisesWithPreviousData: WorkoutExercisesWithPreviousData = {
				todaysWorkoutExercises: [],
				previousWorkoutData: null
			};
			if (!data) return workoutExercisesWithPreviousData;

			const totalWorkouts = await prisma.workoutOfMesocycle.count({ where: { mesocycleId: data?.id } });
			const { isRestDay, cycleNumber } = getBasicDayInfoForSkippedWorkout(data, totalWorkouts, splitDayIndex);
			if (isRestDay) return workoutExercisesWithPreviousData;

			workoutExercisesWithPreviousData.todaysWorkoutExercises = progressiveOverloadMagic(
				data,
				cycleNumber,
				input.userBodyweight,
				splitDayIndex
			);

			const previousExercises = getPreviousWorkoutExercisePerformances(
				workoutExercisesWithPreviousData.todaysWorkoutExercises,
				data.workoutsOfMesocycle,
				splitDayIndex
			);
			if (previousExercises.length > 0) {
				workoutExercisesWithPreviousData.previousWorkoutData = { exercises: previousExercises };
			}

			return workoutExercisesWithPreviousData;
		}),

	create: t.procedure.input(createWorkoutSchema).mutation(async ({ ctx, input }) => {
		const fingerprint = completionFingerprint(input);
		const completionId = input.workoutData.completionId ?? createId();
		if (input.draftOwnerUserId !== ctx.userId) {
			throw new TRPCError({ code: 'FORBIDDEN', message: 'Workout draft belongs to another user' });
		}
		if (!hasAlignedManualDeloadMetadata(input.workoutExercises, input.manualDeloadMetadata)) {
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message: 'Manual deload metadata must align with workout exercises'
			});
		}
		const completedResult = input.workoutData.completionId
			? await getCompletedWorkoutResult(ctx.userId, input.workoutData.completionId, fingerprint)
			: null;
		if (completedResult) return completedResult;

		const workout: Prisma.WorkoutUncheckedCreateInput = {
			id: createId(),
			completionId,
			completionFingerprint: fingerprint,
			userId: ctx.userId,
			startedAt: input.workoutData.startedAt ?? new Date(),
			endedAt: new Date(),
			userBodyweight: input.workoutData.userBodyweight,
			userBodyFat: input.workoutData.userBodyFat ?? null,
			note: input.workoutData.note
		};

		const { workoutOfMesocycle } = input.workoutData;
		if (workoutOfMesocycle) {
			workout.workoutOfMesocycle = {
				create: {
					mesocycleId: workoutOfMesocycle.mesocycle.id,
					splitDayIndex: workoutOfMesocycle.splitDayIndex,
					workoutStatus: workoutOfMesocycle.workoutStatus
				}
			};
		}

		const workoutExercises: Prisma.WorkoutExerciseUncheckedCreateInput[] = input.workoutExercises.map((ex) => ({
			...ex,
			workoutId: workout.id as string,
			id: createId()
		}));

		const workoutExercisesSets: Prisma.WorkoutExerciseSetUncheckedCreateInput[] = input.workoutExercisesSets.flatMap(
			(sets, exerciseIdx) =>
				sets.map((set) => ({
					...set,
					id: createId(),
					workoutExerciseId: workoutExercises[exerciseIdx].id as string
				}))
		);

		let setIndex = 0;
		const workoutExercisesMiniSets: Prisma.WorkoutExerciseMiniSetUncheckedCreateInput[] =
			input.workoutExercisesMiniSets.flatMap((sets) =>
				sets.flatMap((miniSets) => {
					const mappedMiniSets = miniSets.map((miniSet) => ({
						...miniSet,
						workoutExerciseSetId: workoutExercisesSets[setIndex].id as string
					}));
					setIndex += 1;
					return mappedMiniSets;
				})
			);

		let mesocycleCompleted = false;
		try {
			await runSerializableTransaction(async (tx) => {
				const transactionWorkoutExercises = workoutExercises.map((exercise) => ({ ...exercise }));
				if (!workoutOfMesocycle) {
					await createWorkoutGraph({
						tx,
						workout,
						workoutExercises: transactionWorkoutExercises,
						workoutExerciseSets: workoutExercisesSets,
						workoutExerciseMiniSets: workoutExercisesMiniSets
					});
					return;
				}

				const mesocycleData = await tx.mesocycle.findFirst({
					where: { id: workoutOfMesocycle.mesocycle.id, userId: ctx.userId },
					select: {
						endDate: true,
						RIRProgression: true,
						mesocycleExerciseSplitDays: {
							select: { id: true, isRestDay: true },
							orderBy: { dayIndex: 'asc' }
						},
						workoutsOfMesocycle: {
							select: { workoutId: true, splitDayIndex: true, workoutStatus: true },
							orderBy: { workout: { startedAt: 'desc' } }
						}
					}
				});
				if (!mesocycleData) {
					throw new TRPCError({ code: 'BAD_REQUEST', message: 'Mesocycle not found' });
				}
				if (mesocycleData.endDate) {
					throw new TRPCError({ code: 'CONFLICT', message: 'This workout is no longer the current plan day' });
				}
				const expectedSplitDayIndex =
					mesocycleData.workoutsOfMesocycle.length % mesocycleData.mesocycleExerciseSplitDays.length;
				const expectedCycleNumber =
					1 + Math.floor(mesocycleData.workoutsOfMesocycle.length / mesocycleData.mesocycleExerciseSplitDays.length);
				const currentCycleWorkouts = mesocycleData.workoutsOfMesocycle.slice(0, expectedSplitDayIndex);
				const submittedSplitDay = mesocycleData.mesocycleExerciseSplitDays[workoutOfMesocycle.splitDayIndex];
				const replacesSkippedWorkout = currentCycleWorkouts.some(
					(workout) => workout.splitDayIndex === workoutOfMesocycle.splitDayIndex && workout.workoutStatus === 'Skipped'
				);
				const statusMatchesSplit = submittedSplitDay
					? submittedSplitDay.isRestDay === (workoutOfMesocycle.workoutStatus === 'RestDay')
					: false;
				if (
					!statusMatchesSplit ||
					(workoutOfMesocycle.cycleNumber !== undefined && workoutOfMesocycle.cycleNumber !== expectedCycleNumber) ||
					(workoutOfMesocycle.splitDayIndex !== expectedSplitDayIndex && !replacesSkippedWorkout)
				) {
					throw new TRPCError({ code: 'CONFLICT', message: 'This workout is no longer the current plan day' });
				}

				if (workoutOfMesocycle.workoutStatus === null) {
					await syncWorkoutExerciseTemplates({
						tx,
						userId: ctx.userId,
						mesocycleId: workoutOfMesocycle.mesocycle.id,
						splitDayIndex: workoutOfMesocycle.splitDayIndex,
						workoutExercises: transactionWorkoutExercises,
						workoutExerciseSets: input.workoutExercisesSets,
						manualDeloadMetadata: input.manualDeloadMetadata
					});
					const proposedPerformances = transactionWorkoutExercises.map((exercise, exerciseIdx) =>
						toProposedAdaptivePerformance({
							exercise: { ...exercise, id: exercise.id as string },
							sets: input.workoutExercisesSets[exerciseIdx],
							performedAt: workout.endedAt as Date,
							workoutStatus: workoutOfMesocycle.workoutStatus,
							splitDayIndex: workoutOfMesocycle.splitDayIndex
						})
					);
					const adaptiveResult = await reconcileAdaptiveRepRangesInTransaction({
						tx,
						mesocycleId: workoutOfMesocycle.mesocycle.id,
						userId: ctx.userId,
						proposedPerformances
					});
					if (adaptiveResult.confirmationRequired && !input.confirmAdaptiveRepRangeOutliers) {
						throw new TRPCError({
							code: 'BAD_REQUEST',
							message: ADAPTIVE_REP_RANGE_CONFIRMATION_REQUIRED
						});
					}
				}

				await createWorkoutGraph({
					tx,
					workout,
					workoutExercises: transactionWorkoutExercises,
					workoutExerciseSets: workoutExercisesSets,
					workoutExerciseMiniSets: workoutExercisesMiniSets
				});

				const repeatOfSkippedWorkout = currentCycleWorkouts.find(
					(wm) => wm.splitDayIndex === workoutOfMesocycle.splitDayIndex && wm.workoutStatus === 'Skipped'
				);

				const totalWorkouts = arraySum(mesocycleData.RIRProgression) * mesocycleData.mesocycleExerciseSplitDays.length;
				const completedWorkouts = mesocycleData.workoutsOfMesocycle.length + (repeatOfSkippedWorkout ? 0 : 1);
				mesocycleCompleted = repeatOfSkippedWorkout === undefined && completedWorkouts >= totalWorkouts;

				if (repeatOfSkippedWorkout) {
					await tx.workout.delete({ where: { id: repeatOfSkippedWorkout.workoutId, userId: ctx.userId } });
				} else if (mesocycleCompleted) {
					await tx.workout.update({ where: { id: workout.id as string }, data: { mesocycleCompleted: true } });
					await tx.mesocycle.update({
						where: { id: workoutOfMesocycle.mesocycle.id, userId: ctx.userId },
						data: { endDate: new Date() }
					});
				}
			});
		} catch (error) {
			if (input.workoutData.completionId) {
				const retryResult = await getCompletedWorkoutResult(ctx.userId, completionId, fingerprint);
				if (retryResult) return retryResult;
			}
			throw error;
		}

		let message = 'Workout created successfully';
		if (workoutOfMesocycle?.workoutStatus === 'RestDay') {
			message = 'Rest day completed successfully';
		}
		if (workoutOfMesocycle?.workoutStatus === 'Skipped') {
			message = 'Workout skipped successfully';
		}
		return { message, mesocycleCompleted };
	}),

	editById: t.procedure
		.input(
			z.strictObject({
				id: z.string().cuid2(),
				data: createWorkoutSchema,
				endedAt: z.date().or(z.string().date())
			})
		)
		.mutation(async ({ ctx, input }) => {
			if (input.data.draftOwnerUserId !== ctx.userId) {
				throw new TRPCError({ code: 'FORBIDDEN', message: 'Workout draft belongs to another user' });
			}
			const workout: Prisma.WorkoutUncheckedCreateInput = {
				id: input.id,
				userId: ctx.userId,
				startedAt: input.data.workoutData.startedAt!,
				endedAt: input.endedAt,
				userBodyweight: input.data.workoutData.userBodyweight,
				userBodyFat: input.data.workoutData.userBodyFat ?? null,
				note: input.data.workoutData.note
			};

			const workoutExercises: Prisma.WorkoutExerciseUncheckedCreateInput[] = input.data.workoutExercises.map((ex) => ({
				...ex,
				workoutId: workout.id as string,
				id: createId()
			}));
			const workoutExercisesSets: Prisma.WorkoutExerciseSetUncheckedCreateInput[] =
				input.data.workoutExercisesSets.flatMap((sets, exerciseIdx) =>
					sets.map((set) => ({
						...set,
						id: createId(),
						workoutExerciseId: workoutExercises[exerciseIdx].id as string
					}))
				);
			let setIndex = 0;
			const workoutExercisesMiniSets: Prisma.WorkoutExerciseMiniSetUncheckedCreateInput[] =
				input.data.workoutExercisesMiniSets.flatMap((sets) =>
					sets.flatMap((miniSets) => {
						const mappedMiniSets = miniSets.map((miniSet) => ({
							...miniSet,
							workoutExerciseSetId: workoutExercisesSets[setIndex].id as string
						}));
						setIndex += 1;
						return mappedMiniSets;
					})
				);

			await runSerializableTransaction(async (tx) => {
				const existingWorkout = await tx.workout.findFirst({
					where: { id: input.id, userId: ctx.userId },
					select: {
						completionId: true,
						completionFingerprint: true,
						mesocycleCompleted: true,
						workoutOfMesocycle: true
					}
				});
				if (!existingWorkout) throw new TRPCError({ code: 'NOT_FOUND', message: 'Workout not found' });

				const workoutOfMesocycle = existingWorkout.workoutOfMesocycle;
				workout.completionId = existingWorkout.completionId;
				workout.completionFingerprint = existingWorkout.completionFingerprint;
				workout.mesocycleCompleted = existingWorkout.mesocycleCompleted;
				if (workoutOfMesocycle) {
					const requestedTemplateIds = [
						...new Set(
							workoutExercises.flatMap(({ mesocycleExerciseTemplateId }) =>
								mesocycleExerciseTemplateId ? [mesocycleExerciseTemplateId] : []
							)
						)
					];
					const validTemplateCount = await tx.mesocycleExerciseTemplate.count({
						where: {
							id: { in: requestedTemplateIds },
							mesocycleExerciseSplitDay: {
								mesocycle: { id: workoutOfMesocycle.mesocycleId, userId: ctx.userId }
							}
						}
					});
					if (validTemplateCount !== requestedTemplateIds.length) {
						throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid exercise source template' });
					}
					const proposedPerformances = workoutExercises.map((exercise, exerciseIdx) =>
						toProposedAdaptivePerformance({
							exercise: { ...exercise, id: exercise.id as string },
							sets: input.data.workoutExercisesSets[exerciseIdx],
							performedAt: new Date(workout.endedAt as Date | string),
							workoutStatus: workoutOfMesocycle.workoutStatus,
							splitDayIndex: workoutOfMesocycle.splitDayIndex
						})
					);
					const adaptiveResult = await reconcileAdaptiveRepRangesInTransaction({
						tx,
						mesocycleId: workoutOfMesocycle.mesocycleId,
						userId: ctx.userId,
						proposedPerformances,
						excludedWorkoutIds: [input.id]
					});
					if (adaptiveResult.confirmationRequired && !input.data.confirmAdaptiveRepRangeOutliers) {
						throw new TRPCError({
							code: 'BAD_REQUEST',
							message: ADAPTIVE_REP_RANGE_CONFIRMATION_REQUIRED
						});
					}
				}

				await tx.workout.delete({ where: { id: input.id, userId: ctx.userId } });
				await createWorkoutGraph({
					tx,
					workout,
					workoutExercises,
					workoutExerciseSets: workoutExercisesSets,
					workoutExerciseMiniSets: workoutExercisesMiniSets,
					workoutOfMesocycle: workoutOfMesocycle ?? undefined
				});
			});
			return { message: 'Workout edited successfully' };
		}),

	getExerciseHistory: t.procedure
		.input(z.strictObject({ exerciseName: z.string(), cursorId: z.string().cuid2().optional() }))
		.query(async ({ ctx, input }) => {
			return await prisma.workoutExercise.findMany({
				where: { workout: { userId: ctx.userId }, name: input.exerciseName },
				include: {
					workout: {
						select: {
							startedAt: true,
							userBodyweight: true,
							workoutOfMesocycle: {
								select: {
									splitDayIndex: true,
									mesocycle: {
										select: {
											name: true,
											mesocycleExerciseSplitDays: {
												select: { name: true },
												orderBy: { dayIndex: 'asc' }
											}
										}
									}
								}
							}
						}
					},
					sets: { include: { miniSets: true }, orderBy: { setIndex: 'asc' } }
				},
				cursor: input.cursorId !== undefined ? { id: input.cursorId } : undefined,
				skip: input.cursorId !== undefined ? 1 : 0,
				take: 10,
				orderBy: { workout: { startedAt: 'desc' } }
			});
		}),

	getExerciseChartHistory: t.procedure
		.input(
			z.strictObject({
				exerciseName: z.string(),
				cursor: z.strictObject({ startedAt: z.date(), id: z.string().cuid2() }).optional()
			})
		)
		.query(async ({ ctx, input }) => {
			const chartPageSize = 50;
			const exercises = await prisma.workoutExercise.findMany({
				where: {
					name: input.exerciseName,
					isDeload: false,
					AND: [
						{ workout: { userId: ctx.userId } },
						...(input.cursor
							? [
									{
										OR: [
											{ workout: { startedAt: { lt: input.cursor.startedAt } } },
											{ workout: { startedAt: input.cursor.startedAt }, id: { lt: input.cursor.id } }
										]
									}
								]
							: [])
					]
				},
				select: {
					id: true,
					bodyweightFraction: true,
					workout: {
						select: {
							startedAt: true,
							userBodyweight: true,
							workoutOfMesocycle: { select: { mesocycle: { select: { name: true } } } }
						}
					},
					sets: {
						select: {
							setIndex: true,
							reps: true,
							load: true,
							RIR: true,
							skipped: true,
							miniSets: {
								select: { miniSetIndex: true, reps: true, load: true, RIR: true },
								orderBy: { miniSetIndex: 'asc' }
							}
						},
						orderBy: { setIndex: 'asc' }
					}
				},
				orderBy: [{ workout: { startedAt: 'desc' } }, { id: 'desc' }],
				take: chartPageSize + 1
			});

			const hasNextPage = exercises.length > chartPageSize;
			const items = hasNextPage ? exercises.slice(0, chartPageSize) : exercises;
			const lastItem = items.at(-1);
			return {
				items,
				nextCursor: hasNextPage && lastItem ? { id: lastItem.id, startedAt: lastItem.workout.startedAt } : undefined
			};
		}),

	getUserExercises: t.procedure.input(z.enum(['minimal', 'extensive'])).query(async ({ ctx, input }) => {
		const selectQuery: Prisma.WorkoutExerciseSelect | undefined =
			input === 'minimal' ? { name: true, targetMuscleGroup: true, customMuscleGroup: true } : undefined;

		return prisma.workoutExercise.findMany({
			where: { workout: { userId: ctx.userId } },
			distinct: ['name'],
			orderBy: { workout: { startedAt: 'desc' } },
			select: selectQuery
		});
	})
});

function getBasicDayInfo(
	mesocycleData: {
		mesocycleExerciseSplitDays: (MesocycleExerciseSplitDay & {
			mesocycleSplitDayExercises: {
				name: string;
				targetMuscleGroup: MuscleGroup;
				customMuscleGroup: string | null;
			}[];
		})[];
		RIRProgression: number[];
	},
	totalWorkouts: number
) {
	const { mesocycleExerciseSplitDays } = mesocycleData;
	const splitLength = mesocycleExerciseSplitDays.length;
	const todaysSplitDay = mesocycleExerciseSplitDays[totalWorkouts % splitLength];
	const isRestDay = todaysSplitDay.isRestDay;
	const splitDayIndex = totalWorkouts % splitLength;
	const cycleNumber = 1 + Math.floor(totalWorkouts / splitLength);
	const isLastWorkout = totalWorkouts === arraySum(mesocycleData.RIRProgression) * splitLength - 1;
	return { isRestDay, splitDayIndex, cycleNumber, todaysSplitDay, isLastWorkout };
}

function getBasicDayInfoForSkippedWorkout(
	mesocycleData: {
		mesocycleExerciseSplitDays: (MesocycleExerciseSplitDay & {
			mesocycleSplitDayExercises: {
				name: string;
				targetMuscleGroup: MuscleGroup;
				customMuscleGroup: string | null;
			}[];
		})[];
		workoutsOfMesocycle: WorkoutOfMesocycle[];
	},
	totalWorkouts: number,
	skippedWorkoutIndex: number
) {
	const { mesocycleExerciseSplitDays } = mesocycleData;
	const splitLength = mesocycleExerciseSplitDays.length;
	const todaysSplitDay = mesocycleExerciseSplitDays[skippedWorkoutIndex];
	const isRestDay = todaysSplitDay.isRestDay;
	const cycleNumber = 1 + Math.floor(totalWorkouts / splitLength);
	return { isRestDay, cycleNumber, todaysSplitDay };
}
