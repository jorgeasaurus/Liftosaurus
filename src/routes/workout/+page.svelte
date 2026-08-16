<script lang="ts">
	import { goto, invalidate, invalidateAll } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { trpc } from '$lib/trpc/client';
	import { TRPCClientError } from '@trpc/client';
	import { onDestroy, onMount, untrack } from 'svelte';
	import { toast } from 'svelte-sonner';
	import LoaderCircle from 'virtual:icons/lucide/loader-circle';
	import { workoutRunes } from '../workouts/manage/workoutRunes.svelte';

	type CurrentWorkoutData = Awaited<typeof data.workoutData>;
	type ViewState = 'loading' | 'measurements' | 'noPlan' | 'rest' | 'error';

	let { data } = $props();
	let status: ViewState = $state('loading');
	let preparing = $state(false);
	let completingRest = $state(false);
	let userBodyweight: number | null = $state(null);
	let userBodyFat: number | null = $state(null);
	let currentData = $state<CurrentWorkoutData>();
	let resolutionGeneration = 0;
	let observedExternalRevision = workoutRunes.externalStorageRevision;
	let mounted = true;

	onDestroy(() => {
		mounted = false;
		resolutionGeneration += 1;
	});

	function isCurrentResolution(generation: number, storageRevision: number) {
		return mounted && generation === resolutionGeneration && storageRevision === workoutRunes.externalStorageRevision;
	}

	function measurementsAreValid() {
		return (
			typeof userBodyweight === 'number' &&
			userBodyweight > 0 &&
			(userBodyFat === null || (typeof userBodyFat === 'number' && userBodyFat >= 0 && userBodyFat <= 100))
		);
	}

	function selectWorkout(workout: CurrentWorkoutData) {
		currentData = workout;
		userBodyweight = workout.userBodyweight;
		userBodyFat = workout.userBodyFat ?? null;
	}

	function isSamePlannedWorkout(left: CurrentWorkoutData, right: CurrentWorkoutData) {
		const leftPlan = left.workoutOfMesocycle;
		const rightPlan = right.workoutOfMesocycle;
		return (
			leftPlan !== undefined &&
			rightPlan !== undefined &&
			leftPlan.mesocycle.id === rightPlan.mesocycle.id &&
			leftPlan.splitDayIndex === rightPlan.splitDayIndex &&
			leftPlan.cycleNumber === rightPlan.cycleNumber &&
			leftPlan.workoutStatus === rightPlan.workoutStatus
		);
	}

	async function openLogger() {
		await goto('/workouts/manage/exercises?keepCurrent&current', { replaceState: true });
	}

	async function hydrateSelectedWorkout(generation: number, storageRevision: number) {
		if (!currentData || !measurementsAreValid()) return 'measurements' as const;

		currentData.userBodyweight = userBodyweight!;
		currentData.userBodyFat = userBodyFat;
		workoutRunes.workoutData = currentData;
		workoutRunes.workoutExercises = null;
		workoutRunes.previousWorkoutData = null;
		await workoutRunes.saveStoresToLocalStorage();
		if (!isCurrentResolution(generation, storageRevision)) return 'stale' as const;

		const plannedWorkout = currentData.workoutOfMesocycle;
		if (plannedWorkout) {
			const serverData = await trpc().workouts.getWorkoutExercisesWithPreviousData.query({
				userBodyweight: userBodyweight!,
				splitDayIndex: plannedWorkout.splitDayIndex
			});
			if (!isCurrentResolution(generation, storageRevision)) return 'stale' as const;
			workoutRunes.workoutExercises = serverData.todaysWorkoutExercises;
			workoutRunes.previousWorkoutData = serverData.previousWorkoutData;
		} else {
			workoutRunes.workoutExercises = [];
		}

		await workoutRunes.saveStoresToLocalStorage();
		return isCurrentResolution(generation, storageRevision) ? ('ready' as const) : ('stale' as const);
	}

	async function resolveCurrentWorkout() {
		const generation = ++resolutionGeneration;
		preparing = true;
		status = 'loading';
		try {
			if (workoutRunes.editingWorkoutId !== null) workoutRunes.switchToActiveDraft();

			while (mounted && generation === resolutionGeneration) {
				const storageRevision = workoutRunes.externalStorageRevision;
				let selectedWorkout = workoutRunes.workoutData;
				let restored = selectedWorkout !== null;

				if (selectedWorkout?.workoutOfMesocycle) {
					const serverWorkout = await trpc().workouts.getTodaysWorkoutData.query();
					if (!isCurrentResolution(generation, storageRevision)) continue;
					if (!isSamePlannedWorkout(selectedWorkout, serverWorkout)) {
						await workoutRunes.resetStores();
						if (!isCurrentResolution(generation, storageRevision)) continue;
						selectedWorkout = serverWorkout;
						restored = false;
					}
				}

				if (!selectedWorkout) {
					selectedWorkout = await data.workoutData;
					if (!isCurrentResolution(generation, storageRevision) || workoutRunes.workoutData !== null) continue;
				}

				selectWorkout(selectedWorkout);
				if (!restored && !selectedWorkout.workoutOfMesocycle) {
					status = 'noPlan';
					return;
				}
				if (selectedWorkout.workoutOfMesocycle?.workoutStatus === 'RestDay') {
					workoutRunes.workoutData = selectedWorkout;
					workoutRunes.workoutExercises = [];
					workoutRunes.previousWorkoutData = null;
					await workoutRunes.saveStoresToLocalStorage();
					if (!isCurrentResolution(generation, storageRevision)) continue;
					status = measurementsAreValid() ? 'rest' : 'measurements';
					return;
				}
				if (restored && workoutRunes.workoutExercises !== null) {
					await openLogger();
					return;
				}

				const result = await hydrateSelectedWorkout(generation, storageRevision);
				if (result === 'stale') continue;
				if (result === 'measurements') {
					status = 'measurements';
					return;
				}
				await openLogger();
				return;
			}
		} catch {
			if (mounted && generation === resolutionGeneration) status = 'error';
		} finally {
			if (mounted && generation === resolutionGeneration) preparing = false;
		}
	}

	async function acceptMeasurements() {
		if (!currentData || !measurementsAreValid()) return;
		currentData.userBodyweight = userBodyweight!;
		currentData.userBodyFat = userBodyFat;
		workoutRunes.workoutData = currentData;
		workoutRunes.workoutExercises = currentData.workoutOfMesocycle?.workoutStatus === 'RestDay' ? [] : null;
		workoutRunes.previousWorkoutData = null;
		await workoutRunes.saveStoresToLocalStorage();
		await resolveCurrentWorkout();
	}

	async function completeRestDay() {
		if (!currentData?.workoutOfMesocycle || workoutRunes.ownerUserId === null || !measurementsAreValid()) return;
		completingRest = true;
		try {
			currentData.userBodyweight = userBodyweight!;
			currentData.userBodyFat = userBodyFat;
			workoutRunes.workoutData = currentData;
			workoutRunes.workoutExercises = [];
			workoutRunes.previousWorkoutData = null;
			const intentToken = workoutRunes.captureCompletionToken();
			if (!intentToken) throw new Error('Could not prepare rest day');
			await workoutRunes.saveStoresToLocalStorage();
			if (intentToken.serializedDraft !== workoutRunes.captureCompletionToken()?.serializedDraft) {
				throw new Error('Rest day changed before it could be saved');
			}
			const submittedWorkout = workoutRunes.workoutData;
			if (
				!submittedWorkout?.workoutOfMesocycle ||
				submittedWorkout.workoutOfMesocycle.workoutStatus !== 'RestDay' ||
				typeof submittedWorkout.userBodyweight !== 'number'
			) {
				throw new Error('Rest day changed before it could be saved');
			}
			const completionToken = workoutRunes.captureCompletionToken();
			if (!completionToken) throw new Error('Could not prepare rest day');
			const result = await trpc().workouts.create.mutate({
				draftOwnerUserId: workoutRunes.ownerUserId,
				workoutData: {
					completionId: submittedWorkout.completionId,
					userBodyweight: submittedWorkout.userBodyweight,
					userBodyFat: submittedWorkout.userBodyFat,
					workoutOfMesocycle: {
						mesocycle: { id: submittedWorkout.workoutOfMesocycle.mesocycle.id },
						splitDayIndex: submittedWorkout.workoutOfMesocycle.splitDayIndex,
						cycleNumber: submittedWorkout.workoutOfMesocycle.cycleNumber,
						workoutStatus: 'RestDay'
					}
				},
				workoutExercises: [],
				workoutExercisesSets: [],
				workoutExercisesMiniSets: []
			});
			await workoutRunes.finalizeCompletion(completionToken);
			toast.success(result.message);
			await invalidateAll();
			await resolveCurrentWorkout();
		} catch (error) {
			if (error instanceof TRPCClientError && error.data?.code === 'CONFLICT') {
				await workoutRunes.resetStores();
				await invalidate('workouts:current');
				toast.info('This rest day was already handled elsewhere. Showing your current day.');
				await resolveCurrentWorkout();
				return;
			}
			toast.error(error instanceof Error ? error.message : 'Could not complete rest day');
		} finally {
			completingRest = false;
		}
	}

	onMount(resolveCurrentWorkout);
	$effect(() => {
		const revision = workoutRunes.externalStorageRevision;
		const ready = status !== 'loading' && !preparing && !completingRest;
		if (revision === observedExternalRevision) return;
		if (mounted && ready) {
			observedExternalRevision = revision;
			untrack(() => {
				void invalidate('workouts:current').then(resolveCurrentWorkout);
			});
		}
	});
</script>

<section class="mx-auto flex h-full w-full max-w-xl items-center justify-center">
	{#if status === 'loading'}
		<div class="flex items-center gap-2 text-sm text-muted-foreground" role="status">
			<LoaderCircle class="h-4 w-4 animate-spin" /> Preparing your workout
		</div>
	{:else if status === 'measurements'}
		<Card.Root class="w-full">
			<Card.Header>
				<Card.Title>One detail before you train</Card.Title>
				<Card.Description>We need your bodyweight once for load and progression calculations.</Card.Description>
			</Card.Header>
			<Card.Content class="grid gap-3">
				<div class="grid gap-1.5">
					<Label for="current-bodyweight">Bodyweight (lbs)</Label>
					<Input id="current-bodyweight" min={1} step={0.01} type="number" bind:value={userBodyweight} />
				</div>
				<div class="grid gap-1.5">
					<Label for="current-body-fat">Body fat (%) <span class="text-muted-foreground">optional</span></Label>
					<Input
						id="current-body-fat"
						min={0}
						max={100}
						step={0.01}
						type="number"
						value={userBodyFat}
						oninput={(event) => {
							const value = event.currentTarget.value;
							userBodyFat = value === '' ? null : Number(value);
						}}
					/>
				</div>
			</Card.Content>
			<Card.Footer>
				<Button class="w-full" disabled={!measurementsAreValid() || preparing} onclick={acceptMeasurements}>
					Open workout
				</Button>
			</Card.Footer>
		</Card.Root>
	{:else if status === 'rest'}
		<Card.Root class="w-full text-center">
			<Card.Header>
				<Card.Title>Rest day</Card.Title>
				<Card.Description>Your current plan has recovery scheduled today.</Card.Description>
			</Card.Header>
			<Card.Footer class="justify-center">
				<Button disabled={completingRest} onclick={completeRestDay}>
					{completingRest ? 'Completing rest day' : 'Complete rest day'}
				</Button>
			</Card.Footer>
		</Card.Root>
	{:else if status === 'noPlan'}
		<Card.Root class="w-full text-center">
			<Card.Header>
				<Card.Title>No current workout</Card.Title>
				<Card.Description>Start a plan to make this tab your daily workout.</Card.Description>
			</Card.Header>
			<Card.Footer class="justify-center gap-2">
				<Button href="/plans">Choose a plan</Button>
				<Button href="/workouts/manage/start" variant="secondary">Free workout</Button>
			</Card.Footer>
		</Card.Root>
	{:else}
		<Card.Root class="w-full text-center">
			<Card.Header>
				<Card.Title>Could not prepare this workout</Card.Title>
				<Card.Description>Your prepared workout was kept. Try again when the connection recovers.</Card.Description>
			</Card.Header>
			<Card.Footer class="justify-center"><Button onclick={resolveCurrentWorkout}>Try again</Button></Card.Footer>
		</Card.Root>
	{/if}
</section>
