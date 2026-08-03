<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Select from '$lib/components/ui/select';
	import {
		getComparableWorkoutExercisePairs,
		getExerciseVolume,
		getSetVolume,
		type SetDetails,
		type WorkoutExerciseInProgress
	} from '$lib/utils/workoutUtils';
	import { BarController, BarElement, CategoryScale, Chart, Legend, LinearScale, Tooltip } from 'chart.js';
	import type { PreviousWorkoutData } from '../../workoutRunes.svelte';
	import type { Selected } from 'bits-ui';
	Chart.register(Tooltip, Legend, BarController, BarElement, CategoryScale, LinearScale);

	type PropsType = {
		previousWorkoutData: NonNullable<PreviousWorkoutData>;
		currentWorkoutData: {
			exercises: WorkoutExerciseInProgress[];
			userBodyweight: number;
		};
	};

	let { previousWorkoutData, currentWorkoutData }: PropsType = $props();
	let chartCanvas: HTMLCanvasElement | undefined = $state();
	let chart: Chart<'bar', number[], string>;
	let comparableExercises = $derived(
		getComparableWorkoutExercisePairs(currentWorkoutData.exercises, previousWorkoutData.exercises)
	);
	let hasSinglePreviousWorkout = $derived(
		comparableExercises.length > 0 &&
			new Set(comparableExercises.map(({ previousExercise }) => previousExercise.workoutId)).size === 1
	);

	const chartTypes = ['Work volume', 'Sets'] as const;
	let selectedChartType: Selected<(typeof chartTypes)[number]> = $state({
		value: 'Work volume',
		label: 'Work volume'
	});

	$effect(() => {
		if (chart) chart.destroy();
		if (!hasSinglePreviousWorkout || chartCanvas === undefined) return;
		if (selectedChartType.value === 'Work volume') {
			const previousWorkoutVolume = comparableExercises.reduce((volume, { previousExercise }) => {
				return volume + getExerciseVolume(previousExercise, previousExercise.userBodyweight);
			}, 0);
			const currentWorkoutVolume = comparableExercises.reduce((exerciseVolume, { currentExercise }) => {
				return (
					exerciseVolume +
					currentExercise.sets.reduce((setVolume, set) => {
						if (set.reps === undefined || set.load === undefined || set.RIR === undefined) {
							return setVolume;
						}
						return (
							setVolume +
							getSetVolume(
								set as SetDetails,
								currentWorkoutData.userBodyweight,
								currentExercise.bodyweightFraction ?? null
							)
						);
					}, 0)
				);
			}, 0);
			chart = new Chart(chartCanvas, {
				type: 'bar',
				data: {
					labels: ['Previous', 'Today'],
					datasets: [
						{
							label: selectedChartType.value,
							data: [previousWorkoutVolume, currentWorkoutVolume]
						}
					]
				}
			});
		} else {
			const previousWorkoutSets = comparableExercises.reduce((sets, { previousExercise }) => {
				return sets + previousExercise.sets.length;
			}, 0);
			const currentWorkoutSets = comparableExercises.reduce((sets, { currentExercise }) => {
				return sets + currentExercise.sets.length;
			}, 0);
			chart = new Chart(chartCanvas, {
				type: 'bar',
				data: {
					labels: ['Previous', 'Today'],
					datasets: [
						{
							label: selectedChartType.value,
							data: [previousWorkoutSets, currentWorkoutSets]
						}
					]
				}
			});
		}
	});
</script>

<Card.Root class="space-y-2 p-4">
	{#if comparableExercises.length === 0}
		<p class="text-sm text-muted-foreground">No comparable normal exercise performances are available.</p>
	{:else if hasSinglePreviousWorkout}
		<canvas bind:this={chartCanvas} id="chart-canvas"></canvas>
		<Select.Root bind:selected={selectedChartType}>
			<Select.Label class="p-0">Chart</Select.Label>
			<Select.Trigger class="mb-2 w-full">
				<Select.Value placeholder="Select chart" />
			</Select.Trigger>
			<Select.Content class="max-h-48 overflow-y-auto">
				{#each chartTypes as chartType}
					<Select.Item value={chartType}>{chartType}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	{:else}
		<p class="text-sm text-muted-foreground">
			Overall comparison is unavailable because the latest normal exercise baselines come from different workouts.
		</p>
	{/if}
</Card.Root>
