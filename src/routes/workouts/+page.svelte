<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import DefaultInfiniteLoader from '$lib/components/DefaultInfiniteLoader.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { trpc } from '$lib/trpc/client';
	import type { RouterInputs, RouterOutputs } from '$lib/trpc/router.js';
	import type { WorkoutStatus } from '@prisma/client';
	import type { DateRange } from 'bits-ui';
	import { type InfiniteLoadingEvents } from 'svelte-infinite-loading';
	import AddIcon from 'virtual:icons/lucide/plus';
	import StickyNoteIcon from 'virtual:icons/lucide/sticky-note';
	import FilterComponent from './(components)/FilterComponent.svelte';
	import NoWorkoutsFilterComponent from './(components)/NoWorkoutsFilterComponent.svelte';
	import { workoutRunes } from './manage/workoutRunes.svelte.js';
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';

	let { data } = $props();
	let workouts: RouterOutputs['workouts']['load'] = $state([]);
	let currentFilters = $derived(getCurrentFilters());

	function getCurrentFilters() {
		const currentFilters: Exclude<RouterInputs['workouts']['load']['filters'], undefined> = {};
		const startDate = $page.url.searchParams.get('startDate');
		const endDate = $page.url.searchParams.get('endDate');
		const selectedMesocycles = $page.url.searchParams.get('selectedMesocycles');
		const selectedWorkoutStatuses = $page.url.searchParams.get('selectedWorkoutStatuses');

		if (startDate) {
			currentFilters.startDate = new Date(startDate);
		}
		if (endDate) {
			currentFilters.endDate = new Date(endDate);
		}
		if (selectedMesocycles) {
			currentFilters.selectedMesocycles = JSON.parse(selectedMesocycles);
		}
		if (selectedWorkoutStatuses) {
			currentFilters.selectedWorkoutStatuses = JSON.parse(selectedWorkoutStatuses);
		}

		return currentFilters;
	}

	async function loadMore(infiniteEvent: InfiniteLoadingEvents['infinite']) {
		const lastWorkout = workouts.at(-1);

		const newWorkouts = await trpc().workouts.load.query({
			cursorId: lastWorkout?.id,
			filters: getCurrentFilters()
		});

		if (newWorkouts.length === 0) {
			infiniteEvent.detail.complete();
			return;
		}

		infiniteEvent.detail.loaded();
		workouts.push(...newWorkouts);
		if (newWorkouts.length !== 10) infiniteEvent.detail.complete();
	}

	async function createNewWorkout() {
		if (await workoutRunes.beginNewWorkout()) await goto('/workouts/manage/start');
	}

	function setFilters(
		selectedDateRange: DateRange,
		selectedMesocycles: (string | null)[],
		selectedWorkoutStatus: (WorkoutStatus | null)[]
	) {
		const newURL = new URL($page.url);

		if (selectedDateRange.start) {
			newURL.searchParams.set('startDate', selectedDateRange.start.toString());
		} else {
			newURL.searchParams.delete('startDate');
		}

		if (selectedDateRange.end) {
			newURL.searchParams.set('endDate', selectedDateRange.end.toString());
		} else {
			newURL.searchParams.delete('endDate');
		}

		if (selectedMesocycles.length) {
			newURL.searchParams.set('selectedMesocycles', JSON.stringify(selectedMesocycles));
		} else {
			newURL.searchParams.delete('selectedMesocycles');
		}

		if (selectedWorkoutStatus.length) {
			newURL.searchParams.set('selectedWorkoutStatuses', JSON.stringify(selectedWorkoutStatus));
		} else {
			newURL.searchParams.delete('selectedWorkoutStatuses');
		}

		if (newURL.toString() === $page.url.toString()) return;
		workouts = [];
		goto(newURL);
	}
</script>

<section class="mx-auto flex h-full w-full max-w-[1240px] flex-col gap-4">
	<header class="flex items-center justify-between">
		<div>
			<h1 class="text-4xl font-semibold tracking-[-0.03em] text-[#e9edf3]">Workouts</h1>
			<p class="mt-1 text-sm text-[#95a4b6]">Review completed sessions and start your next training block.</p>
		</div>
	</header>

	<div class="flex grow flex-col gap-3 rounded-2xl border border-[#252c34] bg-[#11161d] p-4">
		<div class="flex gap-2">
		{#await data.filterData}
			<Skeleton class="h-11 w-full rounded-lg border border-[#2a323b] bg-[#151b22]" />
		{:then filterData}
			{#if filterData}
				<FilterComponent {filterData} {currentFilters} {setFilters} />
			{:else}
				<NoWorkoutsFilterComponent />
			{/if}
		{/await}
		<Button
			aria-label="create-workout"
			class="h-11 shrink-0 border border-[#8cae2f66] bg-[#c7f73a] px-4 text-[#17200d] hover:bg-[#d2f95a]"
			onclick={createNewWorkout}
		>
			<AddIcon class="h-4 w-4" />
		</Button>
		</div>

		<div class="flex h-px grow flex-col gap-2 overflow-y-auto pr-1">
		{#each workouts as workout}
			{@const { workoutOfMesocycle } = workout}
			<Button
				class="flex h-14 items-center gap-3 rounded-xl border border-[#2a323c] bg-[#141a22] px-3 text-[#dbe3ec] hover:border-[#333d48] hover:bg-[#171e27]"
				href="/workouts/{workout.id}"
				variant="outline"
			>
				<span class="mr-auto text-base font-semibold tracking-tight text-[#e8edf4]">
					{workout.startedAt.toLocaleDateString(undefined, {
						day: '2-digit',
						month: 'long'
					})}
				</span>
				{#if workout.note}
					<StickyNoteIcon class="text-[#8f9daf]" />
				{/if}
				{#if workoutOfMesocycle}
					{@const splitDayName =
						workoutOfMesocycle.mesocycle.mesocycleExerciseSplitDays[workoutOfMesocycle.splitDayIndex].name}
					<span class="truncate text-right text-sm text-[#9eacbd]">
						{splitDayName === '' ? 'Rest' : splitDayName}
						{workoutOfMesocycle.workoutStatus === 'Skipped' ? '(skipped)' : ''}
					</span>
				{/if}
			</Button>
		{/each}
		<DefaultInfiniteLoader {loadMore} identifier={currentFilters} entityPlural="workouts" />
		</div>
	</div>
</section>
