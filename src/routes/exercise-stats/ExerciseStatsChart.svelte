<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import * as Popover from '$lib/components/ui/popover';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';
	import type { RouterOutputs } from '$lib/trpc/router';
	import { generateShadesAndTints } from '$lib/utils';
	import {
		buildExerciseChartDatasets,
		getExerciseChartSetCount,
		hasExerciseBodyweightLoad,
		resolveExerciseChartType,
		type ExerciseChartType
	} from '$lib/utils/exerciseStatsChart';
	import { MAX_EXERCISE_CHART_PERFORMANCES } from '$lib/utils/exerciseChartHistory';
	import {
		CategoryScale,
		Chart,
		Filler,
		LinearScale,
		LineController,
		LineElement,
		PointElement,
		TimeScale,
		Title,
		Tooltip
	} from 'chart.js';
	import 'chartjs-adapter-date-fns';
	import { onDestroy } from 'svelte';
	import LoaderCircle from 'virtual:icons/lucide/loader-circle';
	import MenuIcon from 'virtual:icons/lucide/menu';
	Chart.register(
		Tooltip,
		CategoryScale,
		LineController,
		LineElement,
		PointElement,
		Filler,
		TimeScale,
		Title,
		LinearScale
	);

	type WorkoutExercise = RouterOutputs['workouts']['getExerciseChartHistory']['items'][number];
	type PropsType = { exercises: WorkoutExercise[] | undefined; selectedExercise: string; historyTruncated?: boolean };

	let { exercises, selectedExercise, historyTruncated = false }: PropsType = $props();
	let chart: Chart | undefined;
	let chartCanvas: HTMLCanvasElement | undefined = $state();

	let maxSets = $derived(getExerciseChartSetCount(exercises ?? []));
	let chartType: ExerciseChartType = $state('relative-overload');
	let selectedSets: string[] = $state([]);
	let chartDatasets = $derived(buildExerciseChartDatasets(exercises ?? [], chartType, selectedSets.map(Number)));
	let hasBodyweightLoad = $derived(hasExerciseBodyweightLoad(exercises ?? []));
	let chartAccessibleName = $derived(
		`${selectedExercise} ${chartType === 'relative-overload' ? 'relative overload' : chartType === 'absolute-load' ? 'absolute load' : 'load plus bodyweight'} progression chart`
	);

	$effect(() => {
		selectedSets = Array.from({ length: Math.min(maxSets, 2) }, (_, idx) => idx.toString());
	});

	$effect(() => {
		const supportedChartType = resolveExerciseChartType(chartType, exercises);
		if (supportedChartType !== chartType) chartType = supportedChartType;
	});

	$effect(() => {
		chart?.destroy();
		chart = undefined;
		if (chartCanvas === undefined || exercises === undefined) return;

		const colors = generateShadesAndTints(maxSets);

		chart = new Chart(chartCanvas, {
			type: 'line',
			data: {
				labels: exercises.map((ex) => new Date(ex.workout.startedAt)),
				datasets: chartDatasets.map(({ data, setIndex }) => ({
					label: `Set ${setIndex + 1}`,
					data,
					borderColor: colors[setIndex],
					tension: 0.2,
					borderWidth: 2,
					spanGaps: false
				}))
			},
			options: {
				scales: {
					x: {
						type: 'time',
						time: {
							unit: 'day'
						}
					}
				},
				plugins: {
					legend: {
						display: false
					}
				}
			}
		});
	});

	onDestroy(() => chart?.destroy());

	function formatChartValue(value: number) {
		return chartType === 'relative-overload' ? `${value.toFixed(2)}%` : `${value.toFixed(2)} lbs`;
	}
</script>

<Card.Root>
	<Card.Header>
		<div class="flex justify-between gap-6">
			<div class="min-w-0">
				<Card.Title class="truncate">{selectedExercise}</Card.Title>
				{#if exercises !== undefined}
					<p class="text-xs text-muted-foreground">{exercises.length} performances</p>
					{#if historyTruncated}
						<p role="status" class="text-xs text-muted-foreground">
							Showing the most recent {MAX_EXERCISE_CHART_PERFORMANCES.toLocaleString()} performances; older history is omitted.
						</p>
					{/if}
				{/if}
			</div>
			<Popover.Root>
				<Popover.Trigger aria-label="Menu"><MenuIcon /></Popover.Trigger>
				<Popover.Content align="end">
					<span class="font-semibold">Chart type</span>
					<RadioGroup.Root class="py-2" bind:value={chartType}>
						<div class="flex items-center space-x-2">
							<RadioGroup.Item value="relative-overload" id="relative-overload" />
							<Label for="relative-overload">Relative overload</Label>
						</div>
						<div class="flex items-center space-x-2">
							<RadioGroup.Item value="absolute-load" id="absolute-load" />
							<Label for="absolute-load">Absolute load</Label>
						</div>
						{#if hasBodyweightLoad}
							<div class="flex items-center space-x-2">
								<RadioGroup.Item value="load-and-bodyweight" id="load-and-bodyweight" />
								<Label for="load-and-bodyweight">Load + BW</Label>
							</div>
						{/if}
					</RadioGroup.Root>

					<Separator class="my-2" />

					<span class="font-semibold">Sets to graph</span>
					<ToggleGroup.Root class="justify-start py-1" type="multiple" bind:value={selectedSets}>
						{#each Array.from({ length: maxSets }) as _, idx}
							<ToggleGroup.Item size="sm" value={idx.toString()}>{idx + 1}</ToggleGroup.Item>
						{/each}
					</ToggleGroup.Root>
				</Popover.Content>
			</Popover.Root>
		</div>
	</Card.Header>
	<Card.Content>
		{#if exercises === undefined}
			<div class="flex items-center gap-2 px-2 text-sm text-muted-foreground">
				<LoaderCircle class="animate-spin" /> Fetching performances
			</div>
		{:else if exercises.length === 0}
			<p class="px-2 text-sm text-muted-foreground">No performances found</p>
		{:else}
			<div role="img" aria-label={chartAccessibleName}>
				<canvas bind:this={chartCanvas} data-testid="exercise-stats-chart" aria-hidden="true" height="240"></canvas>
			</div>
			<table class="sr-only">
				<caption>{chartAccessibleName} data</caption>
				<thead>
					<tr>
						<th scope="col">Date</th>
						<th scope="col">Set</th>
						<th scope="col">Value</th>
					</tr>
				</thead>
				<tbody>
					{#each chartDatasets as dataset}
						{#each dataset.data as value, performanceIndex}
							{#if value !== null}
								<tr data-performance-id={exercises[performanceIndex].id}>
									<td>{new Date(exercises[performanceIndex].workout.startedAt).toLocaleDateString()}</td>
									<td>{dataset.setIndex + 1}</td>
									<td>{formatChartValue(value)}</td>
								</tr>
							{/if}
						{/each}
					{/each}
				</tbody>
			</table>
		{/if}
	</Card.Content>
</Card.Root>
