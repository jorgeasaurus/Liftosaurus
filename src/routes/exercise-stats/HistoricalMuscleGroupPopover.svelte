<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Select from '$lib/components/ui/select';
	import type { RouterInputs, RouterOutputs } from '$lib/trpc/router';
	import { convertCamelCaseToNormal } from '$lib/utils.js';
	import { MuscleGroup, type MuscleGroup as MuscleGroupType } from '$lib/utils/prismaEnums.js';
	import { toast } from 'svelte-sonner';
	import MuscleGroupIcon from 'virtual:icons/lucide/biceps-flexed';
	import LoaderCircle from 'virtual:icons/lucide/loader-circle';

	type Exercise = {
		name: string;
		targetMuscleGroup: MuscleGroupType;
		customMuscleGroup: string | null;
	};
	type HistoricalMuscleGroupUpdateInput = RouterInputs['users']['updateHistoricalExerciseMuscleGroup'];
	type HistoricalMuscleGroupUpdateResult = RouterOutputs['users']['updateHistoricalExerciseMuscleGroup'];

	type Props = {
		exercise: Exercise | undefined;
		updateHistory: (input: HistoricalMuscleGroupUpdateInput) => Promise<HistoricalMuscleGroupUpdateResult | undefined>;
	};

	let { exercise, updateHistory }: Props = $props();
	let open = $state(false);
	let targetMuscleGroup: MuscleGroupType = $state(exercise?.targetMuscleGroup ?? 'Chest');
	let customMuscleGroup = $state(exercise?.customMuscleGroup ?? '');
	let status: 'idle' | 'submitting' | 'error' = $state('idle');
	let customMuscleGroupError = $state<string>();

	async function submitUpdate() {
		if (exercise === undefined || status === 'submitting') return;
		const normalizedCustomMuscleGroup = customMuscleGroup.trim();
		if (targetMuscleGroup === 'Custom' && normalizedCustomMuscleGroup.length === 0) {
			customMuscleGroupError = 'Enter a custom muscle group.';
			status = 'idle';
			return;
		}
		customMuscleGroupError = undefined;
		status = 'submitting';
		try {
			const input =
				targetMuscleGroup === 'Custom'
					? {
							exerciseName: exercise.name,
							targetMuscleGroup: 'Custom' as const,
							customMuscleGroup: normalizedCustomMuscleGroup
						}
					: {
							exerciseName: exercise.name,
							targetMuscleGroup,
							customMuscleGroup: null
						};
			const result = await updateHistory(input);
			if (!result) {
				status = 'idle';
				return;
			}
			const { count, exercise: updatedExercise } = result;
			targetMuscleGroup = updatedExercise.targetMuscleGroup;
			customMuscleGroup = updatedExercise.customMuscleGroup ?? '';
			toast.success(`Updated ${count} historical ${count === 1 ? 'performance' : 'performances'}`);
			status = 'idle';
			open = false;
		} catch {
			status = 'error';
		}
	}
</script>

<Popover.Root bind:open>
	<Popover.Trigger asChild let:builder>
		<Button
			builders={[builder]}
			size="icon"
			variant="secondary"
			aria-label="Change muscle group"
			class="shrink-0"
			disabled={exercise === undefined}
		>
			<MuscleGroupIcon />
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-[min(24rem,calc(100vw-2rem))]">
		<form
			class="flex flex-col gap-3"
			onsubmit={(event) => {
				event.preventDefault();
				void submitUpdate();
			}}
		>
			<div>
				<p class="font-semibold">Change historical muscle group</p>
				<p class="text-sm text-muted-foreground">
					Only completed workout history with this exact exercise name will change.
				</p>
				<p class="text-sm text-muted-foreground">Templates, future workouts, and cyclic set changes stay unchanged.</p>
			</div>
			<Select.Root
				name="historical-target-muscle-group"
				onSelectedChange={(selection) => {
					if (!selection) return;
					targetMuscleGroup = selection.value;
					if (selection.value !== 'Custom') customMuscleGroup = '';
					customMuscleGroupError = undefined;
					status = 'idle';
				}}
				required
				selected={{
					value: targetMuscleGroup,
					label: convertCamelCaseToNormal(targetMuscleGroup)
				}}
			>
				<Select.Label class="p-0 text-sm font-medium leading-none">Target muscle group</Select.Label>
				<Select.Trigger aria-label="Target muscle group">
					<Select.Value placeholder="Pick one" />
				</Select.Trigger>
				<Select.Content class="h-48 overflow-y-auto">
					{#each Object.values(MuscleGroup) as muscleGroup}
						<Select.Item label={convertCamelCaseToNormal(muscleGroup)} value={muscleGroup} />
					{/each}
				</Select.Content>
			</Select.Root>
			{#if targetMuscleGroup === 'Custom'}
				<div class="flex flex-col gap-1.5">
					<Label for="historical-custom-muscle-group">Custom muscle group</Label>
					<Input
						id="historical-custom-muscle-group"
						required
						aria-invalid={customMuscleGroupError !== undefined}
						aria-describedby={customMuscleGroupError ? 'historical-custom-muscle-group-error' : undefined}
						oninput={() => {
							customMuscleGroupError = undefined;
							status = 'idle';
						}}
						bind:value={customMuscleGroup}
					/>
					{#if customMuscleGroupError}
						<p id="historical-custom-muscle-group-error" role="alert" class="text-sm text-destructive">
							{customMuscleGroupError}
						</p>
					{/if}
				</div>
			{/if}
			{#if status === 'error'}
				<div role="alert" class="muted-text-box flex items-center justify-between gap-2">
					<span>Could not update workout history.</span>
					<Button type="button" size="sm" onclick={submitUpdate}>Retry update</Button>
				</div>
			{/if}
			<Button type="submit" disabled={status === 'submitting'}>
				{#if status === 'submitting'}
					<LoaderCircle class="animate-spin" /> Updating
				{:else}
					Update workout history
				{/if}
			</Button>
		</form>
	</Popover.Content>
</Popover.Root>
