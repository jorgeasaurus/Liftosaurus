import { readFile } from 'node:fs/promises';
import { PrismaClient } from '@prisma/client';
import { buildRpImportPlan, type RpBootstrap } from './lib/rp-import-plan.js';

type CliOptions = {
	source: string;
	userEmail: string;
	mesocycleKey: string;
	from: string;
	through: string;
	apply: boolean;
};

const options = parseArguments(process.argv.slice(2));
const source = JSON.parse(await readFile(options.source, 'utf8')) as RpBootstrap;
const plan = buildRpImportPlan(source, options);

console.log(
	JSON.stringify(
		{
			mode: options.apply ? 'apply' : 'dry-run',
			userEmail: options.userEmail,
			mesocycle: plan.name,
			sourceKey: plan.sourceMesocycleKey,
			from: options.from,
			through: options.through,
			...plan.counts
		},
		null,
		2
	)
);

if (!options.apply) {
	console.log('Dry run complete. Re-run with --apply to write this import.');
	process.exit(0);
}

const prisma = new PrismaClient();
try {
	const user = await prisma.user.findUnique({ where: { email: options.userEmail } });
	if (!user) throw new Error(`No Liftosaurus user exists for ${options.userEmail}. Sign in once before importing.`);

	const duplicate = await prisma.mesocycle.findFirst({
		where: { userId: user.id, name: plan.name, startDate: plan.startDate },
		select: { id: true }
	});
	if (duplicate) throw new Error(`Mesocycle ${plan.name} was already imported as ${duplicate.id}.`);

	const mesocycleId = await prisma.$transaction(
		async (tx) => {
			const mesocycle = await tx.mesocycle.create({
				data: {
					name: plan.name,
					userId: user.id,
					RIRProgression: plan.RIRProgression,
					startDate: plan.startDate,
					endDate: plan.endDate,
					startOverloadPercentage: 0,
					lastSetToFailure: false,
					forceRIRMatching: false,
					mesocycleExerciseSplitDays: {
						create: plan.splitDays.map((day) => ({
							name: day.name,
							dayIndex: day.dayIndex,
							isRestDay: day.isRestDay,
							mesocycleSplitDayExercises: {
								create: day.exercises.map((exercise) => ({
									...exercise,
									customMuscleGroup: null
								}))
							}
						}))
					}
				}
			});

			for (const workout of plan.workouts) {
				await tx.workout.create({
					data: {
						userId: user.id,
						userBodyweight: workout.userBodyweight,
						startedAt: workout.startedAt,
						endedAt: workout.endedAt,
						note: workout.note,
						workoutOfMesocycle: {
							create: { mesocycleId: mesocycle.id, splitDayIndex: workout.splitDayIndex }
						},
						workoutExercises: {
							create: workout.exercises.map((exercise) => {
								const { sets, ...data } = exercise;
								return {
									...data,
									customMuscleGroup: null,
									sets: { create: sets }
								};
							})
						}
					}
				});
			}

			return mesocycle.id;
		},
		{ timeout: 60_000 }
	);

	console.log(`Imported ${plan.counts.workouts} workouts into mesocycle ${mesocycleId}.`);
} finally {
	await prisma.$disconnect();
}

function parseArguments(args: string[]): CliOptions {
	const values = new Map<string, string>();
	let apply = false;
	for (let index = 0; index < args.length; index += 1) {
		const argument = args[index];
		if (argument === '--') continue;
		if (argument === '--apply') {
			apply = true;
			continue;
		}
		if (!argument.startsWith('--')) throw new Error(`Unexpected argument: ${argument}`);
		const value = args[index + 1];
		if (!value || value.startsWith('--')) throw new Error(`Missing value for ${argument}.`);
		values.set(argument, value);
		index += 1;
	}

	const required = (flag: string) => {
		const value = values.get(flag);
		if (!value) throw new Error(`Missing required ${flag}.`);
		return value;
	};

	return {
		source: required('--source'),
		userEmail: required('--user-email'),
		mesocycleKey: required('--mesocycle-key'),
		from: required('--from'),
		through: required('--through'),
		apply
	};
}
