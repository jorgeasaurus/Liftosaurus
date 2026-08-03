<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import DefaultInfiniteLoader from '$lib/components/DefaultInfiniteLoader.svelte';
	import * as Accordion from '$lib/components/ui/accordion';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { RangeCalendar } from '$lib/components/ui/range-calendar/index.js';
	import * as Select from '$lib/components/ui/select';
	import { trpc } from '$lib/trpc/client.js';
	import type { RouterInputs, RouterOutputs } from '$lib/trpc/router';
	import { cn, dateToLocalCalendarDate } from '$lib/utils.js';
	import {
		createExerciseChartHistoryResource,
		createUserPreservingDefaultSelection,
		type ExerciseChartHistoryResourceState
	} from '$lib/utils/exerciseChartHistory.js';
	import { DateFormatter, getLocalTimeZone } from '@internationalized/date';
	import type { DateRange, Selected } from 'bits-ui';
	import type { InfiniteEvent } from 'svelte-infinite-loading';
	import { toast } from 'svelte-sonner';
	import CalendarIcon from 'virtual:icons/lucide/calendar';
	import ChevronsUpDown from 'virtual:icons/lucide/chevrons-up-down';
	import FilterIcon from 'virtual:icons/lucide/filter';
	import RenameIcon from 'virtual:icons/lucide/folder-pen';
	import LoaderCircle from 'virtual:icons/lucide/loader-circle';
	import WorkoutExerciseCard from '../workouts/[workoutId]/(components)/WorkoutExerciseCard.svelte';
	import ExerciseStatsChart from './ExerciseStatsChart.svelte';
	import HistoricalMuscleGroupPopover from './HistoricalMuscleGroupPopover.svelte';

	type WorkoutExercise = RouterOutputs['workouts']['getExerciseHistory'][number];
	type ChartWorkoutExercise = RouterOutputs['workouts']['getExerciseChartHistory']['items'][number];
	type HistoricalMuscleGroupUpdateInput = RouterInputs['users']['updateHistoricalExerciseMuscleGroup'];
	type BasicExerciseData = Pick<WorkoutExercise, 'name' | 'targetMuscleGroup' | 'customMuscleGroup'>;
	type CardHistoryStatus = 'idle' | 'loading' | 'loaded' | 'error';

	const df = new DateFormatter('en-US', {
		dateStyle: 'medium'
	});

	let { data }: { data: { exerciseList: Promise<BasicExerciseData[]> } } = $props();
	let exercisesByMuscleGroup = $state<{ group: string; exercises: BasicExerciseData[] }[]>();

	let renameExerciseOpen = $state(false);
	let newExerciseName = $state<string>();
	let renamingExercise = $state(false);

	let searchText = $state('');
	let searchOpen = $state(true);
	let selectedExercise = $state<string>();
	let exerciseInstances = $state<WorkoutExercise[]>();
	let historyLoaderIdentifier = $state(0);
	let cardHistoryRequestId = 0;
	let chartAccordionValue = $state<string>();
	let cardHistoryStatus: CardHistoryStatus = $state('idle');
	let chartHistoryState = $state<ExerciseChartHistoryResourceState<ChartWorkoutExercise>>({ status: 'idle' });
	const historicalMuscleGroupOverrides = new Map<string, BasicExerciseData>();
	const appliedHistoricalMuscleGroupVersions = new Map<string, number>();
	let historicalMuscleGroupMutationVersion = 0;

	let filteredExercisesByMuscleGroup = $derived(
		exercisesByMuscleGroup
			?.filter((g) => g.exercises.some((ex) => ex.name.toLowerCase().includes(searchText.toLowerCase())))
			.map(({ group, exercises }) => ({
				group,
				exercises: exercises.filter((ex) => ex.name.toLowerCase().includes(searchText.toLowerCase()))
			})) ?? []
	);
	let selectedExerciseData = $derived(
		exercisesByMuscleGroup?.flatMap(({ exercises }) => exercises).find((exercise) => exercise.name === selectedExercise)
	);

	let dateRange: DateRange = $state({
		start: dateToLocalCalendarDate(new Date()),
		end: dateToLocalCalendarDate(new Date())
	});
	const dateRangeSelection = createUserPreservingDefaultSelection(dateRange, {
		cardHistory: 0,
		completeChartHistory: 1
	});
	const chartHistoryResource = createExerciseChartHistoryResource<ChartWorkoutExercise>({
		query: (input) => trpc().workouts.getExerciseChartHistory.query(input),
		onStateChange: (nextState) => {
			chartHistoryState = nextState;
			if (nextState.status === 'loaded' && nextState.data.length > 0) {
				dateRange = dateRangeSelection.applyDefault('completeChartHistory', {
					start: dateToLocalCalendarDate(nextState.data[0].workout.startedAt),
					end: dateToLocalCalendarDate(nextState.data.at(-1)!.workout.startedAt)
				});
			}
		}
	});
	let mesocycleNames = $derived.by(() => {
		const source = chartHistoryState.status === 'loaded' ? chartHistoryState.data : exerciseInstances;
		if (!source) return [];
		return Array.from(new Set(source.map((ex) => ex.workout.workoutOfMesocycle?.mesocycle.name ?? null)));
	});
	let selectedMesocycleNames: Selected<string | null>[] = $state([]);
	let hasFilterableHistory = $derived(
		(exerciseInstances?.length ?? 0) > 0 || (chartHistoryState.status === 'loaded' && chartHistoryState.data.length > 0)
	);

	let filteredCardExerciseInstances = $derived.by(() => {
		if (!exerciseInstances) return [];
		return exerciseInstances.filter((ex) => {
			const date = dateToLocalCalendarDate(ex.workout.startedAt);
			if (dateRange.start && dateRange.start > date) return false;
			if (dateRange.end && dateRange.end < date) return false;
			if (
				selectedMesocycleNames.length > 0 &&
				!selectedMesocycleNames.some((s) => s.value === (ex.workout.workoutOfMesocycle?.mesocycle.name ?? null))
			)
				return false;
			return true;
		});
	});
	let filteredChartExerciseInstances = $derived.by(() => {
		if (chartHistoryState.status !== 'loaded') return undefined;
		return chartHistoryState.data.filter((ex) => {
			const date = dateToLocalCalendarDate(ex.workout.startedAt);
			if (dateRange.start && dateRange.start > date) return false;
			if (dateRange.end && dateRange.end < date) return false;
			if (
				selectedMesocycleNames.length > 0 &&
				!selectedMesocycleNames.some((s) => s.value === (ex.workout.workoutOfMesocycle?.mesocycle.name ?? null))
			)
				return false;
			return true;
		});
	});

	$effect(() => {
		cardHistoryRequestId += 1;
		selectedExercise = undefined;
		exercisesByMuscleGroup = undefined;
		searchText = '';
		searchOpen = true;
		exerciseInstances = undefined;
		chartHistoryResource.reset();
		dateRangeSelection.reset();
		chartAccordionValue = undefined;
		cardHistoryStatus = 'idle';
		renameExerciseOpen = false;
		loadExercises();
	});

	$effect(() => {
		const exerciseName = selectedExercise;
		if (chartAccordionValue !== 'chart' || exerciseName === undefined) {
			chartHistoryResource.cancelLoading();
			return;
		}
		if (chartHistoryState.status === 'idle') void chartHistoryResource.load(exerciseName);
	});

	async function loadExercises() {
		const exerciseList = await data.exerciseList;
		exercisesByMuscleGroup = groupExercises(applyHistoricalMuscleGroupOverrides(exerciseList));
	}

	function groupExercises(exercises: BasicExerciseData[]) {
		return Object.entries(Object.groupBy(exercises, (ex) => ex.customMuscleGroup ?? ex.targetMuscleGroup)).map(
			([group, groupedExercises]) => ({
				group,
				exercises: groupedExercises!.filter((ex) => ex !== undefined)
			})
		);
	}

	function applyHistoricalMuscleGroupOverride<T extends BasicExerciseData>(exercise: T): T {
		const updatedExercise = historicalMuscleGroupOverrides.get(exercise.name);
		if (!updatedExercise) return exercise;
		return {
			...exercise,
			targetMuscleGroup: updatedExercise.targetMuscleGroup,
			customMuscleGroup: updatedExercise.customMuscleGroup
		};
	}

	function applyHistoricalMuscleGroupOverrides<T extends BasicExerciseData>(exercises: T[]) {
		return exercises.map(applyHistoricalMuscleGroupOverride);
	}

	function applyHistoricalMuscleGroupUpdate(updatedExercise: BasicExerciseData) {
		historicalMuscleGroupOverrides.set(updatedExercise.name, updatedExercise);
		if (exercisesByMuscleGroup) {
			exercisesByMuscleGroup = groupExercises(
				applyHistoricalMuscleGroupOverrides(exercisesByMuscleGroup.flatMap(({ exercises }) => exercises))
			);
		}
		exerciseInstances = exerciseInstances && applyHistoricalMuscleGroupOverrides(exerciseInstances);
	}

	async function updateHistoricalMuscleGroup(input: HistoricalMuscleGroupUpdateInput) {
		const mutationVersion = ++historicalMuscleGroupMutationVersion;
		const result = await trpc().users.updateHistoricalExerciseMuscleGroup.mutate(input);
		if (mutationVersion < (appliedHistoricalMuscleGroupVersions.get(input.exerciseName) ?? 0)) return;
		appliedHistoricalMuscleGroupVersions.set(input.exerciseName, mutationVersion);
		applyHistoricalMuscleGroupUpdate(result.exercise);
		return result;
	}

	async function selectExercise(name: string) {
		historyLoaderIdentifier += 1;
		searchText = name;
		searchOpen = false;
		selectedExercise = name;
		exerciseInstances = undefined;
		chartHistoryResource.reset();
		dateRangeSelection.reset();
		chartAccordionValue = undefined;
		selectedMesocycleNames = [];
		cardHistoryStatus = 'idle';

		void loadCardHistory(name);
	}

	async function loadCardHistory(name: string) {
		const requestId = ++cardHistoryRequestId;
		cardHistoryStatus = 'loading';
		try {
			const cardHistory = applyHistoricalMuscleGroupOverrides(
				await trpc().workouts.getExerciseHistory.query({ exerciseName: name })
			);
			if (requestId !== cardHistoryRequestId || name !== selectedExercise) return;
			exerciseInstances = cardHistory;
			cardHistoryStatus = 'loaded';
			if (cardHistory.length > 0) {
				dateRange = dateRangeSelection.applyDefault('cardHistory', {
					start: dateToLocalCalendarDate(cardHistory.at(-1)!.workout.startedAt),
					end: dateToLocalCalendarDate(cardHistory[0].workout.startedAt)
				});
			}
		} catch {
			if (requestId !== cardHistoryRequestId || name !== selectedExercise) return;
			exerciseInstances = [];
			cardHistoryStatus = 'error';
		}
	}

	async function loadMore(infiniteEvent: InfiniteEvent) {
		const exerciseName = selectedExercise;
		const requestId = historyLoaderIdentifier;
		const lastExerciseFound = exerciseInstances?.at(-1);
		if (exerciseName === undefined) return;

		const newExercisesFound = applyHistoricalMuscleGroupOverrides(
			await trpc().workouts.getExerciseHistory.query({
				cursorId: lastExerciseFound?.id,
				exerciseName
			})
		);
		if (requestId !== historyLoaderIdentifier || exerciseName !== selectedExercise) return;
		if (newExercisesFound.length === 0) {
			infiniteEvent.detail.complete();
			return;
		}

		infiniteEvent.detail.loaded();
		if (!exerciseInstances) exerciseInstances = [];
		exerciseInstances?.push(...newExercisesFound);
		dateRange = dateRangeSelection.applyDefault('cardHistory', {
			start: dateToLocalCalendarDate(exerciseInstances.at(-1)!.workout.startedAt),
			end: dateRange.end
		});
		if (newExercisesFound.length < 10) infiniteEvent.detail.complete();
	}

	async function renameExercise(e: SubmitEvent) {
		e.preventDefault();
		renamingExercise = true;
		const { count } = await trpc().users.renameExercises.mutate({
			oldName: selectedExercise!,
			newName: newExerciseName!
		});
		toast.success(`Renamed ${count} exercises`);
		await invalidateAll();
		renamingExercise = false;
	}
</script>

<div class="flex gap-1">
	<Popover.Root bind:open={searchOpen}>
		<Popover.Trigger asChild let:builder>
			<Button builders={[builder]} variant="outline" role="combobox" class="mb-2 grow justify-between truncate">
				<span class="truncate">{selectedExercise ?? 'Search for an exercise'}</span>
				<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
			</Button>
		</Popover.Trigger>
		<Popover.Content sameWidth>
			<Command.Root class="mb-6 h-fit" shouldFilter={false}>
				<Command.Input placeholder="Type here" bind:value={searchText} />
				<Command.List>
					{#if exercisesByMuscleGroup === undefined}
						<Command.Loading>
							<div
								class="flex h-full w-full flex-row items-center justify-center gap-2 p-4 text-sm text-muted-foreground"
							>
								<LoaderCircle class="animate-spin" />
								<span>Fetching exercises...</span>
							</div>
						</Command.Loading>
					{:else}
						<Command.Empty>No results found.</Command.Empty>
						{#each filteredExercisesByMuscleGroup as { group, exercises }}
							<Command.Group heading={group}>
								{#each exercises as ex}
									<Command.Item onclick={() => selectExercise(ex.name)}>{ex.name}</Command.Item>
								{/each}
							</Command.Group>
						{/each}
					{/if}
				</Command.List>
			</Command.Root>
		</Popover.Content>
	</Popover.Root>
	<Popover.Root bind:open={renameExerciseOpen}>
		<Popover.Trigger asChild let:builder>
			<Button
				builders={[builder]}
				size="icon"
				variant="secondary"
				aria-label="Rename exercise"
				class="shrink-0"
				disabled={selectedExercise === undefined}
			>
				<RenameIcon />
			</Button>
		</Popover.Trigger>
		<Popover.Content class="w-fit">
			<span class="font-semibold">Bulk rename to</span>
			<form class="my-2 flex w-full max-w-sm flex-col gap-1.5" onsubmit={renameExercise}>
				<Label for="new-name">New name</Label>
				<Input required id="new-name" placeholder="Type here" bind:value={newExerciseName} />
				<Button size="sm" type="submit" disabled={renamingExercise}>
					{#if renamingExercise}
						<LoaderCircle class="animate-spin" />
					{:else}
						Rename
					{/if}
				</Button>
			</form>
		</Popover.Content>
	</Popover.Root>
	{#key historyLoaderIdentifier}
		<HistoricalMuscleGroupPopover exercise={selectedExerciseData} updateHistory={updateHistoricalMuscleGroup} />
	{/key}
	<Popover.Root>
		<Popover.Trigger asChild let:builder>
			<Button
				builders={[builder]}
				size="icon"
				aria-label="Filter exercises"
				class="shrink-0"
				disabled={selectedExercise === undefined || !hasFilterableHistory}
			>
				<FilterIcon />
			</Button>
		</Popover.Trigger>
		<Popover.Content class="w-fit">
			<span class="font-semibold">Filter by date</span>
			<div class="my-2 flex w-full max-w-sm flex-col gap-1.5">
				<Popover.Root openFocus>
					<Popover.Trigger asChild let:builder>
						<Button
							variant="outline"
							class={cn('w-[300px] justify-start text-left font-normal', !dateRange && 'text-muted-foreground')}
							builders={[builder]}
						>
							<CalendarIcon class="mr-2 h-4 w-4" />
							{#if dateRange && dateRange.start}
								{#if dateRange.end}
									{df.format(dateRange.start.toDate(getLocalTimeZone()))} - {df.format(
										dateRange.end.toDate(getLocalTimeZone())
									)}
								{:else}
									{df.format(dateRange.start.toDate(getLocalTimeZone()))}
								{/if}
							{:else if dateRange.start}
								{df.format(dateRange.start.toDate(getLocalTimeZone()))}
							{:else}
								Pick a date
							{/if}
						</Button>
					</Popover.Trigger>
					<Popover.Content class="w-auto p-0" align="start">
						<RangeCalendar
							value={dateRange}
							onValueChange={(value) => (dateRange = dateRangeSelection.select(value))}
							initialFocus
							placeholder={dateRange?.start}
						/>
					</Popover.Content>
				</Popover.Root>
				<span class="font-semibold">Filter by mesocycles</span>
				<Select.Root multiple bind:selected={selectedMesocycleNames}>
					<Select.Trigger class="w-[300px]">
						<Select.Value placeholder="All mesocycles" />
					</Select.Trigger>
					<Select.Content>
						{#each mesocycleNames as mesocycleName}
							<Select.Item class={cn({ italic: mesocycleName === null })} value={mesocycleName}>
								{mesocycleName === null ? 'Non-mesocycle' : mesocycleName}
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
		</Popover.Content>
	</Popover.Root>
</div>

<div class="flex flex-col gap-2">
	{#if selectedExercise}
		<Accordion.Root bind:value={chartAccordionValue}>
			<Accordion.Item value="chart">
				<Accordion.Trigger>Show progression chart</Accordion.Trigger>
				<Accordion.Content>
					{#if chartHistoryState.status === 'error'}
						<div role="alert" class="muted-text-box flex items-center justify-between gap-2">
							<span>Could not load chart history.</span>
							<Button size="sm" onclick={() => chartHistoryResource.retry(selectedExercise!)}>Retry chart</Button>
						</div>
					{:else}
						<ExerciseStatsChart
							{selectedExercise}
							exercises={filteredChartExerciseInstances}
							historyTruncated={chartHistoryState.status === 'loaded' && chartHistoryState.truncated}
						/>
					{/if}
				</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
		{#if cardHistoryStatus === 'loading'}
			<div role="status" class="muted-text-box flex items-center gap-2">
				<LoaderCircle class="animate-spin" />
				<span>Loading performance history.</span>
			</div>
		{:else if cardHistoryStatus === 'error'}
			<div role="alert" class="muted-text-box flex items-center justify-between gap-2">
				<span>Could not load performance history.</span>
				<Button size="sm" onclick={() => loadCardHistory(selectedExercise!)}>Retry performances</Button>
			</div>
		{:else if cardHistoryStatus === 'loaded' && exerciseInstances}
			{#each filteredCardExerciseInstances as instance}
				<div data-testid="exercise-performance-card">
					<WorkoutExerciseCard exercise={instance} date={new Date(instance.workout.startedAt)} />
				</div>
			{/each}
			<DefaultInfiniteLoader {loadMore} identifier={historyLoaderIdentifier} entityPlural="exercises" />
		{/if}
	{/if}
</div>
