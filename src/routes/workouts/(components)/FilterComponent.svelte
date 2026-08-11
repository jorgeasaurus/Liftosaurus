<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Popover from '$lib/components/ui/popover';
	import * as Select from '$lib/components/ui/select';
	import type { RouterInputs, RouterOutputs } from '$lib/trpc/router';
	import { dateToCalendarDate } from '$lib/utils';
	import type { WorkoutStatus } from '@prisma/client';
	import type { DateRange, Selected } from 'bits-ui';
	import { onMount } from 'svelte';
	import FilterIcon from 'virtual:icons/lucide/filter';
	import DateRangePicker from './DateRangePicker.svelte';

	type PropsType = {
		currentFilters: Exclude<RouterInputs['workouts']['load']['filters'], undefined>;
		filterData: NonNullable<RouterOutputs['workouts']['getFilterData']>;
		setFilters: (
			selectedDateRange: DateRange,
			selectedMesocycles: (string | null)[],
			selectedWorkoutStatus: (WorkoutStatus | null)[]
		) => void;
	};
	let { currentFilters, filterData, setFilters }: PropsType = $props();

	let open = $state(false);
	let selectedDateRange: DateRange = $state({ start: undefined, end: undefined });
	let selectedMesocycles: Selected<string | null>[] = $state([]);
	let selectedWorkoutStatuses: Map<WorkoutStatus | null, boolean> = new Map([
		[null, true],
		['Skipped', true],
		['RestDay', true]
	]);
	let selectedWorkoutStatusFilterCount = $derived(currentFilters.selectedWorkoutStatuses?.length ?? 0);
	let activeFilterCount = $derived(
		Number(Boolean(currentFilters.startDate || currentFilters.endDate)) +
			Number(Boolean(currentFilters.selectedMesocycles?.length)) +
			Number(selectedWorkoutStatusFilterCount > 0 && selectedWorkoutStatusFilterCount < selectedWorkoutStatuses.size)
	);

	onMount(() => {
		if (currentFilters.startDate) {
			selectedDateRange.start = dateToCalendarDate(new Date(currentFilters.startDate));
		}
		if (currentFilters.endDate) {
			selectedDateRange.end = dateToCalendarDate(new Date(currentFilters.endDate));
		}
		if (currentFilters.selectedMesocycles) {
			selectedMesocycles = currentFilters.selectedMesocycles.map((mesocycleName) => ({
				value: mesocycleName,
				label: mesocycleName ?? 'Non-meso workouts'
			}));
		}
		if (currentFilters.selectedWorkoutStatuses) {
			selectedWorkoutStatuses.set(null, false);
			selectedWorkoutStatuses.set('Skipped', false);
			selectedWorkoutStatuses.set('RestDay', false);
			currentFilters.selectedWorkoutStatuses.forEach((workoutStatus) => {
				selectedWorkoutStatuses.set(workoutStatus, true);
			});
		}
	});

	function applyFilters() {
		const workoutStatuses = Array.from(selectedWorkoutStatuses.entries())
			.filter(([_, value]) => value)
			.map(([key]) => key);
		setFilters(
			selectedDateRange,
			selectedMesocycles.map((s) => s.value),
			workoutStatuses.length === selectedWorkoutStatuses.size ? [] : workoutStatuses
		);
		open = false;
	}
</script>

<Popover.Root bind:open>
	<Popover.Trigger asChild let:builder>
		<Button
			class="pressable-control h-11 grow justify-between gap-2 rounded-xl px-3"
			aria-label="search"
			builders={[builder]}
			variant="secondary"
		>
			<span class="flex items-center gap-2"><FilterIcon class="h-4 w-4" /> Filters</span>
			{#if activeFilterCount > 0}
				<span
					class="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold tabular-nums text-primary-foreground"
				>
					{activeFilterCount} active
				</span>
			{/if}
		</Button>
	</Popover.Trigger>
	<Popover.Content class="surface-panel flex w-11/12 max-w-xl flex-col gap-1 rounded-xl p-4">
		<div class="mb-2 flex items-center justify-between">
			<div>
				<p class="section-kicker">Workout history</p>
				<p class="mt-1 text-sm font-semibold">Filter sessions</p>
			</div>
			{#if activeFilterCount > 0}<span class="text-xs text-muted-foreground">{activeFilterCount} active</span>{/if}
		</div>
		<span class="border-t border-dashed pt-3 text-sm font-semibold">Date range</span>
		<DateRangePicker bind:value={selectedDateRange} {...filterData} />

		<span class="mt-3 border-t border-dashed pt-3 text-sm font-semibold">Mesocycles</span>
		<Select.Root multiple bind:selected={selectedMesocycles}>
			<Select.Trigger class="w-full">
				<Select.Value placeholder="Select a value" />
			</Select.Trigger>
			<Select.Content>
				<Select.Item class="italic" value={null}>Non-meso workouts</Select.Item>
				{#each filterData.allMesocycles as mesocycle}
					{@const isActive = mesocycle.startDate && mesocycle.endDate === null}
					<Select.Item class="flex items-center justify-between" value={mesocycle.name}>
						{mesocycle.name}
						{#if isActive}
							<div class="h-2 w-2 rounded-full bg-primary"></div>
						{/if}
					</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>

		<span class="mt-3 border-t border-dashed pt-3 text-sm font-semibold">Workout types</span>
		<div class="grid grid-cols-3 gap-2 rounded-lg bg-muted/35 p-2">
			{#each selectedWorkoutStatuses as [workoutStatus, selected]}
				<div class="flex min-w-0 items-center justify-between gap-2 rounded-md border bg-background/40 px-2 py-2">
					<Label for="{workoutStatus}-workout-status" class="text-sm leading-none">
						{workoutStatus ?? 'Normal'}
					</Label>
					<Checkbox
						id="{workoutStatus}-workout-status"
						checked={selected}
						onCheckedChange={(c) => {
							if (typeof c === 'string') return;
							selectedWorkoutStatuses.set(workoutStatus, c);
						}}
					/>
				</div>
			{/each}
		</div>
		<Button class="pressable-control mt-3" onclick={applyFilters}>Apply filters</Button>
	</Popover.Content>
</Popover.Root>
