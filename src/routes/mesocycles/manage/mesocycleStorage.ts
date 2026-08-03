type ProgressionVariable = 'Reps' | 'Load';
type RepRangeMode = 'Fixed' | 'Adaptive';

function isPlainObject(value: unknown): value is Record<string, unknown> {
	if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
	const prototype = Object.getPrototypeOf(value);
	return prototype === Object.prototype || prototype === null;
}

function getProgressionVariable(value: unknown): ProgressionVariable | undefined {
	if (!isPlainObject(value)) return;
	const preference = value.preferredProgressionVariable;
	return preference === 'Reps' || preference === 'Load' ? preference : undefined;
}

function getRepRangeMode(value: object): RepRangeMode | undefined {
	if (!('repRangeMode' in value)) return;
	const mode = value.repRangeMode;
	return mode === 'Fixed' || mode === 'Adaptive' ? mode : undefined;
}

function getResetDate(value: object): Date | null {
	if (!('adaptiveRepRangeResetAt' in value) || value.adaptiveRepRangeResetAt === null) return null;
	const resetAt = new Date(value.adaptiveRepRangeResetAt as string | Date);
	return Number.isNaN(resetAt.valueOf()) ? null : resetAt;
}

export function normalizeSavedMesocycleState<
	State extends { mesocycle: object; mesocycleExerciseTemplates: object[][] }
>(savedState: State) {
	return {
		...savedState,
		mesocycle: {
			...savedState.mesocycle,
			preferredProgressionVariable: getProgressionVariable(savedState.mesocycle) ?? 'Reps',
			repRangeMode: getRepRangeMode(savedState.mesocycle) ?? 'Fixed'
		},
		mesocycleExerciseTemplates: savedState.mesocycleExerciseTemplates.map((day) =>
			day.map((exercise) => ({
				...exercise,
				preferredProgressionVariable: getProgressionVariable(exercise) ?? null,
				repRangeMode: getRepRangeMode(exercise) ?? null,
				adaptiveRepRangeResetAt: getResetDate(exercise)
			}))
		)
	};
}
