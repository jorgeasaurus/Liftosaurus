<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { convertCamelCaseToNormal } from '$lib/utils';
	import type { ManualDeloadTarget, WorkoutExerciseInProgress } from '$lib/utils/workoutUtils';
	import { dragHandle } from 'svelte-dnd-action';
	import GripVertical from 'virtual:icons/lucide/grip-vertical';
	import MenuIcon from 'virtual:icons/lucide/menu';
	import EditIcon from 'virtual:icons/lucide/pencil';
	import SkipIcon from 'virtual:icons/lucide/skip-forward';
	import DeleteIcon from 'virtual:icons/lucide/trash';
	import HistoryIcon from 'virtual:icons/lucide/history';
	import ChartIcon from 'virtual:icons/lucide/chart-no-axes-column-increasing';
	import DeloadIcon from 'virtual:icons/lucide/trending-down';
	import { workoutRunes } from '../../workoutRunes.svelte';
	import CompareComponent from './CompareComponent.svelte';
	import SetsComponent from './SetsComponent.svelte';
	import type { WorkoutSetTarget } from '$lib/utils/workoutUtils';

	type PropsType = {
		activeTarget?: WorkoutSetTarget | null;
		readOnly?: boolean;
		idx: number;
		reordering?: boolean;
		comparing?: boolean;
		exercise: WorkoutExerciseInProgress;
	};

	let {
		readOnly,
		idx,
		reordering = false,
		comparing = false,
		activeTarget,
		exercise = $bindable()
	}: PropsType = $props();

	let originalSetLoads = $state(exercise.sets.map((set) => set.load));
	let isContextMenuOpen = $state(false);
	let muscleGroup = $derived(exercise.customMuscleGroup ?? exercise.targetMuscleGroup);
	let muscleLabel = $derived(
		exercise.targetMuscleGroup === 'Custom'
			? (exercise.customMuscleGroup ?? 'Custom')
			: convertCamelCaseToNormal(exercise.targetMuscleGroup)
	);

	async function skipSetsLeft() {
		exercise.sets.forEach((set) => {
			if (set.completed) return;
			set.skipped = true;
			set.miniSets.forEach((miniSet) => (miniSet.completed = false));
		});
		await workoutRunes.saveStoresToLocalStorage();
	}

	async function applyDeload(target: ManualDeloadTarget) {
		if (!(await workoutRunes.applyManualDeload(target))) return;
		isContextMenuOpen = false;
	}

	async function confirmDelete() {
		const ok = confirm(`Delete "${exercise.name}" from this workout?`);
		if (!ok) return;
		await workoutRunes.deleteExercise(idx);
		isContextMenuOpen = false;
	}
</script>

<div
	class="flex flex-col gap-1.5 rounded-xl border bg-[#11161d] p-2.5 transition-colors"
	class:border-[#6f882b]={activeTarget}
	class:bg-[#121a13]={activeTarget}
	class:border-[#252c34]={!activeTarget}
>
	<div class="flex items-start gap-2">
		<div class="mr-auto flex min-w-0 flex-col gap-0.5">
			<span
				class="inline-flex w-fit items-center rounded-md bg-[#1a2330] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#9db0c7]"
			>
				{muscleLabel}
			</span>
			<span class="truncate text-[15px] font-semibold leading-tight text-[#e9eef5]">{exercise.name}</span>
			<span class="text-xs leading-tight text-[#8fa0b3]">
				{exercise.sets.length}
				{convertCamelCaseToNormal(exercise.setType)}
			</span>
		</div>
		<div class="flex shrink-0 items-center gap-1">
			{#if activeTarget}
				<span
					class="rounded-md bg-[#263317] px-1.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#dff58e]"
					>Next</span
				>
			{/if}
			{#if exercise.bodyweightFraction !== null}
				<Badge class="h-5 px-1.5 text-[10px]" variant="outline">BW</Badge>
			{/if}
			{#if exercise.isDeload}
				<Badge class="h-5 px-1.5 text-[10px]" variant="outline">Deload</Badge>
			{/if}
			{#if !readOnly}
				{#if reordering}
					<div class="grid h-11 w-11 place-items-center" role="button" tabindex="0" use:dragHandle>
						<GripVertical class="h-4 w-4 text-[#9dadbe]" />
					</div>
				{:else}
					<DropdownMenu.Root onOpenChange={(v) => (isContextMenuOpen = v)} open={isContextMenuOpen}>
						<DropdownMenu.Trigger asChild let:builder>
							<button
								use:builder.action
								{...builder}
								class="grid h-11 w-11 place-items-center rounded-lg text-[#9dadbe] hover:bg-[#1b2430] hover:text-[#e9eef5]"
								data-testid="{exercise.name}-menu-button"
								aria-label="Exercise options"
							>
								<MenuIcon class="h-4 w-4" />
							</button>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content align="end">
							<DropdownMenu.Group>
								<DropdownMenu.Item class="gap-2" onclick={() => workoutRunes.setEditingExercise(exercise)}>
									<EditIcon /> Edit
								</DropdownMenu.Item>
								<DropdownMenu.Item class="gap-2" onclick={() => workoutRunes.openExerciseWarmupDialog(exercise)}>
									<ChartIcon /> Warm up
								</DropdownMenu.Item>
								<DropdownMenu.Item class="gap-2" onclick={skipSetsLeft}>
									<SkipIcon /> Skip sets left
								</DropdownMenu.Item>
								<DropdownMenu.Item
									class="gap-2"
									disabled={!workoutRunes.canApplyManualDeload({ exerciseName: exercise.name })}
									onclick={() => applyDeload({ exerciseName: exercise.name })}
								>
									<DeloadIcon /> Deload exercise
								</DropdownMenu.Item>
								<DropdownMenu.Item
									class="gap-2"
									disabled={!workoutRunes.canApplyManualDeload({ muscleGroup })}
									onclick={() => applyDeload({ muscleGroup })}
								>
									<DeloadIcon /> Deload {convertCamelCaseToNormal(muscleGroup)}
								</DropdownMenu.Item>
								<DropdownMenu.Item class="gap-2" onclick={() => workoutRunes.openExerciseHistorySheet(exercise.name)}>
									<HistoryIcon /> History
								</DropdownMenu.Item>
								<DropdownMenu.Item class="gap-2 text-red-500" onclick={confirmDelete}>
									<DeleteIcon /> Delete
								</DropdownMenu.Item>
							</DropdownMenu.Group>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				{/if}
			{/if}
		</div>
	</div>
	{#if exercise.note}
		<div class="rounded-md bg-[#1a2330] px-2 py-1 text-xs text-[#9dadbe]">
			{exercise.note}
		</div>
	{/if}
	{#if exercise.sets.length > 0 && !reordering}
		{#if comparing}
			<CompareComponent {exercise} />
		{:else}
			<SetsComponent {activeTarget} bind:originalSetLoads bind:exercise />
		{/if}
	{/if}
</div>
