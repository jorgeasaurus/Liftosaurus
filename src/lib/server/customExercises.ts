import { isBuiltInExerciseName, normalizeExerciseName } from '$lib/utils/exerciseCatalog';
import { ChangeTypeSchema, MuscleGroupSchema, SetTypeSchema } from '$lib/zodSchemas';
import type { ChangeType, MuscleGroup, PrismaClient, SetType } from '@prisma/client';
import { createId } from '@paralleldrive/cuid2';
import { z } from 'zod';

type CustomExerciseDb = Pick<PrismaClient, 'customExercise'>;

const exerciseNameSchema = z
	.string()
	.trim()
	.min(1)
	.max(200)
	.refine((name) => name.trim().length > 0);

export const customExerciseWriteSchema = z
	.strictObject({
		name: exerciseNameSchema,
		targetMuscleGroup: MuscleGroupSchema,
		customMuscleGroup: z.string().trim().min(1).max(80).nullable().optional(),
		bodyweightFraction: z.number().positive().nullable().optional(),
		setType: SetTypeSchema.optional(),
		repRangeStart: z.number().int().min(1).optional(),
		repRangeEnd: z.number().int().min(2).optional(),
		changeType: ChangeTypeSchema.nullable().optional(),
		changeAmount: z.number().nullable().optional(),
		note: z.string().max(1000).nullable().optional()
	})
	.superRefine((input, ctx) => {
		if (input.targetMuscleGroup === 'Custom' && !input.customMuscleGroup) {
			ctx.addIssue({ code: 'custom', message: 'Custom muscle group is required', path: ['customMuscleGroup'] });
		}
		if (input.targetMuscleGroup !== 'Custom' && input.customMuscleGroup) {
			ctx.addIssue({
				code: 'custom',
				message: 'Custom muscle group is only valid for the Custom target',
				path: ['customMuscleGroup']
			});
		}
		if (
			input.repRangeStart !== undefined &&
			input.repRangeEnd !== undefined &&
			input.repRangeEnd <= input.repRangeStart
		) {
			ctx.addIssue({ code: 'custom', message: 'Rep range end must be greater than start', path: ['repRangeEnd'] });
		}
	});

export type CustomExerciseWriteInput = z.infer<typeof customExerciseWriteSchema>;

export type NamedExerciseInput = {
	name: string;
	targetMuscleGroup: MuscleGroup;
	customMuscleGroup?: string | null;
	bodyweightFraction?: number | null;
	setType?: SetType;
	repRangeStart?: number;
	repRangeEnd?: number;
	changeType?: ChangeType | null;
	changeAmount?: number | null;
	note?: string | null;
};

export function toCustomExerciseWriteData(input: CustomExerciseWriteInput) {
	const name = input.name.trim();
	return {
		name,
		nameNormalized: normalizeExerciseName(name),
		targetMuscleGroup: input.targetMuscleGroup,
		customMuscleGroup: input.targetMuscleGroup === 'Custom' ? (input.customMuscleGroup ?? null) : null,
		bodyweightFraction: input.bodyweightFraction ?? null,
		setType: input.setType ?? 'Straight',
		repRangeStart: input.repRangeStart ?? 8,
		repRangeEnd: input.repRangeEnd ?? 12,
		changeType: input.changeType ?? null,
		changeAmount: input.changeAmount ?? null,
		note: input.note ?? null
	};
}

export function toCustomExerciseSummary<
	T extends {
		id: string;
		name: string;
		targetMuscleGroup: MuscleGroup;
		customMuscleGroup: string | null;
		bodyweightFraction: number | null;
		setType: SetType;
		repRangeStart: number;
		repRangeEnd: number;
		changeType: ChangeType | null;
		changeAmount: number | null;
		note: string | null;
	}
>(exercise: T) {
	return {
		customExerciseId: exercise.id,
		name: exercise.name,
		targetMuscleGroup: exercise.targetMuscleGroup,
		customMuscleGroup: exercise.customMuscleGroup,
		bodyweightFraction: exercise.bodyweightFraction,
		setType: exercise.setType,
		repRangeStart: exercise.repRangeStart,
		repRangeEnd: exercise.repRangeEnd,
		changeType: exercise.changeType,
		changeAmount: exercise.changeAmount,
		note: exercise.note
	};
}

export async function persistCustomExercises(
	userId: string,
	exercises: NamedExerciseInput[],
	db: CustomExerciseDb
): Promise<void> {
	const seen = new Set<string>();

	for (const exercise of exercises) {
		const parsed = customExerciseWriteSchema.safeParse({
			name: exercise.name,
			targetMuscleGroup: exercise.targetMuscleGroup,
			customMuscleGroup: exercise.customMuscleGroup,
			bodyweightFraction: exercise.bodyweightFraction,
			setType: exercise.setType,
			repRangeStart: exercise.repRangeStart,
			repRangeEnd: exercise.repRangeEnd,
			changeType: exercise.changeType,
			changeAmount: exercise.changeAmount,
			note: exercise.note
		});
		if (!parsed.success) continue;

		const data = toCustomExerciseWriteData(parsed.data);
		if (isBuiltInExerciseName(data.name) || seen.has(data.nameNormalized)) continue;
		seen.add(data.nameNormalized);

		await db.customExercise.upsert({
			where: { userId_nameNormalized: { userId, nameNormalized: data.nameNormalized } },
			create: { id: createId(), userId, ...data },
			update: {}
		});
	}
}

export function prismaUniqueConflict(error: unknown): boolean {
	return typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002';
}
