<script lang="ts">
	import { goto } from '$app/navigation';
	import InfoPopover from '$lib/components/InfoPopover.svelte';
	import AddEditExerciseDrawer from '$lib/components/mesocycleAndExerciseSplit/AddEditExerciseDrawer.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Progress from '$lib/components/ui/progress/progress.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import { arraySum } from '$lib/utils.js';
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

	let totalSets = $derived(
		workoutExercises
			? arraySum(
					workoutExercises.map((e) => arraySum(e.sets.filter((s) => !s.skipped).map((s) => s.miniSets.length + 1)))
				)
			: null
	);
	let completedSets = $derived(
		workoutExercises
			? arraySum(
					workoutExercises.map((e) =>
						arraySum(
							e.sets
								.filter((s) => !s.skipped)
								.map((s) => s.miniSets.filter((ms) => ms.completed).length + (s.completed ? 1 : 0))
						)
					)
				)
			: null
	);

	// totalSets === 0 (all skipped / no sets) is treated as complete so Next is available
	let allSetsComplete = $derived(
		totalSets !== null && completedSets !== null && completedSets >= totalSets
	);

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

<section class="mx-auto flex h-full w-full max-w-[1240px] flex-col gap-2">
	{#if workoutData !== null}
		<div class="flex items-start gap-2">
			<div class="mr-auto min-w-0 flex flex-col">
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
					class="h-8 w-8 border-[#303844] bg-[#171e27] text-[#dfe6ef] hover:bg-[#1b2430]"
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
					class="h-8 w-8 border-[#303844] bg-[#171e27] text-[#dfe6ef] hover:bg-[#1b2430]"
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
				<InfoPopover align="start" ariaLabel="rep-targets-info">
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
				<p class="text-[11px] leading-tight text-[#8fa0b3]">
					{totalSets - completedSets} set{totalSets - completedSets === 1 ? '' : 's'} left · finish to continue
				</p>
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
				{comparing}
				{reordering}
				onFinalize={workoutRunes.saveStoresToLocalStorage}
				bind:itemList={workoutRunes.workoutExercises}
			/>
		</div>
	{/if}

	<div class="grid shrink-0 grid-cols-2 gap-2 pt-1">
		<Button
			class="h-11 border border-[#303844] bg-[#171e27] text-[#dfe6ef] hover:bg-[#1b2430]"
			href="./start"
			variant="secondary"
		>
			Previous
		</Button>
		<Button
			class="h-11 border border-[#8cae2f66] bg-[#c7f73a] text-[#17200d] hover:bg-[#d2f95a] disabled:opacity-40"
			disabled={!allSetsComplete}
			onclick={submitWorkoutExercises}
			title={allSetsComplete ? 'Continue to overview' : 'Complete all sets to proceed'}
		>
			Next
		</Button>
	</div>

	<ExerciseHistorySheet />
	<WarmUpDialog />

	{#if shouldShowQuote && completedSets}
		<QuotesDialog {completedSets} />
	{/if}
</section>
