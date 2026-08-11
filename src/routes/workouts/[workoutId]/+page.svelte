<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import H2 from '$lib/components/ui/typography/H2.svelte';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import WorkoutBasicTab from './(components)/WorkoutBasicTab.svelte';
	import WorkoutExercisesTab from './(components)/WorkoutExercisesTab.svelte';
	import type { FullWorkoutWithMesoData } from './+page.server';
	import WorkoutSkeleton from './(components)/WorkoutSkeleton.svelte';
	import WorkoutExerciseCharts from './(components)/WorkoutExerciseCharts.svelte';

	let { data } = $props();
	let workout: FullWorkoutWithMesoData | null | 'loading' = $state('loading');
	let selectedTabValue = $state('basics');
	let chartMode = $state(false);

	function isLoadedWorkout(value: typeof workout): value is FullWorkoutWithMesoData {
		return value !== 'loading' && value !== null;
	}

	let showChartIcon = $derived(
		selectedTabValue === 'exercises' && isLoadedWorkout(workout) && workout.workoutExercises.length > 0
	);

	onMount(async () => {
		workout = await data.workout;
		if (workout === null) toast.error('Workout not found');
	});
</script>

<H2 {showChartIcon} bind:chartMode>View workout</H2>

{#if workout === 'loading'}
	<WorkoutSkeleton />
{:else if workout === null}
	<div class="muted-text-box">Workout not found</div>
{:else}
	<Tabs.Root class="flex w-full grow flex-col" bind:value={selectedTabValue}>
		<Tabs.List class="grid grid-cols-2">
			<Tabs.Trigger value="basics">Basics</Tabs.Trigger>
			<Tabs.Trigger value="exercises">Exercises</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="basics">
			<WorkoutBasicTab {workout} />
		</Tabs.Content>
		<Tabs.Content class="grow" value="exercises">
			{#if !chartMode}
				<div class="flex h-full flex-col">
					<WorkoutExercisesTab {workout} />
				</div>
			{:else}
				<WorkoutExerciseCharts {workout} />
			{/if}
		</Tabs.Content>
	</Tabs.Root>
{/if}
