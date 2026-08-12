<script lang="ts">
	import { invalidate } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import type { RouterOutputs } from '$lib/trpc/router';
	import DashboardMetricsChart from './DashboardMetricsChart.svelte';
	import CraftedLoadingState from '$lib/components/CraftedLoadingState.svelte';

	type Props = {
		chartData: Promise<RouterOutputs['workouts']['getDashboardChartData']>;
	};

	let { chartData }: Props = $props();
	let retrying = $state(false);

	async function retry() {
		retrying = true;
		try {
			await invalidate('workouts:all');
		} finally {
			retrying = false;
		}
	}
</script>

<Card.Root class="surface-panel overflow-hidden rounded-xl">
	<Card.Header>
		<Card.Title>Progress trends</Card.Title>
		<Card.Description>Track performance or bodyweight without tying progress to one volume metric.</Card.Description>
	</Card.Header>
	<Card.Content>
		{#await chartData}
			<CraftedLoadingState label="Loading progress trends" />
		{:then chartData}
			<DashboardMetricsChart data={chartData} />
		{:catch}
			<div class="flex min-h-36 flex-col items-center justify-center gap-3 text-center" role="alert">
				<p class="text-sm text-muted-foreground">Progress trends could not be loaded.</p>
				<Button variant="outline" size="sm" onclick={retry} disabled={retrying}>
					{retrying ? 'Retrying…' : 'Retry trends'}
				</Button>
			</div>
		{/await}
	</Card.Content>
</Card.Root>
