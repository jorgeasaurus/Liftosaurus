import { prisma } from '$lib/prisma';
import {
	customExerciseWriteSchema,
	prismaUniqueConflict,
	toCustomExerciseWriteData
} from '$lib/server/customExercises';
import { t } from '$lib/trpc/t';
import { isBuiltInExerciseName } from '$lib/utils/exerciseCatalog';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

const ownedCustomExerciseIdSchema = z.strictObject({
	id: z.string().cuid2()
});

async function requireOwnedCustomExercise(userId: string, id: string) {
	const exercise = await prisma.customExercise.findFirst({
		where: { id, userId }
	});
	if (!exercise) {
		throw new TRPCError({ code: 'NOT_FOUND', message: 'Custom exercise not found' });
	}
	return exercise;
}

export const customExercises = t.router({
	list: t.procedure.query(async ({ ctx }) => {
		return prisma.customExercise.findMany({
			where: { userId: ctx.userId },
			orderBy: [{ name: 'asc' }, { id: 'asc' }]
		});
	}),

	upsert: t.procedure.input(customExerciseWriteSchema).mutation(async ({ ctx, input }) => {
		const data = toCustomExerciseWriteData(input);
		if (isBuiltInExerciseName(data.name)) {
			throw new TRPCError({ code: 'BAD_REQUEST', message: 'Built-in exercises cannot be saved as custom exercises' });
		}

		try {
			return await prisma.customExercise.upsert({
				where: { userId_nameNormalized: { userId: ctx.userId, nameNormalized: data.nameNormalized } },
				create: { userId: ctx.userId, ...data },
				update: data
			});
		} catch (error) {
			if (prismaUniqueConflict(error)) {
				throw new TRPCError({ code: 'CONFLICT', message: 'A custom exercise with this name already exists' });
			}
			throw error;
		}
	}),

	updateById: t.procedure
		.input(z.intersection(ownedCustomExerciseIdSchema, customExerciseWriteSchema))
		.mutation(async ({ ctx, input }) => {
			const existing = await requireOwnedCustomExercise(ctx.userId, input.id);
			const data = toCustomExerciseWriteData(input);
			if (isBuiltInExerciseName(data.name)) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'Built-in exercises cannot be saved as custom exercises'
				});
			}

			try {
				return await prisma.customExercise.update({
					where: { id: existing.id, userId: ctx.userId },
					data
				});
			} catch (error) {
				if (prismaUniqueConflict(error)) {
					throw new TRPCError({ code: 'CONFLICT', message: 'A custom exercise with this name already exists' });
				}
				throw error;
			}
		}),

	deleteById: t.procedure.input(z.string().cuid2()).mutation(async ({ ctx, input }) => {
		const existing = await requireOwnedCustomExercise(ctx.userId, input);
		await prisma.customExercise.delete({ where: { id: existing.id, userId: ctx.userId } });
		return { message: 'Custom exercise deleted successfully' };
	})
});
