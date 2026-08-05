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
			month: 'long',
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

<section class="mx-auto flex h-full w-full max-w-[1240px] flex-col gap-4">
	<header>
		<h1 class="text-4xl font-semibold tracking-[-0.03em] text-[#e9edf3]">Log exercises</h1>
		<p class="mt-1 text-sm text-[#95a4b6]">Capture every set precisely before reviewing your session summary.</p>
	</header>

	{#if workoutData !== null}
	<div class="rounded-2xl border border-[#252c34] bg-[#11161d] p-4">
		<div class="flex items-end">
			<div class="mr-auto flex flex-col">
			{#if workoutData.workoutOfMesocycle !== undefined}
				<span class="text-lg font-semibold text-[#e9eef5]">
					{workoutData.workoutOfMesocycle.splitDayName}
				</span>
				<span class="flex items-center gap-2 text-sm text-[#9dadbe]">
					Day {workoutData.workoutOfMesocycle?.splitDayIndex + 1}, Cycle {workoutData.workoutOfMesocycle?.cycleNumber}
					<InfoPopover align="center" ariaLabel="mesocycle-info">
						<span class="text-sm text-[#dbe3ec]">
							<p class="font-semibold">{workoutData.workoutOfMesocycle.mesocycle.name}</p>
							{getFormattedDate(workoutData.startedAt)}
						</span>
					</InfoPopover>
				</span>
			{:else}
				<span class="text-lg font-semibold text-[#e9eef5]">
					{getFormattedDate(workoutData.startedAt)}
				</span>
				<p class="text-sm text-[#9dadbe]">
					{workoutRunes.editingWorkoutId === null ? 'Without mesocycle' : 'Edit mode'}
				</p>
			{/if}
			</div>
			<div class="grid grid-cols-4 gap-1.5">
			<Button
				aria-label="reorder-toggle"
				disabled={comparing}
				onclick={() => (reordering = !reordering)}
				class="border-[#303844] bg-[#171e27] text-[#dfe6ef] hover:bg-[#1b2430]"
				size="icon"
				variant="outline"
			>
				{#if !reordering}
					<ReorderIcon />
				{:else}
					<EditIcon />
				{/if}
			</Button>
			<Button
				aria-label="compare-exercises"
				disabled={reordering || workoutRunes.editingWorkoutId !== null}
				onclick={() => (comparing = !comparing)}
				class="border-[#303844] bg-[#171e27] text-[#dfe6ef] hover:bg-[#1b2430]"
				size="icon"
				variant="outline"
			>
				{#if !comparing}
					<CompareIcon />
				{:else}
					<EditIcon />
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
			{#if totalSets !== null && completedSets !== null}
				<Progress class="col-span-full h-1.5 bg-[#232b35] [&>div]:bg-[#c7f73a]" max={totalSets} value={completedSets} />
			{:else}
				<Skeleton class="col-span-3 h-1.5 w-full bg-[#252f3a]" />
			{/if}
			</div>
		</div>
	</div>
	{/if}

{#if workoutRunes.workoutExercises === null}
	<div class="flex h-full w-full items-center justify-center rounded-2xl border border-[#252c34] bg-[#11161d] text-[#9dadbe]">
		Fetching exercises
		<LoaderCircle class="ml-2 animate-spin" />
	</div>
{:else}
	<div class="mt-1 flex h-px grow flex-col overflow-y-auto rounded-2xl border border-[#252c34] bg-[#11161d] p-2">
		<DndComponent
			{comparing}
			{reordering}
			onFinalize={workoutRunes.saveStoresToLocalStorage}
			bind:itemList={workoutRunes.workoutExercises}
		/>
	</div>
{/if}

<div class="mt-2 grid grid-cols-2 gap-2">
	<Button class="border border-[#303844] bg-[#171e27] text-[#dfe6ef] hover:bg-[#1b2430]" href="./start" variant="secondary">Previous</Button>
	<Button class="border border-[#8cae2f66] bg-[#c7f73a] text-[#17200d] hover:bg-[#d2f95a]" onclick={submitWorkoutExercises}>Next</Button>
</div>

<ExerciseHistorySheet />
<WarmUpDialog />

{#if shouldShowQuote && completedSets}
	<QuotesDialog {completedSets} />
{/if}
</section>
