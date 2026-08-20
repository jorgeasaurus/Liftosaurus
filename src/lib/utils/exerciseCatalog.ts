import { commonExercisePerMuscleGroup } from '$lib/common/commonExercises';
import type { SplitExerciseTemplateWithoutIdsOrIndex } from '$lib/components/mesocycleAndExerciseSplit/commonTypes';
import type { ChangeType, MuscleGroup, SetType } from '@prisma/client';

export type UserExerciseSummary = {
	name: string;
	targetMuscleGroup: MuscleGroup;
	customMuscleGroup: string | null;
	customExerciseId?: string | null;
	bodyweightFraction?: number | null;
	setType?: SetType;
	repRangeStart?: number;
	repRangeEnd?: number;
	changeType?: ChangeType | null;
	changeAmount?: number | null;
	note?: string | null;
};

export type BuiltInCatalogItem = SplitExerciseTemplateWithoutIdsOrIndex & {
	type: 'builtIn';
};

export type PersonalCatalogItem = UserExerciseSummary & {
	type: 'personal';
};

export type ExerciseCatalogItem = BuiltInCatalogItem | PersonalCatalogItem;
export type ExerciseCatalogGroup = { muscleGroup: string; exercises: ExerciseCatalogItem[] };

export const normalizeExerciseName = (name: string) => name.trim().toLowerCase();

const builtInExerciseNames = new Set(
	commonExercisePerMuscleGroup.flatMap((group) =>
		group.exercises.map((exercise) => normalizeExerciseName(exercise.name))
	)
);

export function isBuiltInExerciseName(name: string) {
	return builtInExerciseNames.has(normalizeExerciseName(name));
}

export function mergePickableUserExercises(
	customExercises: UserExerciseSummary[],
	historyExercises: UserExerciseSummary[]
): UserExerciseSummary[] {
	const merged = new Map<string, UserExerciseSummary>();

	for (const exercise of customExercises) {
		const normalizedName = normalizeExerciseName(exercise.name);
		if (!normalizedName || isBuiltInExerciseName(exercise.name)) continue;
		merged.set(normalizedName, exercise);
	}

	for (const exercise of historyExercises) {
		const normalizedName = normalizeExerciseName(exercise.name);
		if (!normalizedName || merged.has(normalizedName)) continue;
		merged.set(normalizedName, exercise);
	}

	return [...merged.values()];
}

export function buildExerciseCatalog(userExercises: UserExerciseSummary[] = []): ExerciseCatalogGroup[] {
	const groups: ExerciseCatalogGroup[] = commonExercisePerMuscleGroup.map((group) => ({
		muscleGroup: group.muscleGroup,
		exercises: group.exercises.map((exercise) => ({
			...exercise,
			type: 'builtIn' as const
		}))
	}));
	const catalogNames = new Set(
		groups.flatMap((group) => group.exercises.map((exercise) => normalizeExerciseName(exercise.name)))
	);

	for (const exercise of userExercises) {
		const normalizedName = normalizeExerciseName(exercise.name);
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
