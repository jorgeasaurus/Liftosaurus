<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { navigating, page } from '$app/stores';
	import ResponsiveDialog from '$lib/components/ResponsiveDialog.svelte';
	import Quotes from '$lib/components/settings/Quotes.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
	import { Switch } from '$lib/components/ui/switch';
	import { trpc } from '$lib/trpc/client.js';
	import type { RouterOutputs } from '$lib/trpc/router.js';
	import { cn, convertCamelCaseToNormal } from '$lib/utils.js';
	import type { WorkoutStatus } from '@prisma/client';
	import { untrack } from 'svelte';
	import { toast } from 'svelte-sonner';
	import CheckIcon from 'virtual:icons/lucide/check';
	import LoaderCircle from 'virtual:icons/lucide/loader-circle';
	import RedoIcon from 'virtual:icons/lucide/rotate-cw';
	import SkipIcon from 'virtual:icons/lucide/skip-forward';
	import { workoutRunes } from '../workoutRunes.svelte.js';
	import { selectWorkoutStartData } from './workoutStartData';

	let { data } = $props();

	function dateToLocalISOString(date: Date): string {
		return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
	}

	function localISOStringToDate(isoString: string): Date {
		const localDate = new Date(isoString);
		return new Date(localDate.getTime());
	}

	const shouldShowQuote =
		data.userSettings.motivationalQuotesEnabled && data.userSettings.quotesDisplayModes.includes('PRE_WORKOUT');

	let useActiveMesocycle = $state(false);
	let workoutData: RouterOutputs['workouts']['getTodaysWorkoutData'] | 'loading' = $state('loading');
	let defaultWorkoutData = $state<RouterOutputs['workouts']['getTodaysWorkoutData']>();
	let userBodyweight: null | number = $state(workoutRunes.workoutData?.userBodyweight ?? null);
	let targetedMuscleGroups = $derived.by(() => {
		let result: string[] = [];
		if (workoutData !== 'loading') {
			result = workoutData.workoutExercises.map((exercise) => {
				return exercise.customMuscleGroup ?? exercise.targetMuscleGroup;
			});
		}
		return Array.from(new Set(result));
	});
	let overwriteWorkoutDialogOpen = $state(false);
	let completingWorkout = $state(false);
	let skipWorkoutWithWorkoutExercisesDialogOpen = $state(false);
	let skippedWorkoutsOfCycle = $state<RouterOutputs['workouts']['getSkippedWorkoutsOfCurrentCycle']>();
	let appliedExternalStorageRevision = workoutRunes.externalStorageRevision;

	function applyWorkoutData(nextWorkoutData: RouterOutputs['workouts']['getTodaysWorkoutData']) {
		workoutData = nextWorkoutData;
		userBodyweight = nextWorkoutData.userBodyweight;
		useActiveMesocycle = nextWorkoutData.workoutOfMesocycle !== undefined;
	}

	$effect(() => {
		const requestRevision = untrack(() => workoutRunes.externalStorageRevision);
		data.workoutData.then((data) => {
			defaultWorkoutData = data;
			const selection = selectWorkoutStartData({
				defaultWorkoutData: data,
				restoredWorkoutData: workoutRunes.workoutData,
				editing: workoutRunes.editingWorkoutId !== null,
				requestRevision,
				currentRevision: workoutRunes.externalStorageRevision,
				appliedRevision: appliedExternalStorageRevision
			});
			appliedExternalStorageRevision = selection.appliedRevision;
			if (selection.restoredDraft) applyWorkoutData(selection.workoutData);
			else {
				workoutData = selection.workoutData;
				userBodyweight = userBodyweight ?? workoutData.userBodyweight;
				if (workoutData.workoutOfMesocycle !== undefined) useActiveMesocycle = true;
			}
		});

		data.skippedWorkouts?.then((skippedWorkouts) => {
			skippedWorkoutsOfCycle = skippedWorkouts;
		});
		if (data.skippedWorkouts === undefined) skippedWorkoutsOfCycle = undefined;
	});

	$effect(() => {
		const externalStorageRevision = workoutRunes.externalStorageRevision;
		if (externalStorageRevision === appliedExternalStorageRevision) return;

		if (defaultWorkoutData === undefined) return;
		const selection = selectWorkoutStartData({
			defaultWorkoutData,
			restoredWorkoutData: workoutRunes.workoutData,
			editing: workoutRunes.editingWorkoutId !== null,
			requestRevision: appliedExternalStorageRevision,
			currentRevision: externalStorageRevision,
			appliedRevision: appliedExternalStorageRevision
		});
		appliedExternalStorageRevision = selection.appliedRevision;
		applyWorkoutData(selection.workoutData);
	});

	async function startWorkout(fromDialog = false, mode: 'keepCurrent' | 'overwrite' = 'overwrite') {
		if (workoutRunes.editingWorkoutId) {
			if (workoutRunes.workoutData) workoutRunes.workoutData.userBodyweight = userBodyweight;
			await workoutRunes.saveStoresToLocalStorage();
			await goto('./exercises?editing');
			return;
		}

		if (workoutRunes.workoutExercises !== null && !fromDialog) {
			overwriteWorkoutDialogOpen = true;
			return;
		}
		overwriteWorkoutDialogOpen = false;

		if (workoutData === 'loading') return;
		workoutData.userBodyweight = userBodyweight;

		if (mode === 'overwrite') {
			if (useActiveMesocycle) workoutRunes.workoutData = workoutData;
			else
				workoutRunes.workoutData = {
					...workoutData,
					workoutOfMesocycle: undefined,
					workoutExercises: []
				};
			workoutRunes.workoutExercises = null;
		} else if (workoutRunes.workoutData === null) workoutRunes.workoutData = workoutData;
		await workoutRunes.saveStoresToLocalStorage();

		const workoutOfMesocycle = workoutRunes.workoutData.workoutOfMesocycle;
		let exercisesLink = `./exercises?userBodyweight=${userBodyweight}`;
		if (useActiveMesocycle) exercisesLink += '&useActiveMesocycle';
		if (mode === 'keepCurrent') exercisesLink += '&keepCurrent';
		if (workoutOfMesocycle) exercisesLink += `&splitDayIndex=${workoutOfMesocycle.splitDayIndex}`;
		await goto(exercisesLink);
	}

	async function repeatSkippedWorkout(splitDayIndex: number) {
		if (await workoutRunes.beginNewWorkout()) {
			await goto(`/workouts/manage/start?repeatSkipped=${splitDayIndex}`);
		}
	}

	async function completeWorkout(workoutStatus: WorkoutStatus, force = false) {
		if (workoutData === 'loading') return;
		if (workoutRunes.ownerUserId === null) return;
		if (typeof userBodyweight !== 'number') {
			toast.error('Enter your bodyweight');
			return;
		}
		if (workoutRunes.workoutExercises !== null && !force) {
			skipWorkoutWithWorkoutExercisesDialogOpen = true;
			return;
		}

		completingWorkout = true;
		const { message, mesocycleCompleted } = await trpc().workouts.create.mutate({
			draftOwnerUserId: workoutRunes.ownerUserId,
			workoutData: {
				userBodyweight,
				workoutOfMesocycle: {
					splitDayIndex: workoutData.workoutOfMesocycle?.splitDayIndex as number,
					mesocycle: { id: workoutData.workoutOfMesocycle?.mesocycle.id as string },
					workoutStatus
				}
			},
			workoutExercises: [],
			workoutExercisesSets: [],
			workoutExercisesMiniSets: []
		});
		toast.success(message);
		skipWorkoutWithWorkoutExercisesDialogOpen = false;
		await workoutRunes.resetStores();
		await invalidate('workouts:start');
		completingWorkout = false;

		if (mesocycleCompleted) {
			await goto(`/mesocycles/${workoutData.workoutOfMesocycle?.mesocycle.id}?completion`);
		}
	}
</script>

<section class="mx-auto flex h-full w-full max-w-[1240px] flex-col gap-4">
	<header>
		<h1 class="text-4xl font-semibold tracking-[-0.03em] text-foreground">Start workout</h1>
		<p class="mt-1 text-sm text-muted-foreground">Set context, verify plan details, then launch your live session.</p>
	</header>

	{#if shouldShowQuote}
		<Quotes mode="PRE_WORKOUT" class="mb-1" />
	{/if}

	{#if workoutData === 'loading'}
		<Skeleton class="mb-1 h-16 w-full rounded-xl border border-[#2a323b] bg-[#151b22]" />
		<Skeleton class="mb-1 h-[110px] w-full rounded-xl border border-[#2a323b] bg-[#151b22]" />
		<Skeleton class="h-[176px] w-full rounded-xl border border-[#2a323b] bg-[#151b22]" />
		<Skeleton class="mt-auto h-11 w-full rounded-lg" />
	{:else}
	{#if workoutData.isLastWorkout}
		<Card.Root class="mb-1 border-[#2a323b] bg-[#11161d]">
			<Card.Header>
				<Card.Title class="text-[#e9eef5]">Last workout for the mesocycle &nbsp;🎉</Card.Title>
				<Card.Description class="text-[#a2afbf]">
					If you complete this workout, this mesocycle will be marked as completed and you'll have to start a new one to
					continue training. If you don't want to go through that hassle, you can edit the duration and extend it now.
				</Card.Description>
			</Card.Header>
			<Card.Footer>
				<Button class="ml-auto border border-[#2f3844] bg-[#161d25] text-[#dbe3ec]" href={`/mesocycles/${workoutData.workoutOfMesocycle?.mesocycle.id}`}>
					Edit mesocycle
				</Button>
			</Card.Footer>
		</Card.Root>
	{/if}
	{#if workoutRunes.editingWorkoutId === null}
		<div class="mb-1 flex items-center justify-between gap-2 rounded-xl border border-[#2a323b] bg-[#11161d] p-4 text-[#dbe3ec]">
			<Label for="use-active-mesocycle">
				{workoutData.workoutOfMesocycle === undefined ? 'No' : 'Use'} active mesocycle
			</Label>
			{#if workoutData.workoutOfMesocycle === undefined}
				<Switch id="use-active-mesocycle" name="use-active-mesocycle" disabled />
			{:else}
				<Switch id="use-active-mesocycle" name="use-active-mesocycle" bind:checked={useActiveMesocycle} />
			{/if}
		</div>
	{/if}
	{#if !(useActiveMesocycle && workoutData.workoutOfMesocycle?.workoutStatus === 'RestDay')}
		<form
			class="mb-1 flex w-full flex-col gap-1.5 rounded-xl border border-[#2a323b] bg-[#11161d] p-4"
			name="user-bodyweight-form"
			id="user-bodyweight-form"
			onsubmit={(e) => {
				e.preventDefault();
				startWorkout();
			}}
		>
			<Label class="text-[#dbe3ec]" for="user-bodyweight">Bodyweight (lbs)</Label>
			<Input
				class="border-[#303843] bg-[#10161e] text-[#e8edf4]"
				id="user-bodyweight"
				placeholder="Type here"
				type="number"
				min={1}
				step={0.01}
				bind:value={userBodyweight}
			/>
			{#if workoutRunes.editingWorkoutId !== null && workoutRunes.workoutData}
				<div class="grid grid-cols-2 gap-x-2 gap-y-1.5">
					<Label class="text-[#dbe3ec]" for="start-date">Start date</Label>
					<Label class="text-[#dbe3ec]" for="end-date">End date</Label>
					<Input
						class="border-[#303843] bg-[#10161e] text-[#e8edf4]"
						id="start-date"
						type="datetime-local"
						value={dateToLocalISOString(workoutRunes.workoutData.startedAt as Date)}
						onchange={(e) => {
							workoutRunes.workoutData!.startedAt = localISOStringToDate(e.currentTarget.value);
						}}
						required
					/>
					<Input
						class="border-[#303843] bg-[#10161e] text-[#e8edf4]"
						id="end-date"
						type="datetime-local"
						min={dateToLocalISOString(workoutRunes.workoutData.startedAt as Date)}
						value={dateToLocalISOString(workoutRunes.workoutData.endedAt! as Date)}
						onchange={(e) => {
							workoutRunes.workoutData!.endedAt = localISOStringToDate(e.currentTarget.value);
						}}
						required
					/>
				</div>
			{/if}
		</form>
	{/if}
	{#if skippedWorkoutsOfCycle && skippedWorkoutsOfCycle.length > 0}
		<Card.Root class="mb-1 border-[#2a323b] bg-[#11161d]">
			<Card.Header>
				<Card.Title class="text-[#e9eef5]">Skipped days</Card.Title>
				<Card.Description class="text-[#a2afbf]">for this cycle</Card.Description>
			</Card.Header>
			<Card.Content class="flex flex-wrap gap-1">
				{#each skippedWorkoutsOfCycle as skippedWorkout}
					<Button variant="secondary" class="gap-2 border border-[#303844] bg-[#171e27] text-[#dfe6ef]" onclick={() => repeatSkippedWorkout(skippedWorkout.splitDayIndex)}>
						{skippedWorkout.splitDayName}
						<RedoIcon />
					</Button>
				{/each}
			</Card.Content>
		</Card.Root>
	{/if}
	{#if useActiveMesocycle && workoutData.workoutOfMesocycle}
		{@const workoutStatus = workoutData.workoutOfMesocycle.workoutStatus}
		{@const splitDayName = workoutData.workoutOfMesocycle.splitDayName}
		<Card.Root class="border-[#2a323b] bg-[#11161d]">
			<Card.Header>
				<Card.Title class={cn({ 'text-primary': splitDayName === '' })}>
					{splitDayName === '' ? 'Rest' : splitDayName}
				</Card.Title>
				<Card.Description class="pb-1 text-[#9fadbf]">
					Day {workoutData.workoutOfMesocycle.splitDayIndex + 1}, Cycle {workoutData.workoutOfMesocycle.cycleNumber}
					{#if $page.url.searchParams.get('repeatSkipped')}
						(Repeating skipped)
					{/if}
				</Card.Description>
				<div class="flex flex-wrap gap-1">
					{#each targetedMuscleGroups as muscleGroup}
						<Badge variant="secondary">{convertCamelCaseToNormal(muscleGroup)}</Badge>
					{/each}
				</div>
			</Card.Header>
			<Card.Footer>
				<Button
					class="ml-auto w-32 gap-2"
					disabled={completingWorkout}
					onclick={() => completeWorkout(workoutStatus === 'RestDay' ? 'RestDay' : 'Skipped')}
					variant={workoutStatus === 'RestDay' ? 'default' : 'destructive'}
				>
					{#if completingWorkout}
						<LoaderCircle class="animate-spin" />
					{:else}
						{workoutStatus === 'RestDay' ? 'Complete' : 'Skip'}
						{#if workoutStatus === 'RestDay'}
							<CheckIcon />
						{:else}
							<SkipIcon />
						{/if}
					{/if}
				</Button>
			</Card.Footer>
		</Card.Root>
	{/if}
	{#if workoutData.workoutOfMesocycle?.workoutStatus !== 'RestDay'}
		<Button
			class="mt-auto border border-[#8cae2f66] bg-[#c7f73a] text-[#17200d] hover:bg-[#d2f95a]"
			type="submit"
			form="user-bodyweight-form"
			disabled={userBodyweight === null || $navigating !== null}
		>
			{#if $navigating}
				<LoaderCircle class="animate-spin" />
			{:else}
				Next
			{/if}
		</Button>
	{/if}
	{/if}
</section>

<ResponsiveDialog title="Warning" bind:open={overwriteWorkoutDialogOpen}>
	{#snippet description()}
		A workout is already in progress with <span class="font-semibold"
			>{workoutRunes.workoutExercises?.length} exercises</span
		>, do you want to overwrite it?
	{/snippet}
	<div class="grid grid-cols-2 gap-1.5">
		<Button onclick={() => startWorkout(true, 'keepCurrent')}>Keep current</Button>
		<Button onclick={() => startWorkout(true, 'overwrite')} variant="destructive">Overwrite</Button>
	</div>
</ResponsiveDialog>

<ResponsiveDialog title="Warning" bind:open={skipWorkoutWithWorkoutExercisesDialogOpen}>
	{#snippet description()}
		A workout is already in progress with <span class="font-semibold"
			>{workoutRunes.workoutExercises?.length} exercises</span
		>, skipping will get rid of it.
	{/snippet}
	<Button onclick={() => completeWorkout('Skipped', true)} variant="destructive">Skip</Button>
</ResponsiveDialog>
