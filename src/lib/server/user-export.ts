import { Prisma, type PrismaClient } from '@prisma/client';
import { prisma } from '../prisma.js';

export const USER_BACKUP_FORMAT = 'liftosaurus-user-backup';
export const USER_BACKUP_VERSION = 1;

const workoutForCsvSelect = Prisma.validator<Prisma.WorkoutSelect>()({
	id: true,
	userBodyweight: true,
	startedAt: true,
	endedAt: true,
	note: true,
	workoutOfMesocycle: {
		select: {
			mesocycleId: true,
			splitDayIndex: true,
			workoutStatus: true
		}
	},
	workoutExercises: {
		orderBy: [{ exerciseIndex: 'asc' }, { id: 'asc' }],
		select: {
			id: true,
			exerciseIndex: true,
			name: true,
			targetMuscleGroup: true,
			customMuscleGroup: true,
			bodyweightFraction: true,
			setType: true,
			note: true,
			sets: {
				orderBy: [{ setIndex: 'asc' }, { id: 'asc' }],
				select: {
					id: true,
					setIndex: true,
					reps: true,
					load: true,
					RIR: true,
					skipped: true,
					miniSets: {
						orderBy: [{ miniSetIndex: 'asc' }, { id: 'asc' }],
						select: {
							id: true,
							miniSetIndex: true,
							reps: true,
							load: true,
							RIR: true
						}
					}
				}
			}
		}
	}
});

export type WorkoutForCsv = Prisma.WorkoutGetPayload<{ select: typeof workoutForCsvSelect }>;

type CsvValue = string | number | boolean | Date | null;

const CSV_HEADERS = [
	'workout_id',
	'started_at',
	'ended_at',
	'workout_note',
	'bodyweight_lb',
	'mesocycle_id',
	'split_day_index',
	'workout_status',
	'exercise_id',
	'exercise_index',
	'exercise_name',
	'target_muscle_group',
	'custom_muscle_group',
	'bodyweight_fraction',
	'exercise_set_type',
	'exercise_note',
	'set_kind',
	'set_id',
	'parent_set_id',
	'set_number',
	'mini_set_number',
	'reps',
	'external_load_lb',
	'effective_load_lb',
	'rir',
	'skipped'
] as const;

function csvCell(value: CsvValue): string {
	let text = value instanceof Date ? value.toISOString() : value === null ? '' : String(value);

	if (typeof value === 'string' && /^[\t\r\n ]*[=+\-@]/.test(text)) {
		text = `'${text}`;
	}

	return `"${text.replaceAll('"', '""')}"`;
}

export function buildWorkoutSetsCsv(workouts: WorkoutForCsv[]): string {
	const rows: CsvValue[][] = [Array.from(CSV_HEADERS)];

	for (const workout of workouts) {
		for (const exercise of workout.workoutExercises) {
			const bodyweightLoad = (exercise.bodyweightFraction ?? 0) * workout.userBodyweight;

			for (const set of exercise.sets) {
				const common: CsvValue[] = [
					workout.id,
					workout.startedAt,
					workout.endedAt,
					workout.note,
					workout.userBodyweight,
					workout.workoutOfMesocycle?.mesocycleId ?? null,
					workout.workoutOfMesocycle?.splitDayIndex ?? null,
					workout.workoutOfMesocycle?.workoutStatus ?? null,
					exercise.id,
					exercise.exerciseIndex,
					exercise.name,
					exercise.targetMuscleGroup,
					exercise.customMuscleGroup,
					exercise.bodyweightFraction,
					exercise.setType,
					exercise.note
				];

				rows.push([
					...common,
					'regular',
					set.id,
					null,
					set.setIndex + 1,
					null,
					set.reps,
					set.load,
					set.load + bodyweightLoad,
					set.RIR,
					set.skipped
				]);

				for (const miniSet of set.miniSets) {
					rows.push([
						...common,
						'mini',
						miniSet.id,
						set.id,
						set.setIndex + 1,
						miniSet.miniSetIndex + 1,
						miniSet.reps,
						miniSet.load,
						miniSet.load + bodyweightLoad,
						miniSet.RIR,
						set.skipped
					]);
				}
			}
		}
	}

	return `${rows.map((row) => row.map(csvCell).join(',')).join('\r\n')}\r\n`;
}

export async function buildUserJsonBackup(userId: string, exportedAt = new Date(), db: PrismaClient = prisma) {
	const [
		user,
		userSettings,
		exerciseSplits,
		exerciseSplitDays,
		exerciseTemplates,
		mesocycles,
		mesocycleCyclicSetChanges,
		mesocycleExerciseSplitDays,
		mesocycleExerciseTemplates,
		workouts,
		workoutsOfMesocycle,
		workoutExercises,
		workoutExerciseSets,
		workoutExerciseMiniSets
	] = await db.$transaction([
		db.user.findUnique({
			where: { id: userId },
			select: {
				id: true,
				name: true,
				email: true,
				emailVerified: true,
				image: true,
				createdAt: true,
				updatedAt: true,
				migratedFromV2: true
			}
		}),
		db.userSettings.findUnique({ where: { userId } }),
		db.exerciseSplit.findMany({ where: { userId }, orderBy: { id: 'asc' } }),
		db.exerciseSplitDay.findMany({
			where: { exerciseSplit: { userId } },
			orderBy: [{ exerciseSplitId: 'asc' }, { dayIndex: 'asc' }, { id: 'asc' }]
		}),
		db.exerciseTemplate.findMany({
			where: { exerciseSplitDay: { exerciseSplit: { userId } } },
			orderBy: [{ exerciseSplitDayId: 'asc' }, { exerciseIndex: 'asc' }, { id: 'asc' }]
		}),
		db.mesocycle.findMany({ where: { userId }, orderBy: [{ startDate: 'asc' }, { id: 'asc' }] }),
		db.mesocycleCyclicSetChange.findMany({
			where: { mesocycle: { userId } },
			orderBy: [{ mesocycleId: 'asc' }, { id: 'asc' }]
		}),
		db.mesocycleExerciseSplitDay.findMany({
			where: { mesocycle: { userId } },
			orderBy: [{ mesocycleId: 'asc' }, { dayIndex: 'asc' }, { id: 'asc' }]
		}),
		db.mesocycleExerciseTemplate.findMany({
			where: { mesocycleExerciseSplitDay: { mesocycle: { userId } } },
			orderBy: [{ mesocycleExerciseSplitDayId: 'asc' }, { exerciseIndex: 'asc' }, { id: 'asc' }]
		}),
		db.workout.findMany({ where: { userId }, orderBy: [{ startedAt: 'asc' }, { id: 'asc' }] }),
		db.workoutOfMesocycle.findMany({
			where: { workout: { userId } },
			orderBy: [{ mesocycleId: 'asc' }, { splitDayIndex: 'asc' }, { id: 'asc' }]
		}),
		db.workoutExercise.findMany({
			where: { workout: { userId } },
			orderBy: [{ workoutId: 'asc' }, { exerciseIndex: 'asc' }, { id: 'asc' }]
		}),
		db.workoutExerciseSet.findMany({
			where: { workoutExercise: { workout: { userId } } },
			orderBy: [{ workoutExerciseId: 'asc' }, { setIndex: 'asc' }, { id: 'asc' }]
		}),
		db.workoutExerciseMiniSet.findMany({
			where: { parentSet: { workoutExercise: { workout: { userId } } } },
			orderBy: [{ workoutExerciseSetId: 'asc' }, { miniSetIndex: 'asc' }, { id: 'asc' }]
		})
	]);

	if (!user) {
		throw new Error('Authenticated user was not found');
	}

	return {
		format: USER_BACKUP_FORMAT,
		version: USER_BACKUP_VERSION,
		exportedAt: exportedAt.toISOString(),
		data: {
			user,
			userSettings,
			exerciseSplits,
			exerciseSplitDays,
			exerciseTemplates,
			mesocycles,
			mesocycleCyclicSetChanges,
			mesocycleExerciseSplitDays,
			mesocycleExerciseTemplates,
			workouts,
			workoutsOfMesocycle,
			workoutExercises,
			workoutExerciseSets,
			workoutExerciseMiniSets
		}
	};
}

export async function buildUserCsvExport(userId: string, db: PrismaClient = prisma): Promise<string> {
	const workouts = await db.workout.findMany({
		where: { userId },
		select: workoutForCsvSelect,
		orderBy: [{ startedAt: 'asc' }, { id: 'asc' }]
	});

	return buildWorkoutSetsCsv(workouts);
}

export function backupFilename(extension: 'json' | 'csv', exportedAt = new Date()): string {
	return `liftosaurus-backup-${exportedAt.toISOString().slice(0, 10)}.${extension}`;
}
