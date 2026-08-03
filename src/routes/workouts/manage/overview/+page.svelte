<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Tabs from '$lib/components/ui/tabs';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import H3 from '$lib/components/ui/typography/H3.svelte';
	import { trpc } from '$lib/trpc/client';
	import type { RouterInputs } from '$lib/trpc/router';
	import type { WorkoutExerciseInProgress } from '$lib/utils/workoutUtils';
	import { TRPCClientError } from '@trpc/client';
	import { toast } from 'svelte-sonner';
	import LoaderCircle from 'virtual:icons/lucide/loader-circle';
	import ExerciseSplitExercisesCharts from '../../../exercise-splits/(components)/ExerciseSplitExercisesCharts.svelte';
	import { mesocycleExerciseSplitRunes } from '../../../mesocycles/[mesocycleId]/edit-split/mesocycleExerciseSplitRunes.svelte';
	import { workoutRunes } from '../workoutRunes.svelte';
	import WorkoutComparisonChart from './(components)/WorkoutComparisonChart.svelte';
	import Quotes from '$lib/components/settings/Quotes.svelte';

	let { data } = $props();

	const shouldShowQuote =
		data.userSettings.motivationalQuotesEnabled && data.userSettings.quotesDisplayModes.includes('POST_WORKOUT');

	let savingWorkout = $state(false);
	let workoutExercises = $derived(workoutRunes.workoutExercises ?? []);
	const adaptiveOutlierMessage = 'Confirm adaptive working sets outside the 5–30 rep range before saving';
	const adaptiveOutlierPrompt =
		'This will establish an adaptive target outside the recommended 5–30 rep range. Continue?';

	function preProcessSetData() {
		if (workoutRunes.workoutData === null || workoutRunes.workoutExercises === null) return;
		if (workoutRunes.ownerUserId === null) return;
		savingWorkout = true;
		const workoutExercisesSets = workoutRunes.workoutExercises.map((ex) => {
			return ex.sets.map((_set, idx) => {
				const { completed, ...set } = _set;
				if (set.skipped) [set.reps, set.load, set.RIR] = [0, 0, 0];
				return { ...set, setIndex: idx };
			});
		});
		const workoutExercisesMiniSets = workoutExercisesSets.map((sets) => sets.map((set) => set.miniSets));

		if (typeof workoutRunes.workoutData?.userBodyweight !== 'number') {
			toast.error('Invalid user bodyweight at start page');
			return;
		}
		const userBodyweight = workoutRunes.workoutData.userBodyweight;

		const createData: RouterInputs['workouts']['create'] = {
			draftOwnerUserId: workoutRunes.ownerUserId,
			workoutData: { ...workoutRunes.workoutData, userBodyweight, note: workoutRunes.workoutData.note ?? undefined },
			workoutExercises: workoutRunes.workoutExercises.map((ex, idx) => {
				const { sets, manualDeloadMetadata, workStarted, ...exercise } = ex;
				return { ...exercise, exerciseIndex: idx };
			}),
			manualDeloadMetadata: workoutRunes.workoutExercises.map((exercise) =>
				exercise.isDeload ? (exercise.manualDeloadMetadata ?? null) : null
			),
			workoutExercisesSets: workoutExercisesSets.map((sets) =>
				sets.map((set) => {
					const { miniSets, ...rest } = set;
					if (rest.reps === undefined || rest.load === undefined || rest.RIR === undefined) {
						throw new Error('Rep, Load, or RIR is undefined');
					}
					return {
						...rest,
						reps: rest.reps as number,
						load: rest.load as number,
						RIR: rest.RIR as number
					};
				})
			),
			workoutExercisesMiniSets: workoutExercisesMiniSets.map((sets, exerciseIndex) =>
				sets.map((miniSets, setIndex) =>
					miniSets.map((_miniSet, miniSetIndex) => {
						const exercises = workoutRunes.workoutExercises as WorkoutExerciseInProgress[];
						const { completed, ...miniSet } = _miniSet;
						if (exercises[exerciseIndex].sets[setIndex].skipped) [miniSet.reps, miniSet.load, miniSet.RIR] = [0, 0, 0];

						if (miniSet.reps === undefined || miniSet.load === undefined || miniSet.RIR === undefined) {
							throw new Error('Rep, Load, or RIR is undefined');
						}
						return {
							...miniSet,
							reps: miniSet.reps as number,
							load: miniSet.load as number,
							RIR: miniSet.RIR as number,
							miniSetIndex
						};
					})
				)
			)
		};
		return createData;
	}

	async function persistWorkout(createData: RouterInputs['workouts']['create']) {
		if (workoutRunes.editingWorkoutId === null) return trpc().workouts.create.mutate(createData);
		const result = await trpc().workouts.editById.mutate({
			id: workoutRunes.editingWorkoutId,
			endedAt: workoutRunes.workoutData?.endedAt as Date | string,
			data: createData
		});
		return { ...result, mesocycleCompleted: undefined };
	}

	async function saveWorkout() {
		let createData;
		try {
			createData = preProcessSetData();
		} catch (error) {
			if (error instanceof Error) {
				toast.error('Failed to preprocess set data', { description: error.message });
				navigator.clipboard.writeText(JSON.stringify(workoutRunes.workoutExercises));
				console.log(workoutRunes.workoutExercises);
			}
		}

		if (createData === undefined) return;
		const mesocycleMode = workoutRunes.workoutData?.workoutOfMesocycle?.mesocycle.repRangeMode ?? 'Fixed';
		const hasPendingAdaptiveOutlier = workoutRunes.workoutExercises?.some((exercise) => {
			if ((exercise.repRangeMode ?? mesocycleMode) !== 'Adaptive') return false;
			const isOutlier = (reps: number | undefined) => reps !== undefined && (reps < 5 || reps > 30);
			const firstStandardSet = exercise.sets.find(
				(set, setIndex) => !set.skipped && (exercise.setType !== 'TopBackoff' || setIndex > 0)
			);
			const standardNeedsConfirmation =
				exercise.repRangeStart === 5 && exercise.repRangeEnd === 30 && isOutlier(firstStandardSet?.reps);
			if (exercise.setType !== 'TopBackoff') return standardNeedsConfirmation;

			const firstTopSet = exercise.sets.find((set, setIndex) => !set.skipped && setIndex === 0);
			return (
				standardNeedsConfirmation ||
				(exercise.topRepRangeStart === 5 && exercise.topRepRangeEnd === 30 && isOutlier(firstTopSet?.reps))
			);
		});
		if (hasPendingAdaptiveOutlier && !window.confirm(adaptiveOutlierPrompt)) {
			savingWorkout = false;
			return;
		}
		createData.confirmAdaptiveRepRangeOutliers = Boolean(hasPendingAdaptiveOutlier);

		try {
			let result;
			try {
				result = await persistWorkout(createData);
			} catch (error) {
				if (
					!(error instanceof TRPCClientError) ||
					!error.message.includes(adaptiveOutlierMessage) ||
					createData.confirmAdaptiveRepRangeOutliers ||
					!window.confirm(adaptiveOutlierPrompt)
				) {
					throw error;
				}
				createData.confirmAdaptiveRepRangeOutliers = true;
				result = await persistWorkout(createData);
			}
			toast.success(result.message);
			await invalidate('workouts:all');
			await workoutRunes.resetStores();
			// Reset meso editing store as it won't change if workout affects meso split days and same mesocycle gets edited
			// 1. User attempts active meso edit but doesn't complete it (stores save meso data)
			// 2. User performs workouts affecting the meso split structure
			// 3. User tries to update meso again, but sees old data as it didn't sync the new changes from workouts
			// So to prevent this from happening, just reset the meso split runes after a workout is completed
			mesocycleExerciseSplitRunes.resetStores();

			if (result.mesocycleCompleted) {
				await goto(`/mesocycles/${workoutRunes.workoutData?.workoutOfMesocycle?.mesocycle.id}?completion`);
			} else {
				await goto('/workouts');
			}
		} catch (error) {
			if (error instanceof TRPCClientError) toast.error(error.message);
		}
		savingWorkout = false;
	}
</script>

<H3>Overview</H3>

{#if shouldShowQuote}
	<Quotes mode="POST_WORKOUT" class="mb-6" />
{/if}

<Tabs.Root class="w-full" value="progression">
	<Tabs.List class="grid grid-cols-2">
		<Tabs.Trigger value="progression">Progression</Tabs.Trigger>
		<Tabs.Trigger value="basic">Basic</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="progression">
		{#if workoutRunes.previousWorkoutData && workoutRunes.workoutExercises && workoutRunes.workoutData?.userBodyweight}
			<WorkoutComparisonChart
				previousWorkoutData={workoutRunes.previousWorkoutData}
				currentWorkoutData={{
					exercises: workoutRunes.workoutExercises,
					userBodyweight: workoutRunes.workoutData.userBodyweight
				}}
			/>
		{:else}
			<div class="muted-text-box">No previous workout available to compare</div>
		{/if}
	</Tabs.Content>
	<Tabs.Content class="rounded-md border bg-card p-4" value="basic">
		<ExerciseSplitExercisesCharts exercises={workoutExercises} />
	</Tabs.Content>
</Tabs.Root>

<div class="mt-4 flex w-full flex-col gap-1.5">
	<Label for="workout-note">Workout note</Label>
	<Textarea id="workout-note" placeholder="Type here (optional)" bind:value={workoutRunes.workoutData!.note}></Textarea>
</div>

<div class="mt-auto grid grid-cols-2 gap-1">
	<Button onclick={() => window.history.back()} variant="secondary">Previous</Button>
	<Button disabled={savingWorkout} onclick={saveWorkout}>
		{#if savingWorkout}
			<LoaderCircle class="animate-spin" />
		{:else}
			Save
		{/if}
	</Button>
</div>
