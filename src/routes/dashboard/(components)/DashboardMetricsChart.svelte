<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import type { RouterOutputs } from '$lib/trpc/router';
	import type { Selected } from 'bits-ui';
	import {
		CategoryScale,
		Chart,
		Filler,
		Legend,
		LinearScale,
		LineController,
		LineElement,
		PointElement,
		TimeScale,
		Tooltip
	} from 'chart.js';
	import 'chartjs-adapter-date-fns';
	import { mode } from 'mode-watcher';
	import { onDestroy } from 'svelte';

	Chart.register(
		Tooltip,
		Legend,
		LineController,
		LineElement,
		PointElement,
		Filler,
		CategoryScale,
		TimeScale,
		LinearScale
	);

	type ChartData = RouterOutputs['workouts']['getDashboardChartData'];
	type ChartType = 'relative-performance' | 'bodyweight' | 'seven-day-bodyweight' | 'work-volume';
	type DataKey = keyof ChartData;
	type ChartDefinition = {
		value: ChartType;
		label: string;
		dataKey: DataKey;
		unit: string;
		description: string;
		decimals: number;
	};

	let { data }: { data: ChartData } = $props();

	const chartDefinitions: ChartDefinition[] = [
		{
			value: 'relative-performance',
			label: 'Relative performance',
			dataKey: 'relativePerformance',
			unit: '%',
			description: 'Average set performance versus the first matching session.',
			decimals: 1
		},
		{
			value: 'bodyweight',
			label: 'Bodyweight',
			dataKey: 'bodyweight',
			unit: 'lb',
			description: 'Bodyweight recorded when each workout started.',
			decimals: 1
		},
		{
			value: 'seven-day-bodyweight',
			label: 'Bodyweight · 7-day average',
			dataKey: 'sevenDayBodyweight',
			unit: 'lb',
			description: 'Average of available bodyweight entries from the trailing seven days.',
			decimals: 1
		},
		{
			value: 'work-volume',
			label: 'Work volume',
			dataKey: 'workVolume',
			unit: 'lb × reps',
			description: 'Optional estimated work volume for the upcoming split day.',
			decimals: 0
		}
	];

	const defaultDefinition = data.relativePerformance.length > 0 ? chartDefinitions[0] : chartDefinitions[1];
	let selectedChartType: Selected<ChartType> = $state({
		value: defaultDefinition.value,
		label: defaultDefinition.label
	});
	let selectedDefinition = $derived(
		chartDefinitions.find((definition) => definition.value === selectedChartType.value) ?? defaultDefinition
	);
	let selectedPoints = $derived(data[selectedDefinition.dataKey]);
	let latestPoint = $derived(selectedPoints.at(-1));

	let chart: Chart | undefined;
	let chartCanvas: HTMLCanvasElement | undefined = $state();

	$effect(() => {
		const definition = selectedDefinition;
		const points = selectedPoints;
		const currentMode = $mode;
		chart?.destroy();
		chart = undefined;
		if (!chartCanvas || points.length === 0) return;

		const style = getComputedStyle(document.body);
		const primaryColor = style.getPropertyValue('--primary').trim().replaceAll(' ', ', ');
		const secondaryColor = style.getPropertyValue('--secondary').trim().replaceAll(' ', ', ');
		void currentMode;

		chart = new Chart(chartCanvas, {
			type: 'line',
			data: {
				labels: points.map((point) => new Date(point.timestamp)),
				datasets: [
					{
						label: definition.label,
						data: points.map((point) => point.value),
						backgroundColor: `hsl(${secondaryColor})`,
						borderColor: `hsl(${primaryColor})`,
						pointBackgroundColor: `hsl(${primaryColor})`,
						borderWidth: 2,
						fill: true,
						tension: 0.25
					}
				]
			},
			options: {
				maintainAspectRatio: false,
				scales: {
					x: { type: 'time', time: { unit: 'day' } },
					y: { title: { display: true, text: definition.unit } }
				},
				plugins: { legend: { display: false } }
			}
		});
	});

	onDestroy(() => chart?.destroy());
</script>

<div class="space-y-4">
	<div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
		<div class="min-w-0">
			<p class="text-sm text-muted-foreground">{selectedDefinition.description}</p>
			{#if latestPoint}
				<p class="mt-1 text-sm font-semibold">
					Latest: {latestPoint.value.toFixed(selectedDefinition.decimals)}
					{selectedDefinition.unit}
				</p>
			{/if}
		</div>
		<Select.Root bind:selected={selectedChartType}>
			<Select.Label class="sr-only">Dashboard chart</Select.Label>
			<Select.Trigger class="w-full sm:w-64" aria-label="Dashboard chart">
				<Select.Value placeholder="Select chart" />
			</Select.Trigger>
			<Select.Content>
				{#each chartDefinitions as definition}
					<Select.Item value={definition.value}>{definition.label}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	</div>

	{#if selectedPoints.length === 0}
		<div class="flex h-44 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
			No data yet for this chart.
		</div>
	{:else}
		<div class="h-52" role="img" aria-label={`${selectedDefinition.label} chart in ${selectedDefinition.unit}`}>
			<canvas bind:this={chartCanvas} aria-hidden="true"></canvas>
		</div>
		<table class="sr-only">
			<caption>{selectedDefinition.label} historical data</caption>
			<thead>
				<tr>
					<th scope="col">Date</th>
					<th scope="col">Value</th>
				</tr>
			</thead>
			<tbody>
				{#each selectedPoints as point}
					<tr>
						<td
							><time datetime={new Date(point.timestamp).toISOString()}
								>{new Date(point.timestamp).toLocaleDateString()}</time
							></td
						>
						<td>{point.value.toFixed(selectedDefinition.decimals)} {selectedDefinition.unit}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>
