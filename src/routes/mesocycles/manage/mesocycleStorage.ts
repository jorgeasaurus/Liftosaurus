type ProgressionVariable = 'Reps' | 'Load';

function getProgressionVariable(value: object): ProgressionVariable | undefined {
	if (!('preferredProgressionVariable' in value)) return;
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
