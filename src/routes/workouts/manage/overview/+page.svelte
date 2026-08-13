<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Tabs from '$lib/components/ui/tabs';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import H3 from '$lib/components/ui/typography/H3.svelte';
	import { trpc } from '$lib/trpc/client';
	import type { RouterInputs } from '$lib/trpc/router';
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
	import { buildWorkoutCreateInput, getAdaptiveOutliers, needsAdaptiveApproval } from '../workoutCompletion';

	let { data } = $props();

	const shouldShowQuote =
		data.userSettings.motivationalQuotesEnabled && data.userSettings.quotesDisplayModes.includes('POST_WORKOUT');

	let savingWorkout = $state(false);
	type AdaptiveApproval = {
		createData: RouterInputs['workouts']['create'];
		outliers: { name: string; targets: string[] }[];
		token: ReturnType<typeof workoutRunes.captureCompletionToken>;
	};
	let adaptiveApproval: AdaptiveApproval | null = $state(null);
	let workoutExercises = $derived(workoutRunes.workoutExercises ?? []);

	function preProcessSetData() {
		if (workoutRunes.workoutData === null || workoutRunes.workoutExercises === null) return;
		if (workoutRunes.ownerUserId === null) return;
		if (typeof workoutRunes.workoutData?.userBodyweight !== 'number') {
			toast.error('Invalid user bodyweight at start page');
			return;
		}
		savingWorkout = true;
		return buildWorkoutCreateInput({
			ownerUserId: workoutRunes.ownerUserId,
			workoutData: workoutRunes.workoutData,
			workoutExercises: workoutRunes.workoutExercises
		});
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
		adaptiveApproval = { createData, outliers, token: workoutRunes.captureCompletionToken() };
		savingWorkout = false;
	}

	async function completeWorkoutSave(
		createData: RouterInputs['workouts']['create'],
		outliers: AdaptiveApproval['outliers'],
		reviewedToken = workoutRunes.captureCompletionToken()
	) {
		try {
			const editing = workoutRunes.editingWorkoutId !== null;
			let completionToken: ReturnType<typeof workoutRunes.captureCompletionToken> = null;
			if (!editing) {
				await workoutRunes.saveStoresToLocalStorage();
				if (reviewedToken?.serializedDraft !== workoutRunes.captureCompletionToken()?.serializedDraft) {
					toast.info('Workout changed. Review the updated results before saving.');
					return;
				}
				const refreshedData = preProcessSetData();
				if (!refreshedData) return;
				refreshedData.confirmAdaptiveRepRangeOutliers = createData.confirmAdaptiveRepRangeOutliers;
				createData = refreshedData;
				if (workoutRunes.workoutData && workoutRunes.workoutExercises) {
					outliers = getAdaptiveOutliers(workoutRunes.workoutData, workoutRunes.workoutExercises);
				}
				completionToken = workoutRunes.captureCompletionToken();
				if (!completionToken) return;
			}
			let result;
			try {
				result = await persistWorkout(createData);
			} catch (error) {
				if (needsAdaptiveApproval(error, createData)) {
					requestAdaptiveApproval(createData, outliers);
					return;
				}
				throw error;
			}
			toast.success(result.message);
			await invalidate('workouts:all');
			const completedMesocycleId = result.mesocycleCompleted
				? workoutRunes.workoutData?.workoutOfMesocycle?.mesocycle.id
				: undefined;
			if (completionToken) await workoutRunes.finalizeCompletion(completionToken);
			else await workoutRunes.resetStores();
			if (completedMesocycleId) await goto(`/mesocycles/${completedMesocycleId}?completion`);
			else await goto('/workouts');
			// Prevent a stale, unfinished mesocycle split edit from surviving a workout that changed the split.
			mesocycleExerciseSplitRunes.resetStores();
		} catch (error) {
			if (
				error instanceof TRPCClientError &&
				error.data?.code === 'CONFLICT' &&
				workoutRunes.editingWorkoutId === null
			) {
				await workoutRunes.convertCurrentWorkoutToFree();
				toast.info('Your plan advanced elsewhere. This work was kept as a free workout; review and save again.');
				await goto('/workouts/manage/exercises?keepCurrent');
				return;
			}
			if (error instanceof TRPCClientError) toast.error(error.message);
		} finally {
			savingWorkout = false;
		}
	}

	async function approveAdaptiveOutliers() {
		if (!adaptiveApproval) return;
		const { createData, outliers, token } = adaptiveApproval;
		if (token && token.serializedDraft !== workoutRunes.captureCompletionToken()?.serializedDraft) {
			adaptiveApproval = null;
			toast.info('Workout changed. Review the updated results before saving.');
			return;
		}
		createData.confirmAdaptiveRepRangeOutliers = true;
		adaptiveApproval = null;
		savingWorkout = true;
		await completeWorkoutSave(createData, outliers, token);
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
		const outliers =
			workoutRunes.workoutData && workoutRunes.workoutExercises
				? getAdaptiveOutliers(workoutRunes.workoutData, workoutRunes.workoutExercises)
				: [];
		if (outliers.length) {
			requestAdaptiveApproval(createData, outliers);
			return;
		}
		createData.confirmAdaptiveRepRangeOutliers = false;
		await completeWorkoutSave(createData, outliers);
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
