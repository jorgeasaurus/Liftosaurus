<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Select from '$lib/components/ui/select';
	import { buildWorkoutComparison } from '$lib/utils/workoutComparison';
	import type { WorkoutExerciseInProgress } from '$lib/utils/workoutUtils';
	import { BarController, BarElement, CategoryScale, Chart, Legend, LinearScale, Tooltip } from 'chart.js';
	import type { PreviousWorkoutData } from '../../workoutRunes.svelte';
	import type { Selected } from 'bits-ui';
	import ArrowDownIcon from 'virtual:icons/lucide/arrow-down-right';
	import ArrowUpIcon from 'virtual:icons/lucide/arrow-up-right';
	import MinusIcon from 'virtual:icons/lucide/minus';
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
	let comparison = $derived(
		buildWorkoutComparison(
			currentWorkoutData.exercises,
			previousWorkoutData.exercises,
			currentWorkoutData.userBodyweight
		)
	);
	let hasSinglePreviousWorkout = $derived(comparison.rows.length > 0 && comparison.baselineWorkoutIds.size === 1);

	const volumeFormatter = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });

	const chartTypes = ['Work volume', 'Sets'] as const;
	let selectedChartType: Selected<(typeof chartTypes)[number]> = $state({
		value: 'Work volume',
		label: 'Work volume'
	});

	$effect(() => {
		if (chart) chart.destroy();
		if (!hasSinglePreviousWorkout || chartCanvas === undefined) return;
		if (selectedChartType.value === 'Work volume') {
			chart = new Chart(chartCanvas, {
				type: 'bar',
				data: {
					labels: ['Previous', 'Today'],
					datasets: [
						{
							label: selectedChartType.value,
							data: [comparison.previousVolume, comparison.currentVolume]
						}
					]
				}
			});
		} else {
			chart = new Chart(chartCanvas, {
				type: 'bar',
				data: {
					labels: ['Previous', 'Today'],
					datasets: [
						{
							label: selectedChartType.value,
							data: [comparison.previousSetCount, comparison.currentSetCount]
						}
					]
				}
			});
		}
	});
</script>

<Card.Root class="space-y-2 p-4">
	{#if comparison.rows.length === 0}
		<p class="text-sm text-muted-foreground">No comparable normal exercise performances are available.</p>
	{:else}
		<div>
			<p class="section-kicker">Exercise changes</p>
			<p class="mt-1 text-sm text-muted-foreground">Estimated work volume compared with each latest normal baseline.</p>
		</div>
		<div class="overflow-x-auto rounded-xl border">
			<table class="w-full min-w-[30rem] text-left text-sm">
				<thead class="bg-muted/35 text-[11px] uppercase tracking-wide text-muted-foreground">
					<tr>
						<th class="px-3 py-2 font-semibold">Exercise</th>
						<th class="px-3 py-2 text-right font-semibold">Previous</th>
						<th class="px-3 py-2 text-right font-semibold">Today</th>
						<th class="px-3 py-2 text-right font-semibold">Change</th>
					</tr>
				</thead>
				<tbody>
					{#each comparison.rows as row}
						<tr class="divided-row">
							<th class="px-3 py-2.5 font-semibold">{row.name}</th>
							<td class="px-3 py-2.5 text-right tabular-nums text-muted-foreground">
								{volumeFormatter.format(row.previousVolume)}
							</td>
							<td class="px-3 py-2.5 text-right tabular-nums">{volumeFormatter.format(row.currentVolume)}</td>
							<td class="px-3 py-2.5 text-right">
								{#if row.change === null}
									<span class="text-muted-foreground">—</span>
								{:else}
									<span
										class="inline-flex items-center justify-end gap-1 tabular-nums"
										class:text-primary={row.change > 0}
										class:text-destructive={row.change < 0}
										class:text-muted-foreground={row.change === 0}
									>
										{#if row.change > 0}<ArrowUpIcon class="h-3.5 w-3.5" />
										{:else if row.change < 0}<ArrowDownIcon class="h-3.5 w-3.5" />
										{:else}<MinusIcon class="h-3.5 w-3.5" />{/if}
										{row.change > 0 ? '+' : ''}{row.change.toFixed(1)}%
									</span>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		{#if hasSinglePreviousWorkout}
			<div class="mt-3 border-t border-dashed pt-3">
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
			</div>
		{:else}
			<p class="border-t border-dashed pt-3 text-xs text-muted-foreground">
				The chart is unavailable because these exercise baselines come from different workouts.
			</p>
		{/if}
	{/if}
</Card.Root>
