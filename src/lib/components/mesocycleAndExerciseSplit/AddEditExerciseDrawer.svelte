<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Command from '$lib/components/ui/command';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Popover from '$lib/components/ui/popover';
	import * as Select from '$lib/components/ui/select';
	import * as Sheet from '$lib/components/ui/sheet';
	import { Switch } from '$lib/components/ui/switch';
	import { Textarea } from '$lib/components/ui/textarea';
	import { trpc } from '$lib/trpc/client';
	import { convertCamelCaseToNormal } from '$lib/utils';
	import { buildExerciseCatalog, isBuiltInExerciseName, type ExerciseCatalogItem } from '$lib/utils/exerciseCatalog';
	import { ChangeType, MuscleGroup, ProgressionVariable, RepRangeMode, SetType } from '$lib/utils/prismaEnums';
	import type { Mesocycle } from '@prisma/client';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import CheckIcon from 'virtual:icons/lucide/check';
	import ChevronLeft from 'virtual:icons/lucide/chevron-left';
	import ChevronRight from 'virtual:icons/lucide/chevron-right';
	import FilterIcon from 'virtual:icons/lucide/filter';
	import AddIcon from 'virtual:icons/lucide/plus';
	import XIcon from 'virtual:icons/lucide/x';
	import type {
		MesocycleExerciseTemplateWithoutIdsOrIndex,
		SplitExerciseTemplateWithoutIdsOrIndex
	} from './commonTypes';

	type CommonProps<T> = {
		editingExercise: T | undefined;
		addExercise: (exercise: T) => boolean | Promise<boolean>;
		setEditingExercise: (exercise: undefined) => void;
		editExercise: (exercise: T) => boolean | Promise<boolean>;
	};

	type CatalogExerciseTemplate = SplitExerciseTemplateWithoutIdsOrIndex & { id?: string };

	type PropsType =
		| ({ context: 'exerciseSplit' } & CommonProps<SplitExerciseTemplateWithoutIdsOrIndex>)
		| ({ context: 'catalog' } & CommonProps<CatalogExerciseTemplate>)
		| ({
				context: 'mesocycle';
				mesocycle: Mesocycle;
		  } & CommonProps<MesocycleExerciseTemplateWithoutIdsOrIndex & { isUserExercise?: boolean }>)
		| ({
				context: 'workout';
				mesocycle?: Mesocycle;
		  } & CommonProps<MesocycleExerciseTemplateWithoutIdsOrIndex & { isUserExercise?: boolean }>);

	type NonUndefined<T> = T extends undefined ? never : T;
	type FullExerciseTemplate = NonUndefined<PropsType['editingExercise']>;

	let { ...props }: PropsType = $props();
	const mesocycle = $derived(props.context === 'mesocycle' || props.context === 'workout' ? props.mesocycle : undefined);
	let allGroupedExercises = $state(buildExerciseCatalog());

	onMount(async () => {
		allGroupedExercises = buildExerciseCatalog(await trpc().workouts.getUserExercises.query('minimal'));
	});

	async function refreshCatalog() {
		allGroupedExercises = buildExerciseCatalog(await trpc().workouts.getUserExercises.query('minimal'));
	}

	async function persistCustomExercise(exercise: Pick<FullExerciseTemplate, 'name'> & Partial<FullExerciseTemplate>) {
		if (!exercise.name || isBuiltInExerciseName(exercise.name)) return;
		await trpc().customExercises.upsert.mutate({
			name: exercise.name,
			targetMuscleGroup: exercise.targetMuscleGroup!,
			customMuscleGroup: exercise.customMuscleGroup ?? null,
			bodyweightFraction: exercise.bodyweightFraction ?? null,
			setType: exercise.setType,
			repRangeStart: exercise.repRangeStart,
			repRangeEnd: exercise.repRangeEnd,
			changeType: exercise.changeType ?? null,
			changeAmount: exercise.changeAmount ?? null,
			note: exercise.note ?? null
		});
		await refreshCatalog();
	}

	const extraMesocycleProps: Partial<MesocycleExerciseTemplateWithoutIdsOrIndex> = {
		sets: undefined,
		overloadPercentage: null,
		forceRIRMatching: null,
		lastSetToFailure: null,
		minimumWeightChange: null,
		preferredProgressionVariable: null,
		repRangeMode: null,
		adaptiveRepRangeStart: null,
		adaptiveRepRangeEnd: null,
		adaptiveTopRepRangeStart: null,
		adaptiveTopRepRangeEnd: null,
		adaptiveRepRangeSourceId: null,
		adaptiveTopRepRangeSourceId: null,
		adaptiveRepRangeResetAt: null
	};

	const defaultExercise: Partial<FullExerciseTemplate> = {
		name: '',
		setType: 'Straight',
		bodyweightFraction: null,
		...(props.context !== 'exerciseSplit' && props.context !== 'catalog' && structuredClone(extraMesocycleProps))
	};

	let open = $state(false);
	let overridesSheetOpen = $state(false);
	let mode = $derived(props.editingExercise === undefined ? 'Add' : 'Edit');
	let searching = $state(false);
	let currentExercise: Partial<FullExerciseTemplate> = $state(structuredClone(defaultExercise));
	let selectedMuscleGroups = $state<string[]>([]);
	let filterOpen = $state(false);

	let filteredExercises = $derived(
		allGroupedExercises
			.filter(
				(exercisesForMuscleGroup) =>
					selectedMuscleGroups.length === 0 || selectedMuscleGroups.includes(exercisesForMuscleGroup.muscleGroup)
			)
			.map((exercisesForMuscleGroup) => ({
				muscleGroup: exercisesForMuscleGroup.muscleGroup,
				exercises: exercisesForMuscleGroup.exercises.filter((ex) =>
					(currentExercise.name ?? '').trim() === ''
						? true
						: ex.name.toLowerCase().includes(currentExercise.name?.toLowerCase() ?? '')
				)
			}))
			.filter((group) => group.exercises.length > 0)
	);

	$effect(() => {
		if (props.editingExercise) {
			currentExercise = structuredClone($state.snapshot(props.editingExercise));
			open = true;
		}
	});

	function selectExercise(exercise: ExerciseCatalogItem) {
		const { type: _, ...template } = exercise;
		currentExercise = structuredClone({
			...defaultExercise,
			...template,
			...(props.context !== 'exerciseSplit' && props.context !== 'catalog' && structuredClone(extraMesocycleProps))
		});
		searching = false;
	}

	function resetDrawerState() {
		props.setEditingExercise(undefined);
		currentExercise = structuredClone(defaultExercise);
	}

	async function submitForm(e: SubmitEvent) {
		e.preventDefault();
		let result = false;
		if ('isUserExercise' in currentExercise) {
			delete currentExercise.isUserExercise;
		}
		const finishedExercise = currentExercise as NonUndefined<typeof props.editingExercise>;
		if ('sets' in finishedExercise) {
			if (mode === 'Add') result = await props.addExercise(finishedExercise);
			else result = await props.editExercise(finishedExercise);
		} else if (props.context === 'exerciseSplit' || props.context === 'catalog') {
			if (mode === 'Add') result = await props.addExercise(finishedExercise);
			else result = await props.editExercise(finishedExercise);
		}

		if (!result) {
			toast.error('Exercise names should be unique');
			return;
		}
		if (props.context !== 'catalog') {
			try {
				await persistCustomExercise(finishedExercise);
			} catch {
				toast.error('Saved in this plan, but the custom exercise could not be added to your private catalog');
			}
		}
		resetDrawerState();
		open = false;
	}

	function submitOverrides(e: SubmitEvent) {
		e.preventDefault();
		overridesSheetOpen = false;
	}

	function toggleMuscleGroup(muscleGroup: string) {
		if (selectedMuscleGroups.includes(muscleGroup)) {
			selectedMuscleGroups = selectedMuscleGroups.filter((g) => g !== muscleGroup);
		} else {
			selectedMuscleGroups = [...selectedMuscleGroups, muscleGroup];
		}
	}
</script>

<Sheet.Root closeOnOutsideClick={false} onOpenChange={(o) => !o && props.setEditingExercise(undefined)} bind:open>
	<Sheet.Trigger asChild let:builder>
		<Button
			class="h-11 w-11"
			aria-label="add-exercise"
			builders={[builder]}
			onclick={resetDrawerState}
			size="icon"
			variant="outline"
		>
			<AddIcon />
		</Button>
	</Sheet.Trigger>
	<Sheet.Content class="w-11/12 overflow-y-auto px-4" side="right">
		<Sheet.Header>
			<Sheet.Title>{mode} exercise</Sheet.Title>
		</Sheet.Header>
		<form class="mt-8 grid h-fit grid-cols-2 gap-x-2 gap-y-4" onsubmit={submitForm}>
			<div class="col-span-2 flex w-full flex-col gap-1.5">
				<span class="text-sm font-medium">Exercise name</span>
				<Command.Root class="flex-1 bg-background" shouldFilter={false}>
					<div class="flex w-full items-center justify-between">
						<Command.Input
							class="w-full pr-10"
							onfocus={() => (searching = true)}
							placeholder="Type here or search..."
							required
							bind:value={currentExercise.name}
						/>
						<Popover.Root bind:open={filterOpen}>
							<Popover.Trigger>
								<Button
									variant={selectedMuscleGroups.length > 0 ? 'default' : 'outline'}
									size="icon"
									type="button"
									class="ml-2 flex h-10 w-10 items-center justify-center p-0"
								>
									<FilterIcon class="h-5 w-5" />
								</Button>
							</Popover.Trigger>
							<Popover.Content class="w-80 p-4" side="top" align="start">
								<div class="flex flex-col gap-4">
									<h4 class="font-medium leading-none">Filter by muscle group</h4>
									<div class="grid grid-cols-2 gap-2">
										{#each allGroupedExercises.filter((g) => g.exercises.length > 0) as group}
											<Button
												variant={selectedMuscleGroups.includes(group.muscleGroup) ? 'default' : 'outline'}
												class="justify-start"
												onclick={() => toggleMuscleGroup(group.muscleGroup)}
											>
												{convertCamelCaseToNormal(group.muscleGroup)}
											</Button>
										{/each}
									</div>
									<div class="flex justify-between">
										<Button
											variant="destructive"
											class="gap-2"
											onclick={() => {
												selectedMuscleGroups = [];
												filterOpen = false;
											}}
										>
											<XIcon />
											Clear
										</Button>
										<Button class="gap-2" onclick={() => (filterOpen = false)}>
											Done
											<CheckIcon />
										</Button>
									</div>
								</div>
							</Popover.Content>
						</Popover.Root>
					</div>
					{#if searching}
						<Command.List class="max-h-32 w-full bg-muted">
							{#each filteredExercises as exercisesForMuscleGroup}
								{#if exercisesForMuscleGroup.exercises.length > 0}
									<Command.Group heading={exercisesForMuscleGroup.muscleGroup}>
										{#each exercisesForMuscleGroup.exercises as exercise}
											<Command.Item onSelect={() => selectExercise(exercise)}>
												{exercise.name}
												{#if exercise.type === 'personal'}
													<span class="text-xs italic text-muted-foreground">&nbsp;(user)</span>
												{/if}
											</Command.Item>
										{/each}
									</Command.Group>
								{/if}
							{/each}
						</Command.List>
					{/if}
				</Command.Root>
			</div>
			<div
				class="flex w-full flex-col gap-1.5 {currentExercise.targetMuscleGroup === 'Custom'
					? 'col-span-1'
					: 'col-span-2'}"
			>
				<Select.Root
					name="exercise-target-muscle-group"
					onSelectedChange={(v) => {
						currentExercise.targetMuscleGroup = v?.value;
						if (v?.value !== 'Custom') currentExercise.customMuscleGroup = null;
					}}
					required
					selected={{
						value: currentExercise.targetMuscleGroup,
						label: convertCamelCaseToNormal(currentExercise.targetMuscleGroup)
					}}
				>
					<Select.Label class="p-0 text-sm font-medium leading-none">Target muscle group</Select.Label>
					<Select.Trigger>
						<Select.Value placeholder="Pick one" />
					</Select.Trigger>
					<Select.Content class="h-48 overflow-y-auto">
						{#each Object.values(MuscleGroup) as muscleGroup}
							<Select.Item label={convertCamelCaseToNormal(muscleGroup)} value={muscleGroup} />
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
			{#if currentExercise.targetMuscleGroup === 'Custom'}
				<div class="flex w-full flex-col gap-1.5">
					<Label for="exercise-custom-muscle-group">Muscle group</Label>
					<Input
						id="exercise-custom-muscle-group"
						placeholder="Type here"
						required
						bind:value={currentExercise.customMuscleGroup}
					/>
				</div>
			{/if}
			{#if props.context !== 'exerciseSplit' && 'sets' in currentExercise}
				<div class="flex w-full flex-col gap-1.5">
					<Label for="exercise-sets">Sets</Label>
					<Input
						id="exercise-sets"
						min={0}
						placeholder="Type here"
						required
						type="number"
						bind:value={currentExercise.sets}
					/>
				</div>
				<div class="flex flex-col gap-1.5">
					<span class="text-sm font-medium leading-none">Progression</span>
					<Button class="gap-2" onclick={() => (overridesSheetOpen = true)} variant="secondary">
						<span class="pointer-events-none">Overrides</span>
						<ChevronRight class="pointer-events-none" />
					</Button>
				</div>
			{/if}
			<div class="flex w-full flex-col gap-1.5">
				<Label
					for={currentExercise.bodyweightFraction !== null
						? 'exercise-bodyweight-fraction'
						: 'exercise-involves-bodyweight'}>Bodyweight fraction</Label
				>
				<div class="flex gap-0.5">
					{#if currentExercise.bodyweightFraction !== null}
						<Input
							id="exercise-bodyweight-fraction"
							min={0.01}
							placeholder="Fraction"
							required
							step={0.01}
							type="number"
							bind:value={currentExercise.bodyweightFraction}
						/>
					{/if}
					<div class="flex grow items-center rounded-md border px-2 py-1.5">
						<Switch
							id="exercise-involves-bodyweight"
							name="exercise-involves-bodyweight"
							checked={currentExercise.bodyweightFraction !== null}
							includeInput
							onCheckedChange={(c) => {
								currentExercise.bodyweightFraction = c ? undefined : null;
							}}
						/>
					</div>
				</div>
			</div>
			<div class="flex w-full flex-col gap-1.5">
				{#key currentExercise}
					<Select.Root
						name="exercise-set-type"
						onSelectedChange={(v) => (currentExercise.setType = v?.value ?? 'Straight')}
						required
						selected={{
							value: currentExercise.setType,
							label: convertCamelCaseToNormal(currentExercise.setType)
						}}
					>
						<Select.Label class="p-0 text-sm font-medium leading-none">Set type</Select.Label>
						<Select.Trigger>
							<Select.Value placeholder="Pick one" />
						</Select.Trigger>
						<Select.Content>
							{#each Object.values(SetType) as setTemplate}
								<Select.Item label={convertCamelCaseToNormal(setTemplate)} value={setTemplate} />
							{/each}
						</Select.Content>
					</Select.Root>
				{/key}
			</div>
			{#if currentExercise.setType === 'Drop' || currentExercise.setType === 'Down' || currentExercise.setType === 'MyorepMatchDown'}
				<div class="flex w-full flex-col gap-1.5">
					<Select.Root
						name="exercise-set-change-type"
						onSelectedChange={(v) => {
							if (
								currentExercise.setType === 'Drop' ||
								currentExercise.setType === 'Down' ||
								currentExercise.setType === 'MyorepMatchDown'
							)
								currentExercise.changeType = v?.value ?? 'Percentage';
						}}
						required
						selected={{
							value: currentExercise.changeType,
							label: convertCamelCaseToNormal(currentExercise.changeType)
						}}
					>
						<Select.Label class="p-0 text-sm font-medium leading-none">Load change type</Select.Label>
						<Select.Trigger>
							<Select.Value placeholder="Pick one" />
						</Select.Trigger>
						<Select.Content>
							{#each Object.values(ChangeType) as changeType}
								<Select.Item label={convertCamelCaseToNormal(changeType)} value={changeType} />
							{/each}
						</Select.Content>
					</Select.Root>
				</div>
				<div class="flex w-full flex-col gap-1.5">
					<Label for="exercise-rep-range-end">Load change</Label>
					<Input
						id="exercise-set-decrement"
						placeholder="Type here"
						required
						step={0.5}
						type="number"
						bind:value={currentExercise.changeAmount}
					/>
				</div>
			{/if}
			{#if currentExercise.setType === 'TopBackoff'}
				<div class="flex w-full flex-col gap-1.5">
					<Label for="exercise-top-rep-range-start">Top set rep range start</Label>
					<Input
						id="exercise-top-rep-range-start"
						min={1}
						placeholder="Type here"
						required
						type="number"
						bind:value={currentExercise.topRepRangeStart}
					/>
				</div>
				<div class="flex w-full flex-col gap-1.5">
					<Label for="exercise-top-rep-range-end">Top set rep range end</Label>
					<Input
						id="exercise-top-rep-range-end"
						min={(currentExercise.topRepRangeStart ?? 0) + 1}
						placeholder="Type here"
						required
						type="number"
						bind:value={currentExercise.topRepRangeEnd}
					/>
				</div>
			{/if}
			<div class="flex w-full flex-col gap-1.5">
				<Label for="exercise-rep-range-start">
					{#if currentExercise.setType === 'TopBackoff'}
						Backoff sets rep range start
					{:else}
						Rep range start
					{/if}
				</Label>
				<Input
					id="exercise-rep-range-start"
					min={1}
					placeholder="Type here"
					required
					type="number"
					bind:value={currentExercise.repRangeStart}
				/>
			</div>
			<div class="flex w-full flex-col gap-1.5">
				<Label for="exercise-rep-range-end">
					{#if currentExercise.setType === 'TopBackoff'}
						Backoff sets rep range end
					{:else}
						Rep range end
					{/if}
				</Label>
				<Input
					id="exercise-rep-range-end"
					min={(currentExercise.repRangeStart ?? 0) + 1}
					placeholder="Type here"
					required
					type="number"
					bind:value={currentExercise.repRangeEnd}
				/>
			</div>
			<div class="col-span-2 flex w-full flex-col gap-1.5">
				<Label for="exercise-note">Note</Label>
				<Textarea
					id="exercise-note"
					class="resize-none"
					placeholder="Exercise cues, machine heights, etc."
					bind:value={currentExercise.note as string}
				/>
			</div>
			<Button class="col-span-2" type="submit">{mode} exercise</Button>
		</form>
	</Sheet.Content>
</Sheet.Root>

{#if props.context !== 'exerciseSplit' && 'sets' in currentExercise}
	<Sheet.Root closeOnOutsideClick={false} bind:open={overridesSheetOpen}>
		<Sheet.Content class="w-10/12 overflow-y-auto px-4">
			<Sheet.Header>
				<Sheet.Title>Overrides</Sheet.Title>
				<Sheet.Description>
					Exercise progressions are based on the mesocycle by default, you can override (customize) them here for each
					exercise
				</Sheet.Description>
			</Sheet.Header>
			<form class="mt-8 grid h-fit gap-x-2 gap-y-4" onsubmit={submitOverrides}>
				<div class="flex flex-col gap-1.5">
					<Select.Root
						name="exercise-rep-range-mode"
						onSelectedChange={(value) => {
							if (!('sets' in currentExercise)) return;
							currentExercise.repRangeMode =
								value?.value === 'Fixed' || value?.value === 'Adaptive' ? value.value : null;
						}}
						selected={{
							value: currentExercise.repRangeMode ?? 'Inherit',
							label: currentExercise.repRangeMode ? `${currentExercise.repRangeMode} rep ranges` : 'Mesocycle default'
						}}
					>
						<Select.Label class="p-0 text-sm font-medium leading-none">Rep range strategy</Select.Label>
						<Select.Trigger><Select.Value /></Select.Trigger>
						<Select.Content>
							<Select.Item label="Mesocycle default" value="Inherit" />
							{#each Object.values(RepRangeMode) as mode}
								<Select.Item label={`${mode} rep ranges`} value={mode} />
							{/each}
						</Select.Content>
					</Select.Root>
				</div>
				<div class="flex flex-col gap-1.5">
					<Select.Root
						name="exercise-preferred-progression-variable"
						onSelectedChange={(value) => {
							if (!('sets' in currentExercise)) return;
							currentExercise.preferredProgressionVariable =
								value?.value === 'Reps' || value?.value === 'Load' ? value.value : null;
						}}
						selected={{
							value: currentExercise.preferredProgressionVariable ?? 'Inherit',
							label:
								currentExercise.preferredProgressionVariable === null ||
								currentExercise.preferredProgressionVariable === undefined
									? 'Mesocycle default'
									: `${currentExercise.preferredProgressionVariable} first`
						}}
					>
						<Select.Label class="p-0 text-sm font-medium leading-none">Progression priority</Select.Label>
						<Select.Trigger>
							<Select.Value />
						</Select.Trigger>
						<Select.Content>
							<Select.Item label="Mesocycle default" value="Inherit" />
							{#each Object.values(ProgressionVariable) as progressionVariable}
								<Select.Item label={`${progressionVariable} first`} value={progressionVariable} />
							{/each}
						</Select.Content>
					</Select.Root>
				</div>
				<div class="flex flex-col gap-1">
					<div class="flex items-center justify-between">
						<Label for="exercise-minimum-weight-change-value">Minimum weight change</Label>
						<Checkbox
							id="exercise-override-minimum-weight-change"
							checked={currentExercise.minimumWeightChange !== null}
							onCheckedChange={(c) => {
								if (c !== 'indeterminate' && 'sets' in currentExercise)
									currentExercise.minimumWeightChange = c ? undefined : null;
							}}
						/>
					</div>
					<Input
						id="exercise-minimum-weight-change-value"
						disabled={currentExercise.minimumWeightChange === null}
						placeholder="5"
						required
						step={0.5}
						type="number"
						bind:value={currentExercise.minimumWeightChange}
					/>
				</div>
				<div class="flex flex-col gap-1">
					<div class="flex items-center justify-between">
						<Label for="exercise-override-overload-percentage-value">Overload percentage</Label>
						<Checkbox
							id="exercise-override-overload-percentage"
							checked={currentExercise.overloadPercentage !== null}
							onCheckedChange={(c) => {
								if (c !== 'indeterminate' && 'sets' in currentExercise)
									currentExercise.overloadPercentage = c ? undefined : null;
							}}
						/>
					</div>
					<Input
						id="exercise-override-overload-percentage-value"
						disabled={currentExercise.overloadPercentage === null}
						placeholder={mesocycle?.startOverloadPercentage.toString()}
						required
						step={0.1}
						type="number"
						bind:value={currentExercise.overloadPercentage}
					/>
				</div>
				<div class="flex flex-col gap-1">
					<div class="flex items-center justify-between">
						<Label for="exercise-override-force-RIR-matching-value">Force RIR matching</Label>
						<Checkbox
							id="exercise-override-force-RIR-matching"
							checked={currentExercise.forceRIRMatching !== null}
							onCheckedChange={(c) => {
								if (c !== 'indeterminate' && 'sets' in currentExercise)
									currentExercise.forceRIRMatching = c ? mesocycle?.forceRIRMatching : null;
							}}
						/>
					</div>
					{#key currentExercise.forceRIRMatching === null}
						<div class="flex items-center rounded-md border px-2 py-1.5">
							<Switch
								id="exercise-override-force-RIR-matching-value"
								name="exercise-override-force-RIR-matching-value"
								checked={currentExercise.forceRIRMatching ?? mesocycle?.forceRIRMatching}
								disabled={currentExercise.forceRIRMatching === null}
								onCheckedChange={(c) => {
									if ('sets' in currentExercise) currentExercise.forceRIRMatching = c;
								}}
							/>
						</div>
					{/key}
				</div>
				<div class="flex flex-col gap-1">
					<div class="flex items-center justify-between">
						<Label for="exercise-override-last-set-to-failure-value">Last set to failure</Label>
						<Checkbox
							id="exercise-override-last-set-to-failure"
							checked={currentExercise.lastSetToFailure !== null}
							onCheckedChange={(c) => {
								if (c !== 'indeterminate' && 'sets' in currentExercise)
									currentExercise.lastSetToFailure = c ? mesocycle?.lastSetToFailure : null;
							}}
						/>
					</div>
					{#key currentExercise.lastSetToFailure === null}
						<div class="flex items-center rounded-md border px-2 py-1.5">
							<Switch
								id="exercise-override-last-set-to-failure-value"
								name="exercise-override-last-set-to-failure-value"
								checked={currentExercise.lastSetToFailure ?? mesocycle?.lastSetToFailure}
								disabled={currentExercise.lastSetToFailure === null}
								onCheckedChange={(c) => {
									if ('sets' in currentExercise) currentExercise.lastSetToFailure = c;
								}}
							/>
						</div>
					{/key}
				</div>
				<Button class="gap-2" type="submit" variant="secondary">
					<ChevronLeft />
					Basics
				</Button>
			</form>
		</Sheet.Content>
	</Sheet.Root>
{/if}
