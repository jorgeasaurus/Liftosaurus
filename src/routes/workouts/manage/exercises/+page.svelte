<script lang="ts">
	import { goto, onNavigate } from '$app/navigation';
	import InfoPopover from '$lib/components/InfoPopover.svelte';
	import AddEditExerciseDrawer from '$lib/components/mesocycleAndExerciseSplit/AddEditExerciseDrawer.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Progress from '$lib/components/ui/progress/progress.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import { deriveWorkoutProgress } from '$lib/utils/workoutUtils.js';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import ReorderIcon from 'virtual:icons/lucide/git-compare-arrows';
	import LoaderCircle from 'virtual:icons/lucide/loader-circle';
	import EditIcon from 'virtual:icons/lucide/pencil';
	import CompareIcon from 'virtual:icons/lucide/scale';
	import { workoutRunes } from '../workoutRunes.svelte.js';
	import DndComponent from './(components)/DndComponent.svelte';
	import ExerciseHistorySheet from './(components)/ExerciseHistorySheet.svelte';
	import SetTimerComponent from './(components)/SetTimerComponent.svelte';
	import WarmUpDialog from './(components)/WarmUpDialog.svelte';
	import QuotesDialog from './(components)/QuotesDialog.svelte';

	let { data } = $props();
	let reordering = $state(false);
	let comparing = $state(false);

	const shouldShowQuote =
		data.userSettings.motivationalQuotesEnabled && data.userSettings.quotesDisplayModes.includes('BETWEEN_SETS');

	let workoutData = $derived(workoutRunes.workoutData);
	let workoutExercises = $derived(workoutRunes.workoutExercises);
	let repTargets = $derived(
		workoutExercises?.map((exercise) => ({
			name: exercise.name,
			repRangeStart: exercise.repRangeStart,
			repRangeEnd: exercise.repRangeEnd
		})) ?? []
	);

	let progress = $derived(workoutExercises ? deriveWorkoutProgress(workoutExercises) : null);
	let totalSets = $derived(progress?.total ?? null);
	let completedSets = $derived(progress?.completed ?? null);
	let allSetsComplete = $derived(progress?.allComplete ?? false);
	let nextSet = $derived(progress?.next ?? null);

	onNavigate(() => workoutRunes.saveStoresToLocalStorage());

	onMount(async () => {
		if (workoutRunes.workoutData === null) {
			await goto('./start');
			return;
		}
		const serverData = await data.serverData;
		let changed = false;
		if (workoutRunes.workoutExercises === null) {
			workoutRunes.workoutExercises = serverData?.todaysWorkoutExercises ?? [];
			changed = true;
		}
		if (workoutRunes.previousWorkoutData === null) {
			workoutRunes.previousWorkoutData = serverData?.previousWorkoutData ?? null;
			changed = true;
		}
		if (changed) await workoutRunes.saveStoresToLocalStorage();
	});

	function getFormattedDate(date: string | Date) {
		if (typeof date === 'string') date = new Date(date);
		return date.toLocaleString(undefined, {
			month: 'short',
			day: 'numeric'
		});
	}

	function submitWorkoutExercises() {
		if (totalSets === null || completedSets === null) return;
		if (workoutExercises === null) return;
		if (workoutExercises.length === 0) {
			toast.error('Add at least one exercise');
			return;
		}
		if (completedSets < totalSets) {
			toast.error('Complete all sets to proceed');
			return;
		}
		goto('./overview');
	}
</script>

<svelte:window
	onpagehide={() => void workoutRunes.saveStoresToLocalStorage()}
	onvisibilitychange={() => {
		if (document.visibilityState === 'hidden') void workoutRunes.saveStoresToLocalStorage();
	}}
/>

<section class="mx-auto flex h-full w-full max-w-[1240px] flex-col gap-2 overflow-hidden">
	{#if workoutData !== null}
		<div class="flex items-start gap-2">
			<div class="mr-auto flex min-w-0 flex-col">
				{#if workoutData.workoutOfMesocycle !== undefined}
					<span class="truncate text-base font-semibold tracking-tight text-[#e9eef5]">
						{workoutData.workoutOfMesocycle.splitDayName}
					</span>
					<span class="flex items-center gap-1.5 text-xs text-[#9dadbe]">
						Day {workoutData.workoutOfMesocycle?.splitDayIndex + 1} · Cycle {workoutData.workoutOfMesocycle
							?.cycleNumber}
						<InfoPopover align="center" ariaLabel="mesocycle-info">
							<span class="text-sm text-[#dbe3ec]">
								<p class="font-semibold">{workoutData.workoutOfMesocycle.mesocycle.name}</p>
								{getFormattedDate(workoutData.startedAt)}
							</span>
						</InfoPopover>
					</span>
				{:else}
					<span class="text-base font-semibold tracking-tight text-[#e9eef5]">
						{getFormattedDate(workoutData.startedAt)}
					</span>
					<p class="text-xs text-[#9dadbe]">
						{workoutRunes.editingWorkoutId === null ? 'Without mesocycle' : 'Edit mode'}
					</p>
				{/if}
			</div>
			<div class="flex shrink-0 items-center gap-1">
				<Button
					aria-label="Reorder exercises"
					title="Reorder exercises"
					disabled={comparing}
					onclick={() => (reordering = !reordering)}
					class="h-11 w-11 border-[#303844] bg-[#171e27] text-[#dfe6ef] hover:bg-[#1b2430]"
					size="icon"
					variant="outline"
				>
					{#if !reordering}
						<ReorderIcon class="h-4 w-4" />
					{:else}
						<EditIcon class="h-4 w-4" />
					{/if}
				</Button>
				<Button
					aria-label="Compare to previous workout"
					title="Compare to previous workout"
					disabled={reordering || workoutRunes.editingWorkoutId !== null}
					onclick={() => (comparing = !comparing)}
					class="h-11 w-11 border-[#303844] bg-[#171e27] text-[#dfe6ef] hover:bg-[#1b2430]"
					size="icon"
					variant="outline"
				>
					{#if !comparing}
						<CompareIcon class="h-4 w-4" />
					{:else}
						<EditIcon class="h-4 w-4" />
					{/if}
				</Button>
				<SetTimerComponent />
				<AddEditExerciseDrawer
					addExercise={workoutRunes.addExercise}
					context="workout"
					editExercise={workoutRunes.editExercise}
					editingExercise={workoutRunes.editingExercise}
					mesocycle={workoutData.workoutOfMesocycle?.mesocycle}
					setEditingExercise={workoutRunes.setEditingExercise}
				/>
			</div>
		</div>
		{#if repTargets.length > 0}
			<div class="flex items-center gap-1.5 text-xs text-[#9dadbe]">
				<span>Rep targets</span>
				<InfoPopover align="start" ariaLabel="Show rep targets">
					<p class="mb-2 font-semibold text-[#e9eef5]">Aim for these rep ranges</p>
					<ul class="space-y-1">
						{#each repTargets as repTarget}
							<li>
								<span class="font-medium text-[#dbe3ec]">{repTarget.name}:</span>
								{repTarget.repRangeStart}–{repTarget.repRangeEnd} reps
							</li>
						{/each}
					</ul>
				</InfoPopover>
			</div>
		{/if}
		{#if totalSets !== null && completedSets !== null}
			<div class="flex items-center gap-2">
				<Progress class="h-1.5 flex-1 bg-[#232b35] [&>div]:bg-[#c7f73a]" max={totalSets} value={completedSets} />
				<span class="shrink-0 text-[11px] font-medium tabular-nums text-[#9dadbe]">
					{completedSets}/{totalSets}
				</span>
			</div>
			{#if !allSetsComplete && totalSets > 0}
				<div
					aria-live="polite"
					class="flex items-center justify-between gap-3 rounded-lg border border-[#384425] bg-[#182014] px-2.5 py-2"
					data-testid="next-set-guidance"
				>
					<span class="min-w-0 truncate text-xs font-semibold text-[#dff58e]">Up next · {nextSet?.exerciseName}</span>
					<span class="shrink-0 text-[11px] tabular-nums text-[#a8ba7a]">
						{nextSet?.kind === 'miniSet' ? `Mini ${nextSet.miniSetIndex + 1}` : `Set ${(nextSet?.setIndex ?? 0) + 1}`}
					</span>
				</div>
			{/if}
		{:else}
			<Skeleton class="h-1.5 w-full bg-[#252f3a]" />
		{/if}
	{/if}

	{#if workoutRunes.workoutExercises === null}
		<div
			class="flex h-full w-full items-center justify-center rounded-xl border border-[#252c34] bg-[#11161d] text-sm text-[#9dadbe]"
		>
			Fetching exercises
			<LoaderCircle class="ml-2 h-4 w-4 animate-spin" />
		</div>
	{:else}
		<div class="flex min-h-0 grow flex-col gap-2 overflow-y-auto pb-1">
			<DndComponent
				activeTarget={nextSet}
				{comparing}
				{reordering}
				onFinalize={workoutRunes.saveStoresToLocalStorage}
				bind:itemList={workoutRunes.workoutExercises}
			/>
		</div>
	{/if}

	{#if allSetsComplete}
		<Button
			class="h-11 shrink-0 border border-[#8cae2f66] bg-[#c7f73a] text-[#17200d] hover:bg-[#d2f95a]"
			onclick={submitWorkoutExercises}
		>
			Finish workout
		</Button>
	{/if}

	<ExerciseHistorySheet />
	<WarmUpDialog />

	{#if shouldShowQuote && completedSets}
		<QuotesDialog {completedSets} />
	{/if}
</section>
