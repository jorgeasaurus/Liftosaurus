export type WorkoutStartDataSelection<T> = {
	workoutData: T;
	appliedRevision: number;
	restoredDraft: boolean;
};

export function selectWorkoutStartData<T>({
	defaultWorkoutData,
	restoredWorkoutData,
	editing,
	requestRevision,
	currentRevision,
	appliedRevision
}: {
	defaultWorkoutData: T;
	restoredWorkoutData: T | null;
	editing: boolean;
	requestRevision: number;
	currentRevision: number;
	appliedRevision: number;
}): WorkoutStartDataSelection<T> {
	const shouldRestoreDraft = editing || currentRevision !== requestRevision || currentRevision !== appliedRevision;
	const restoredDraft = shouldRestoreDraft && restoredWorkoutData !== null;
	return {
		workoutData: restoredDraft ? restoredWorkoutData : defaultWorkoutData,
		appliedRevision: shouldRestoreDraft ? currentRevision : appliedRevision,
		restoredDraft
	};
}
