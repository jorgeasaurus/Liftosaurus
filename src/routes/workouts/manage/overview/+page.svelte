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
	import * as Dialog from '$lib/components/ui/dialog';
	import AlertTriangleIcon from 'virtual:icons/lucide/triangle-alert';
	import {
		ADAPTIVE_REP_RANGE_CONFIRMATION_REQUIRED,
		getPendingAdaptiveRepRangeConfirmation
	} from '$lib/utils/adaptiveRepRanges';

	let { data } = $props();

	const shouldShowQuote =
		data.userSettings.motivationalQuotesEnabled && data.userSettings.quotesDisplayModes.includes('POST_WORKOUT');

	let savingWorkout = $state(false);
	type AdaptiveApproval = {
		createData: RouterInputs['workouts']['create'];
		outliers: { name: string; targets: string[] }[];
	};
	let adaptiveApproval: AdaptiveApproval | null = $state(null);
	let workoutExercises = $derived(workoutRunes.workoutExercises ?? []);

	function getAdaptiveOutlierExercises() {
		const mesocycleMode = workoutRunes.workoutData?.workoutOfMesocycle?.mesocycle.repRangeMode ?? 'Fixed';
		return (workoutRunes.workoutExercises ?? []).flatMap((exercise) => {
			if ((exercise.repRangeMode ?? mesocycleMode) !== 'Adaptive') return [];
			const targets: string[] = [];
			const sets = exercise.sets.flatMap((set, setIndex) =>
				set.reps === undefined || set.RIR === undefined
					? []
					: [{ setIndex, reps: set.reps, RIR: set.RIR, skipped: set.skipped }]
			);
			const standard = getPendingAdaptiveRepRangeConfirmation({
				mode: 'Adaptive',
				established: exercise.repRangeStart !== 5 || exercise.repRangeEnd !== 30,
				setType: exercise.setType,
				sets
			});
			if (standard) targets.push(`${standard.reps} standard reps`);
			if (exercise.setType === 'TopBackoff') {
				const top = getPendingAdaptiveRepRangeConfirmation({
					mode: 'Adaptive',
					established: exercise.topRepRangeStart !== 5 || exercise.topRepRangeEnd !== 30,
					setType: exercise.setType,
					category: 'top',
					sets
				});
				if (top) targets.push(`${top.reps} top-set reps`);
			}
			return targets.length ? [{ name: exercise.name, targets }] : [];
		});
	}

	function preProcessSetData() {
		if (workoutRunes.workoutData === null || workoutRunes.workoutExercises === null) return;
		if (workoutRunes.ownerUserId === null) return;
		savingWorkout = true;
		const workoutExercisesSets = workoutRunes.workoutExercises.map((ex) => {
			return ex.sets.map((_set, idx) => {
				const { completed, plannedReps: _plannedReps, ...set } = _set;
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

	function requestAdaptiveApproval(
		createData: RouterInputs['workouts']['create'],
		outliers: { name: string; targets: string[] }[]
	) {
		adaptiveApproval = { createData, outliers };
		savingWorkout = false;
	}

	async function completeWorkoutSave(createData: RouterInputs['workouts']['create']) {
		try {
			let result;
			try {
				result = await persistWorkout(createData);
			} catch (error) {
				if (
					error instanceof TRPCClientError &&
					error.message === ADAPTIVE_REP_RANGE_CONFIRMATION_REQUIRED &&
					!createData.confirmAdaptiveRepRangeOutliers
				) {
					requestAdaptiveApproval(createData, getAdaptiveOutlierExercises());
					return;
				}
				throw error;
			}
			toast.success(result.message);
			await invalidate('workouts:all');
			const completedMesocycleId = result.mesocycleCompleted
				? workoutRunes.workoutData?.workoutOfMesocycle?.mesocycle.id
				: undefined;

			if (completedMesocycleId) await goto(`/mesocycles/${completedMesocycleId}?completion`);
			else await goto('/workouts');

			await workoutRunes.resetStores();
			// Prevent a stale, unfinished mesocycle split edit from surviving a workout that changed the split.
			mesocycleExerciseSplitRunes.resetStores();
		} catch (error) {
			if (error instanceof TRPCClientError) toast.error(error.message);
		} finally {
			savingWorkout = false;
		}
	}

	async function approveAdaptiveOutliers() {
		if (!adaptiveApproval) return;
		const { createData } = adaptiveApproval;
		createData.confirmAdaptiveRepRangeOutliers = true;
		adaptiveApproval = null;
		savingWorkout = true;
		await completeWorkoutSave(createData);
	}

	function cancelAdaptiveApproval() {
		adaptiveApproval = null;
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

		if (createData === undefined) {
			savingWorkout = false;
			return;
		}
		const outliers = getAdaptiveOutlierExercises();
		if (outliers.length) {
			requestAdaptiveApproval(createData, outliers);
			return;
		}
		createData.confirmAdaptiveRepRangeOutliers = false;
		await completeWorkoutSave(createData);
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
	{#if workoutRunes.workoutData}
		<Label for="workout-note">Workout note</Label>
		<Textarea id="workout-note" placeholder="Type here (optional)" bind:value={workoutRunes.workoutData.note}
		></Textarea>
	{/if}
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

<Dialog.Root
	open={adaptiveApproval !== null}
	onOpenChange={(open) => {
		if (!open) adaptiveApproval = null;
	}}
>
	<Dialog.Content class="surface-panel sm:max-w-md">
		<Dialog.Header>
			<div class="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
				<AlertTriangleIcon class="h-5 w-5" />
			</div>
			<Dialog.Title>Use an adaptive target outside 5–30 reps?</Dialog.Title>
			<Dialog.Description>
				Saving will establish this result as a future progression target. Confirm that the completed reps are
				intentional.
			</Dialog.Description>
		</Dialog.Header>
		{#if adaptiveApproval?.outliers.length}
			<div class="rounded-xl border bg-muted/35">
				{#each adaptiveApproval.outliers as exercise}
					<div class="divided-row flex items-center justify-between gap-3 px-3 py-2.5 first:border-t-0">
						<span class="min-w-0 truncate text-sm font-semibold">{exercise.name}</span>
						<span class="shrink-0 text-xs tabular-nums text-muted-foreground">{exercise.targets.join(', ')}</span>
					</div>
				{/each}
			</div>
		{/if}
		<Dialog.Footer class="gap-2 sm:gap-2">
			<Button variant="secondary" onclick={cancelAdaptiveApproval}>Back</Button>
			<Button onclick={approveAdaptiveOutliers}>Save and use target</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
