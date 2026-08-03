import { z } from 'zod';
import { MuscleGroupSchema } from '../zodSchemas/index.js';

const exerciseNameSchema = z
	.string()
	.min(1)
	.refine((name) => name.trim().length > 0);
const builtInMuscleGroupSchema = MuscleGroupSchema.exclude(['Custom']);

export const historicalExerciseMuscleGroupUpdateSchema = z.discriminatedUnion('targetMuscleGroup', [
	z.strictObject({
		exerciseName: exerciseNameSchema,
		targetMuscleGroup: builtInMuscleGroupSchema,
		customMuscleGroup: z.null()
	}),
	z.strictObject({
		exerciseName: exerciseNameSchema,
		targetMuscleGroup: z.literal('Custom'),
		customMuscleGroup: z.string().trim().min(1)
	})
]);
