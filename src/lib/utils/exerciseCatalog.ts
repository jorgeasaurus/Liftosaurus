import { commonExercisePerMuscleGroup } from '$lib/common/commonExercises';
import type { SplitExerciseTemplateWithoutIdsOrIndex } from '$lib/components/mesocycleAndExerciseSplit/commonTypes';
import type { MuscleGroup } from '@prisma/client';

export type UserExerciseSummary = {
	name: string;
	targetMuscleGroup: MuscleGroup;
	customMuscleGroup: string | null;
};

export type BuiltInCatalogItem = SplitExerciseTemplateWithoutIdsOrIndex & {
	type: 'builtIn';
};

export type PersonalCatalogItem = UserExerciseSummary & {
	type: 'personal';
};

export type ExerciseCatalogItem = BuiltInCatalogItem | PersonalCatalogItem;
export type ExerciseCatalogGroup = { muscleGroup: string; exercises: ExerciseCatalogItem[] };

const normalizeName = (name: string) => name.trim().toLowerCase();

export function buildExerciseCatalog(userExercises: UserExerciseSummary[] = []): ExerciseCatalogGroup[] {
	const groups: ExerciseCatalogGroup[] = commonExercisePerMuscleGroup.map((group) => ({
		muscleGroup: group.muscleGroup,
		exercises: group.exercises.map((exercise) => ({
			...exercise,
			type: 'builtIn' as const
		}))
	}));
	const catalogNames = new Set(
		groups.flatMap((group) => group.exercises.map((exercise) => normalizeName(exercise.name)))
	);

	for (const exercise of userExercises) {
		const normalizedName = normalizeName(exercise.name);
		if (catalogNames.has(normalizedName)) continue;
		catalogNames.add(normalizedName);
		const muscleGroup = exercise.customMuscleGroup ?? exercise.targetMuscleGroup;
		const item: PersonalCatalogItem = { ...exercise, type: 'personal' };
		const existingGroup = groups.find((group) => group.muscleGroup === muscleGroup);
		if (existingGroup) existingGroup.exercises.push(item);
		else groups.push({ muscleGroup, exercises: [item] });
	}

	return groups;
}
