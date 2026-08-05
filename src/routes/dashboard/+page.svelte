<script lang="ts">
	import ChevronDownIcon from 'virtual:icons/lucide/chevron-down';
	import PlayIcon from 'virtual:icons/lucide/play';
	import SunriseIcon from 'virtual:icons/lucide/sunrise';
	import type { PageData } from './$types';
	import DashboardMetricsCard from './(components)/DashboardMetricsCard.svelte';
	import GetStartedComponent from './(components)/GetStartedComponent.svelte';
	import TodaysWorkoutCard from './(components)/TodaysWorkoutCard.svelte';

	let { data }: { data: PageData } = $props();
</script>

<section class="mx-auto flex w-full max-w-[1480px] flex-col gap-4">
	<header class="flex items-center justify-between">
		<h1 class="inline-flex items-center gap-3 text-[44px] font-semibold leading-none tracking-[-0.03em] text-[#f3f6f2]"><SunriseIcon class="h-7 w-7 text-[#c7f43a]" />Good morning</h1>
		<div class="flex items-center gap-3">
			<button class="inline-flex items-center gap-2 rounded-xl border border-[#273034] bg-[#171e20] px-4 py-3 text-sm font-medium text-[#f3f6f2]" type="button">
				Upper Strength
				<ChevronDownIcon class="h-4 w-4 text-[#98a3b2]" />
			</button>
			<a class="inline-flex items-center gap-2 rounded-xl bg-[#c7f43a] px-7 py-3 text-sm font-semibold text-[#1b260f] transition-colors hover:bg-[#d2f95a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c7f43a]" href="/workouts/manage/start">
				<PlayIcon class="h-4 w-4" />
				Start workout
			</a>
		</div>
	</header>

	<div class="grid grid-cols-12 gap-4">
		<div class="col-span-8 rounded-2xl border border-[#273034] bg-[#111719] p-5 shadow-[0_8px_20px_rgba(0,0,0,0.22)]">
			<TodaysWorkoutCard todaysWorkoutData={data.todaysWorkoutData} />
		</div>

		<aside class="col-span-4 space-y-4">
			{#await data.entityCounts then entityCounts}
				<div class="rounded-2xl border border-[#273034] bg-[#111719] p-4">
					<GetStartedComponent entityCounts={entityCounts} />
				</div>
			{/await}
		</aside>
	</div>

	<div class="rounded-2xl border border-[#273034] bg-[#111719] p-4 shadow-[0_8px_20px_rgba(0,0,0,0.22)]">
		<DashboardMetricsCard chartData={data.dashboardChartData} />
	</div>
</section>
