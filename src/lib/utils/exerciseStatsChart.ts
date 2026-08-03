import { solveBergerFormula, type SetDetails } from './workoutUtils.js';

export type ExerciseChartType = 'relative-overload' | 'absolute-load' | 'load-and-bodyweight';

export type ExerciseChartPerformance = {
	bodyweightFraction: number | null;
	workout: {
		startedAt: Date | string;
		userBodyweight: number;
	};
	sets: (SetDetails & {
		setIndex: number;
		skipped: boolean;
	})[];
};

export type ExerciseChartDataset = {
	setIndex: number;
	data: (number | null)[];
};

function getCompletedSet(performance: ExerciseChartPerformance, setIndex: number) {
	return performance.sets.find((set) => set.setIndex === setIndex && !set.skipped);
}

export function getExerciseChartSetCount(performances: ExerciseChartPerformance[]) {
	return performances.reduce(
		(maxSets, performance) => Math.max(maxSets, ...performance.sets.map((set) => set.setIndex + 1), 0),
		0
	);
}

export function hasExerciseBodyweightLoad(performances: ExerciseChartPerformance[]) {
	return performances.some((performance) => typeof performance.bodyweightFraction === 'number');
}

export function resolveExerciseChartType(
	chartType: ExerciseChartType,
	performances: ExerciseChartPerformance[] | undefined
): ExerciseChartType {
	if (performances === undefined || chartType !== 'load-and-bodyweight') return chartType;
	return hasExerciseBodyweightLoad(performances) ? chartType : 'absolute-load';
}

export function buildExerciseChartDatasets(
	performances: ExerciseChartPerformance[],
	chartType: ExerciseChartType,
	selectedSetIndexes: number[]
): ExerciseChartDataset[] {
	return selectedSetIndexes.map((setIndex) => {
		if (chartType === 'relative-overload') {
			const baselinePerformance = performances.find((performance) => getCompletedSet(performance, setIndex));
			const baselineSet = baselinePerformance && getCompletedSet(baselinePerformance, setIndex);

			return {
				setIndex,
				data: performances.map((performance) => {
					const currentSet = getCompletedSet(performance, setIndex);
					if (!baselinePerformance || !baselineSet || !currentSet) return null;
					if (performance === baselinePerformance) return 0;

					return solveBergerFormula({
						variableToSolve: 'OverloadPercentage',
						knownValues: {
							oldBodyweightFraction: baselinePerformance.bodyweightFraction,
							newBodyweightFraction: performance.bodyweightFraction,
							newSet: currentSet,
							oldSet: baselineSet,
							oldUserBodyweight: baselinePerformance.workout.userBodyweight,
							newUserBodyweight: performance.workout.userBodyweight
						}
					});
				})
			};
		}

		return {
			setIndex,
			data: performances.map((performance) => {
				const currentSet = getCompletedSet(performance, setIndex);
				if (!currentSet) return null;
				if (chartType === 'absolute-load') return currentSet.load;

				return currentSet.load + (performance.bodyweightFraction ?? 0) * performance.workout.userBodyweight;
			})
		};
	});
}
