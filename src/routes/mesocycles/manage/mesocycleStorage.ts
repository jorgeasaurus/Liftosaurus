type ProgressionVariable = 'Reps' | 'Load';

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

export function normalizeSavedMesocycleState<
	State extends { mesocycle: object; mesocycleExerciseTemplates: object[][] }
>(savedState: State) {
	return {
		...savedState,
		mesocycle: {
			...savedState.mesocycle,
			preferredProgressionVariable: getProgressionVariable(savedState.mesocycle) ?? 'Reps'
		},
		mesocycleExerciseTemplates: savedState.mesocycleExerciseTemplates.map((day) =>
			day.map((exercise) => ({
				...exercise,
				preferredProgressionVariable: getProgressionVariable(exercise) ?? null
			}))
		)
	};
}
