<script lang="ts">
	import { onMount } from 'svelte';
	import SunriseIcon from 'virtual:icons/lucide/sunrise';
	import type { PageData } from './$types';
	import DashboardMetricsCard from './(components)/DashboardMetricsCard.svelte';
	import GetStartedComponent from './(components)/GetStartedComponent.svelte';
	import TodaysWorkoutCard from './(components)/TodaysWorkoutCard.svelte';
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';

	let { data }: { data: PageData } = $props();

	const userName = data.session?.user?.name?.split(' ')[0];
	let greeting = $state('Welcome');
	let today = $state('');

	onMount(() => {
		const hour = new Date().getHours();
		greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
		today = new Date().toLocaleDateString(navigator.language, {
			weekday: 'long',
			month: 'long',
			day: 'numeric'
		});
	});
</script>

<section class="mx-auto flex w-full max-w-5xl flex-col gap-5 lg:gap-6">
	<header>
		<h1 class="flex items-center gap-2.5 text-2xl font-semibold tracking-tight lg:text-4xl">
			<SunriseIcon class="h-6 w-6 shrink-0 text-primary lg:h-8 lg:w-8" />
			{greeting}{userName ? `, ${userName}` : ''}
		</h1>
		<p class="mt-1 text-sm text-muted-foreground">{today}</p>
	</header>

	<div class="grid items-start gap-4 lg:grid-cols-12 lg:gap-6">
		<div class="lg:col-span-7 xl:col-span-8">
			<TodaysWorkoutCard todaysWorkoutData={data.todaysWorkoutData} />
		</div>
		<aside class="lg:col-span-5 xl:col-span-4">
			{#await data.entityCounts}
				<Skeleton class="h-52 w-full" />
			{:then entityCounts}
				<GetStartedComponent {entityCounts} />
			{:catch}
				<!-- Onboarding checklist is non-critical; fail silently -->
			{/await}
		</aside>
	</div>

	<DashboardMetricsCard chartData={data.dashboardChartData} />
</section>
