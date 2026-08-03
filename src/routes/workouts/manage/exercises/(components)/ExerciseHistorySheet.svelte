<script lang="ts">
	import DefaultInfiniteLoader from '$lib/components/DefaultInfiniteLoader.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Sheet from '$lib/components/ui/sheet';
	import * as Accordion from '$lib/components/ui/accordion';
	import { trpc } from '$lib/trpc/client';
	import type { RouterOutputs } from '$lib/trpc/router';
	import {
		createExerciseChartHistoryResource,
		type ExerciseChartHistoryResourceState
	} from '$lib/utils/exerciseChartHistory';
	import CopyIcon from 'virtual:icons/lucide/clipboard-copy';
	import WorkoutExerciseCard from '../../../[workoutId]/(components)/WorkoutExerciseCard.svelte';
	import { workoutRunes } from '../../workoutRunes.svelte';
	import type { InfiniteEvent } from 'svelte-infinite-loading';
	import ExerciseStatsChart from '../../../../exercise-stats/ExerciseStatsChart.svelte';

	type ChartWorkoutExercise = RouterOutputs['workouts']['getExerciseChartHistory']['items'][number];

	let exercisesFound: RouterOutputs['workouts']['getExerciseHistory'] = $state([]);
	let chartHistoryState = $state<ExerciseChartHistoryResourceState<ChartWorkoutExercise>>({ status: 'idle' });
	let historyLoaderIdentifier = $state(0);
	let historyLoaderGeneration = 0;
	let chartAccordionValue = $state<string>();
	const chartHistoryResource = createExerciseChartHistoryResource<ChartWorkoutExercise>({
		query: (input) => trpc().workouts.getExerciseChartHistory.query(input),
		onStateChange: (nextState) => (chartHistoryState = nextState)
	});

	$effect(() => {
		const exerciseName = workoutRunes.exerciseHistorySheetName;
		const sheetOpen = workoutRunes.exerciseHistorySheetOpen;
		historyLoaderIdentifier = ++historyLoaderGeneration;
		exercisesFound = [];
		chartHistoryResource.reset();
		chartAccordionValue = undefined;
		if (!sheetOpen || exerciseName === undefined) return;
	});

	$effect(() => {
		const exerciseName = workoutRunes.exerciseHistorySheetName;
		if (chartAccordionValue !== 'chart' || !workoutRunes.exerciseHistorySheetOpen || exerciseName === undefined) {
			chartHistoryResource.cancelLoading();
			return;
		}
		if (chartHistoryState.status === 'idle') void chartHistoryResource.load(exerciseName);
	});

	async function loadMore(infiniteEvent: InfiniteEvent) {
		const exerciseName = workoutRunes.exerciseHistorySheetName;
		const requestId = historyLoaderIdentifier;
		const lastExerciseFound = exercisesFound.at(-1);
		if (exerciseName === undefined) return;

		const newExercisesFound = await trpc().workouts.getExerciseHistory.query({
			cursorId: lastExerciseFound?.id,
			exerciseName
		});
		if (requestId !== historyLoaderIdentifier || exerciseName !== workoutRunes.exerciseHistorySheetName) return;
		if (newExercisesFound.length === 0) {
			infiniteEvent.detail.complete();
			return;
		}

		infiniteEvent.detail.loaded();
		exercisesFound.push(...newExercisesFound);
		if (newExercisesFound.length < 10) infiniteEvent.detail.complete();
	}
</script>

<Sheet.Root bind:open={workoutRunes.exerciseHistorySheetOpen}>
	<Sheet.Content class="flex w-11/12 flex-col px-2">
		<Sheet.Header>
			<Sheet.Title>History</Sheet.Title>
			<Sheet.Description>
				{workoutRunes.exerciseHistorySheetName}
			</Sheet.Description>
		</Sheet.Header>
		<Accordion.Root bind:value={chartAccordionValue}>
			<Accordion.Item value="chart">
				<Accordion.Trigger>Show progression chart</Accordion.Trigger>
				<Accordion.Content>
					{#if chartHistoryState.status === 'error'}
						<div role="alert" class="muted-text-box flex items-center justify-between gap-2">
							<span>Could not load chart history.</span>
							<Button size="sm" onclick={() => chartHistoryResource.retry(workoutRunes.exerciseHistorySheetName!)}>
								Retry chart
							</Button>
						</div>
					{:else}
						<ExerciseStatsChart
							exercises={chartHistoryState.status === 'loaded' ? chartHistoryState.data : undefined}
							selectedExercise={workoutRunes.exerciseHistorySheetName!}
							historyTruncated={chartHistoryState.status === 'loaded' && chartHistoryState.truncated}
						/>
					{/if}
				</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
		<div class="flex h-px grow flex-col overflow-y-auto">
			{#each exercisesFound as exercise}
				{@const wm = exercise.workout.workoutOfMesocycle}
				<div class="mb-1 mt-4 flex items-start gap-1">
					<Button
						onclick={() => workoutRunes.copyExerciseSetNumbersFromHistory(exercise)}
						size="icon"
						variant="secondary"
					>
						<CopyIcon />
					</Button>
					<div class="mr-auto flex flex-col">
						<span class="font-bold">{wm?.mesocycle.mesocycleExerciseSplitDays[wm.splitDayIndex].name}</span>
						<span class="text-xs font-semibold">{wm?.mesocycle.name}</span>
					</div>
					<span class="font-semibold text-muted-foreground">
						{exercise.workout.startedAt.toLocaleDateString(undefined, {
							day: 'numeric',
							month: 'short'
						})}
					</span>
				</div>
				<WorkoutExerciseCard {exercise} date={new Date(exercise.workout.startedAt)} />
			{/each}
			<DefaultInfiniteLoader {loadMore} identifier={historyLoaderIdentifier} entityPlural="exercises" />
		</div>
	</Sheet.Content>
</Sheet.Root>
