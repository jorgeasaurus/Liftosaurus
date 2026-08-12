<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Popover from '$lib/components/ui/popover';
	import { Separator } from '$lib/components/ui/separator';
	import { arraySum, floorToNearestMultiple } from '$lib/utils';
	import {
		cleanupInProgressMiniSets,
		getPreviousBodyweightFraction,
		markWorkoutExerciseStarted,
		solveBergerFormula,
		type WorkoutExerciseInProgress
	} from '$lib/utils/workoutUtils';
	import CheckIcon from 'virtual:icons/lucide/check';
	import ArrowDownIcon from 'virtual:icons/lucide/chevron-down';
	import BelowTargetIcon from 'virtual:icons/lucide/arrow-down';
	import AtTargetIcon from 'virtual:icons/lucide/equal';
	import AboveTargetIcon from 'virtual:icons/lucide/arrow-up';
	import RemoveIcon from 'virtual:icons/lucide/minus';
	import EditIcon from 'virtual:icons/lucide/pencil';
	import AddIcon from 'virtual:icons/lucide/plus';
	import TargetIcon from 'virtual:icons/lucide/target';
	import UndoIcon from 'virtual:icons/lucide/undo';
	import { workoutRunes } from '../../workoutRunes.svelte';

	type PropsType = {
		exercise: WorkoutExerciseInProgress;
		originalSetLoads: (number | undefined)[];
	};
	type WorkoutExerciseSet = WorkoutExerciseInProgress['sets'][number];
	let { exercise = $bindable(), originalSetLoads = $bindable() }: PropsType = $props();

	let isSameLoadExercise = $derived(['Straight', 'Myorep', 'MyorepMatch'].includes(exercise.setType));
	let lastSharedLoad = $state(exercise.sets[0]?.load);
	let hasEditableRIRTargets = $derived(
		exercise.sets.some((set) => !set.skipped && (!set.completed || set.miniSets.some((miniSet) => !miniSet.completed)))
	);
	let sharedRIR = $derived.by(() => {
		for (const set of exercise.sets) {
			if (set.skipped) continue;
			const incompleteMiniSet = set.miniSets.find((miniSet) => !miniSet.completed);
			if (hasValidRIR(incompleteMiniSet?.RIR)) return incompleteMiniSet.RIR;
			if (!set.completed && hasValidRIR(set.RIR)) return set.RIR;
		}
		if (hasEditableRIRTargets) return;
		for (const set of exercise.sets) {
			if (set.skipped) continue;
			if (hasValidRIR(set.RIR)) return set.RIR;
			const miniSetRIR = set.miniSets.find((miniSet) => hasValidRIR(miniSet.RIR))?.RIR;
			if (hasValidRIR(miniSetRIR)) return miniSetRIR;
		}
	});
	let oldBodyweightFraction = $derived(
		getPreviousBodyweightFraction(
			workoutRunes.previousWorkoutData?.exercises,
			exercise.name,
			exercise.bodyweightFraction ?? null
		)
	);
	let previousUserBodyweight = $derived(
		workoutRunes.previousWorkoutData?.exercises.find((previousExercise) => previousExercise.name === exercise.name)
			?.userBodyweight
	);

	function hasValidRIR(RIR: number | undefined): RIR is number {
		return RIR !== undefined && Number.isInteger(RIR) && RIR >= 0;
	}

	async function completeSet(e: SubmitEvent, set: WorkoutExerciseSet, idx: number) {
		e.preventDefault();
		if (set.skipped) {
			set.skipped = false;
			await workoutRunes.saveStoresToLocalStorage();
			return;
		}
		if (!set.completed && !hasValidRIR(set.RIR)) return;
		if (!set.completed) markWorkoutExerciseStarted(exercise);
		set.completed = !set.completed;
		if (isSameLoadExercise && idx === 0) {
			exercise.sets.forEach((otherSet, otherSetIdx) => {
				if (otherSetIdx > 0 && (otherSet.load === undefined || otherSet.load === lastSharedLoad))
					otherSet.load = set.load;
			});
			lastSharedLoad = set.load;
		}

		await workoutRunes.saveStoresToLocalStorage();
	}

	function shouldMiniSetBeDisabled(setIndex: number, miniSetIndex: number) {
		const parentSet = exercise.sets[setIndex];
		if (miniSetIndex === 0) return !parentSet.completed;
		return !parentSet.miniSets[miniSetIndex - 1].completed;
	}

	function addMiniSet(setIndex: number) {
		let load: undefined | number;
		if (exercise.setType === 'MyorepMatch') load = exercise.sets[0].load;
		if (exercise.setType === 'MyorepMatchDown') load = exercise.sets[setIndex].load;
		exercise.sets[setIndex].miniSets.push({
			completed: false,
			reps: undefined,
			load,
			RIR: hasValidRIR(sharedRIR) ? sharedRIR : undefined
		});
	}

	async function completeMiniSet(e: SubmitEvent, set: WorkoutExerciseSet, miniSetIndex: number) {
		e.preventDefault();
		if (exercise.setType === 'MyorepMatchDown') set.miniSets[miniSetIndex].load = set.load;
		if (!set.miniSets[miniSetIndex].completed && !hasValidRIR(set.miniSets[miniSetIndex].RIR)) return;
		if (!set.miniSets[miniSetIndex].completed) markWorkoutExerciseStarted(exercise);
		set.miniSets[miniSetIndex].completed = !set.miniSets[miniSetIndex].completed;
		await workoutRunes.saveStoresToLocalStorage();
	}

	function calculateNextLoad(setIdx: number) {
		const firstSet = exercise.sets[0];
		if (typeof firstSet.load !== 'number') return 0;
		if (!exercise.changeType || setIdx === 0) return 0;
		if (exercise.changeAmount === null || exercise.changeAmount === undefined) return 0;

		if (exercise.setType === 'Down') setIdx = -setIdx;
		if (exercise.changeType === 'AbsoluteLoad') {
			return firstSet.load + setIdx * exercise.changeAmount;
		}
		return firstSet.load * (1 + setIdx * (exercise.changeAmount / 100));
	}

	function getNextLoad(setIdx: number) {
		if (!['Down'].includes(exercise.setType)) return;
		if (typeof exercise.sets[0].load !== 'number') return;
		return floorToNearestMultiple(calculateNextLoad(setIdx), exercise.minimumWeightChange ?? 5).toString();
	}

	function getRemainingMyorepMatchReps(setIdx: number) {
		const firstSet = exercise.sets[0];
		const set = exercise.sets[setIdx];
		if (firstSet.reps === undefined) return;
		if (set.reps === undefined) return firstSet.reps;
		return firstSet.reps - set.reps - arraySum(set.miniSets.map((miniSet) => miniSet.reps ?? 0));
	}

	function getMiniSetLoad(setIdx: number, miniSetIdx: number) {
		if (exercise.setType !== 'Drop') return;
		if (exercise.changeAmount === null || exercise.changeAmount === undefined) return;
		let set = exercise.sets[setIdx];

		if (typeof set.load === 'number') {
			if (exercise.changeType === 'AbsoluteLoad') return set.load - (miniSetIdx + 1) * exercise.changeAmount;
			return set.load * (1 - (miniSetIdx + 1) * (exercise.changeAmount / 100));
		}
	}

	function updateSetLoad(set: WorkoutExerciseSet, value: string) {
		if (value.trim() === '') {
			set.load = undefined;
			return;
		}
		const load = Number(value);
		const allowsZeroLoad = Boolean(exercise.bodyweightFraction);
		set.load = Number.isFinite(load) && (load > 0 || (allowsZeroLoad && load === 0)) ? load : undefined;
		if (set.completed || set.load === undefined || typeof set.plannedReps !== 'number' || typeof set.RIR !== 'number')
			return;

		const oldLoad = originalSetLoads[exercise.sets.indexOf(set)];
		if (typeof oldLoad !== 'number' || oldLoad < 0) return;
		const estimatedReps = solveBergerFormula({
			variableToSolve: 'NewReps',
			knownValues: {
				oldSet: {
					reps: set.plannedReps,
					load: oldLoad,
					RIR: set.RIR,
					miniSets: cleanupInProgressMiniSets(set.miniSets)
				},
				newSet: { load: set.load, RIR: set.RIR, miniSets: cleanupInProgressMiniSets(set.miniSets) },
				oldUserBodyweight: previousUserBodyweight,
				newUserBodyweight: workoutRunes.workoutData?.userBodyweight as number,
				oldBodyweightFraction,
				newBodyweightFraction: exercise.bodyweightFraction ?? null,
				overloadPercentage: 0
			}
		});
		set.reps = Math.max(1, Math.round(estimatedReps));
	}

	function getExpectedReps(set: WorkoutExerciseSet) {
		if (typeof set.load !== 'number' || typeof set.plannedReps !== 'number' || typeof set.RIR !== 'number') {
			return set.plannedReps;
		}
		const oldLoad = originalSetLoads[exercise.sets.indexOf(set)];
		if (typeof oldLoad !== 'number' || oldLoad < 0 || oldLoad === set.load) return set.plannedReps;

		const estimatedReps = solveBergerFormula({
			variableToSolve: 'NewReps',
			knownValues: {
				oldSet: {
					reps: set.plannedReps,
					load: oldLoad,
					RIR: set.RIR,
					miniSets: cleanupInProgressMiniSets(set.miniSets)
				},
				newSet: { load: set.load, RIR: set.RIR, miniSets: cleanupInProgressMiniSets(set.miniSets) },
				oldUserBodyweight: previousUserBodyweight,
				newUserBodyweight: workoutRunes.workoutData?.userBodyweight as number,
				oldBodyweightFraction,
				newBodyweightFraction: exercise.bodyweightFraction ?? null,
				overloadPercentage: 0
			}
		});
		return Math.max(1, Math.round(estimatedReps));
	}

	function getRepTargetLabel(delta: number) {
		if (delta === 0) return 'Reps matched expected';
		const difference = Math.abs(delta);
		return `${difference} ${difference === 1 ? 'rep' : 'reps'} ${delta > 0 ? 'above' : 'below'} expected`;
	}

	function getRepTargetDelta(set: WorkoutExerciseSet, setIdx: number) {
		if (!set.completed || typeof set.reps !== 'number') return;
		const isTopSet = exercise.setType === 'TopBackoff' && setIdx === 0;
		const rangeStart = isTopSet ? (exercise.topRepRangeStart ?? exercise.repRangeStart) : exercise.repRangeStart;
		const rangeEnd = isTopSet ? (exercise.topRepRangeEnd ?? exercise.repRangeEnd) : exercise.repRangeEnd;
		if (set.reps < rangeStart) return set.reps - rangeStart;
		if (set.reps > rangeEnd) return set.reps - rangeEnd;
		return 0;
	}

	function adjustLoads(setIdx: number) {
		let extraOverloadAchieved = 0;
		const exerciseSet = exercise.sets[setIdx];
		const newLoad = exerciseSet.load;
		const oldLoad = originalSetLoads[setIdx];
		if (newLoad === undefined || oldLoad === undefined) return;

		if (!isSameLoadExercise) {
			if (exerciseSet.reps === undefined || exerciseSet.RIR === undefined) return;
			const newReps = Math.round(
				solveBergerFormula({
					variableToSolve: 'NewReps',
					knownValues: {
						oldSet: {
							reps: exerciseSet.reps,
							load: oldLoad,
							RIR: exerciseSet.RIR,
							miniSets: cleanupInProgressMiniSets(exerciseSet.miniSets)
						},
						newSet: { load: newLoad, RIR: exerciseSet.RIR, miniSets: cleanupInProgressMiniSets(exerciseSet.miniSets) },
						oldUserBodyweight: previousUserBodyweight,
						newUserBodyweight: workoutRunes.workoutData?.userBodyweight as number,
						oldBodyweightFraction,
						newBodyweightFraction: exercise.bodyweightFraction ?? null,
						overloadPercentage: 0
					}
				})
			);
			exercise.sets[setIdx] = { ...exerciseSet, reps: newReps, load: newLoad };
			originalSetLoads[setIdx] = newLoad;
			exercise.sets[setIdx].plannedReps = newReps;
			return;
		}

		exercise.sets.forEach((set, currentSetIdx) => {
			if (set.reps === undefined || set.RIR === undefined) return;

			const newReps = Math.round(
				solveBergerFormula({
					variableToSolve: 'NewReps',
					knownValues: {
						oldSet: { reps: set.reps, load: oldLoad, RIR: set.RIR, miniSets: cleanupInProgressMiniSets(set.miniSets) },
						newSet: { load: newLoad, RIR: set.RIR, miniSets: cleanupInProgressMiniSets(set.miniSets) },
						oldUserBodyweight: previousUserBodyweight,
						newUserBodyweight: workoutRunes.workoutData?.userBodyweight as number,
						oldBodyweightFraction,
						newBodyweightFraction: exercise.bodyweightFraction ?? null,
						overloadPercentage: -extraOverloadAchieved
					}
				})
			);

			extraOverloadAchieved += solveBergerFormula({
				variableToSolve: 'OverloadPercentage',
				knownValues: {
					oldSet: { reps: set.reps, load: oldLoad, RIR: set.RIR, miniSets: cleanupInProgressMiniSets(set.miniSets) },
					newSet: { reps: newReps, load: newLoad, RIR: set.RIR, miniSets: cleanupInProgressMiniSets(set.miniSets) },
					oldUserBodyweight: previousUserBodyweight,
					newUserBodyweight: workoutRunes.workoutData?.userBodyweight as number,
					oldBodyweightFraction,
					newBodyweightFraction: exercise.bodyweightFraction ?? null
				}
			});

			exercise.sets[currentSetIdx] = { ...set, reps: newReps, load: newLoad };
			originalSetLoads[currentSetIdx] = newLoad;
			exercise.sets[currentSetIdx].plannedReps = newReps;
		});
	}

	function updateSharedRIR(value: string) {
		if (value.trim() === '') {
			for (const set of exercise.sets) {
				if (!set.completed && !set.skipped) set.RIR = undefined;
				for (const miniSet of set.miniSets) {
					if (!miniSet.completed && !set.skipped) miniSet.RIR = undefined;
				}
			}
			return;
		}
		const RIR = Number(value);
		if (!Number.isInteger(RIR) || RIR < 0) return;

		for (const set of exercise.sets) {
			if (!set.completed && !set.skipped) set.RIR = RIR;
			for (const miniSet of set.miniSets) {
				if (!miniSet.completed && !set.skipped) miniSet.RIR = RIR;
			}
		}
	}
</script>

<div class="flex items-center justify-end gap-2 pb-1">
	<label class="text-[11px] font-semibold uppercase tracking-wide text-[#8fa0b3]" for="{exercise.name}-RIR">RIR</label>
	<Input
		class="h-8 w-14 px-2 text-center"
		id="{exercise.name}-RIR"
		disabled={!hasEditableRIRTargets}
		min={0}
		required
		step={1}
		type="number"
		inputmode="numeric"
		value={sharedRIR}
		oninput={(event) => updateSharedRIR((event.currentTarget as HTMLInputElement).value)}
	/>
</div>

<div class="grid grid-cols-3 gap-1">
	<span class="text-center text-[11px] font-semibold uppercase tracking-wide text-[#8fa0b3]">
		Weight
		{#if typeof exercise.bodyweightFraction === 'number'}
			<Popover.Root>
				<Popover.Trigger>
					<span class="text-[10px] font-semibold text-muted-foreground underline">(+BW)</span>
				</Popover.Trigger>
				<Popover.Content>
					<p class="text-sm text-muted-foreground">
						{exercise.bodyweightFraction * 100}% of your bodyweight is taken into account for this exercise. No need to
						adjust the load manually.
						<br /><br />
						{Math.round(exercise.bodyweightFraction * workoutRunes.workoutData!.userBodyweight! * 100) / 100} lbs will be
						automatically added to the load of each set.
					</p>
				</Popover.Content>
			</Popover.Root>
		{/if}
	</span>
	<span class="text-center text-[11px] font-semibold uppercase tracking-wide text-[#8fa0b3]">Reps</span>
	<span class="text-center text-[11px] font-semibold uppercase tracking-wide text-[#8fa0b3]">Log</span>
	{#each exercise.sets as set, idx}
		{@const expectedReps = getExpectedReps(set)}
		{@const displayedReps = set.completed ? set.reps : (set.reps ?? expectedReps)}
		{@const repTargetDelta = getRepTargetDelta(set, idx)}
		<form class="contents" onsubmit={(e) => completeSet(e, set, idx)}>
			{#if exercise.setType === 'TopBackoff' && idx === 1}
				<div class="col-span-full flex items-center gap-2 text-muted-foreground">
					<Separator class="w-px grow" />
					<ArrowDownIcon />
					<span class="text-center text-xs"> Backoff sets</span>
					<ArrowDownIcon />
					<Separator class="w-px grow" />
				</div>
			{/if}
			{#if !set.skipped}
				<Input
					class="h-9 px-2 text-center"
					id="{exercise.name}-set-{idx + 1}-load"
					disabled={set.completed || set.skipped}
					min={exercise.bodyweightFraction ? undefined : 0.25}
					placeholder={getNextLoad(idx)}
					required
					step={0.25}
					type="number"
					inputmode="decimal"
					value={set.load}
					onchange={(event) => updateSetLoad(set, (event.currentTarget as HTMLInputElement).value)}
				/>
				<div class="relative">
					<Input
						class="h-9 px-7 text-center"
						id="{exercise.name}-set-{idx + 1}-reps"
						disabled={set.completed || set.skipped}
						min={1}
						required
						type="number"
						inputmode="numeric"
						value={displayedReps}
						oninput={(event) => {
							const value = Number((event.currentTarget as HTMLInputElement).value);
							set.reps = Number.isFinite(value) && value > 0 ? value : undefined;
						}}
					/>
					{#if repTargetDelta !== undefined}
						{@const repTargetLabel = getRepTargetLabel(repTargetDelta)}
						<span
							aria-label={repTargetLabel}
							aria-live="polite"
							class={`absolute inset-y-0 right-2 flex items-center ${
								repTargetDelta > 0 ? 'text-emerald-500' : repTargetDelta < 0 ? 'text-rose-500' : 'text-[#8fa0b3]'
							}`}
							data-testid="{exercise.name}-set-{idx + 1}-rep-target-status"
							role="img"
							title={repTargetLabel}
						>
							{#if repTargetDelta > 0}
								<AboveTargetIcon class="h-4 w-4" />
							{:else if repTargetDelta < 0}
								<BelowTargetIcon class="h-4 w-4" />
							{:else}
								<AtTargetIcon class="h-4 w-4" />
							{/if}
						</span>
					{/if}
				</div>
			{:else}
				<div class="col-span-2 flex items-center gap-2">
					<Separator class="w-px grow" />
					<span class="text-xs text-muted-foreground">skipped</span>
					<Separator class="w-px grow" />
				</div>
			{/if}
			<div class="flex items-center justify-center">
				{#if idx === 0 || !isSameLoadExercise}
					{@const hasLoadChanged = set.load !== originalSetLoads[idx] && originalSetLoads[idx] !== undefined}
					{#if hasLoadChanged}
						<Button
							class="h-7 w-7 p-1"
							data-testid="{exercise.name}-set-{idx + 1}-adjust-reps"
							onclick={() => adjustLoads(idx)}
							variant="outline"
						>
							<TargetIcon />
						</Button>
					{/if}
				{/if}
				<Button
					class="h-9 w-9"
					data-testid="{exercise.name}-set-{idx + 1}-action"
					disabled={!set.completed && !set.skipped && !hasValidRIR(set.RIR)}
					size="icon"
					type="submit"
					variant={set.completed ? 'outline' : 'default'}
				>
					{#if set.skipped}
						<UndoIcon />
					{:else if !set.completed}
						<CheckIcon />
					{:else}
						<EditIcon />
					{/if}
				</Button>
			</div>
		</form>
		{#if (idx > 0 && (exercise.setType === 'MyorepMatch' || exercise.setType === 'MyorepMatchDown')) || exercise.setType === 'Drop'}
			{#each set.miniSets as miniSet, miniIdx}
				{@const miniSetButtonDisabled = shouldMiniSetBeDisabled(idx, miniIdx)}
				{#if set.skipped}
					<div class="col-span-3 flex items-center gap-2">
						<Separator class="w-px grow" />
						<span class="text-xs text-muted-foreground">skipped</span>
						<Separator class="w-px grow" />
					</div>
					<Button class="h-9 w-9 place-self-end" disabled size="icon" variant="secondary">
						<CheckIcon />
					</Button>
				{:else}
					<form class="contents" onsubmit={(e) => completeMiniSet(e, set, miniIdx)}>
						{#if exercise.setType === 'MyorepMatch' || exercise.setType === 'MyorepMatchDown'}
							<span></span>
						{:else}
							{@const expectedLoad = getMiniSetLoad(idx, miniIdx)}
							<Input
								class="h-9 px-2 text-center"
								id="{exercise.name}-set-{idx + 1}-mini-set-{miniIdx + 1}-load"
								disabled={miniSet.completed}
								min={exercise.bodyweightFraction ? undefined : 0}
								placeholder={expectedLoad === undefined ? expectedLoad : expectedLoad.toString()}
								required
								step={0.25}
								type="number"
								inputmode="decimal"
								bind:value={miniSet.load}
							/>
						{/if}
						<Input
							class="h-9 px-2 text-center"
							id="{exercise.name}-set-{idx + 1}-mini-set-{miniIdx + 1}-reps"
							disabled={miniSet.completed}
							min={1}
							required
							type="number"
							inputmode="numeric"
							bind:value={miniSet.reps}
						/>
						<Button
							class="h-9 w-9 place-self-end"
							data-testid="{exercise.name}-set-{idx + 1}-mini-set-{miniIdx + 1}-action"
							disabled={miniSetButtonDisabled || (!miniSet.completed && !hasValidRIR(miniSet.RIR))}
							size="icon"
							type="submit"
							variant={miniSet.completed ? 'outline' : 'default'}
						>
							{#if !miniSet.completed}
								<CheckIcon />
							{:else}
								<EditIcon />
							{/if}
						</Button>
					</form>
				{/if}
			{/each}
			<Button
				aria-label="add-mini-set-to-set-{idx + 1}-of-{exercise.name}"
				class="h-8"
				onclick={() => addMiniSet(idx)}
				variant="secondary"
			>
				<AddIcon />
			</Button>
			<Button
				aria-label="remove-mini-set-from-set-{idx + 1}-of-{exercise.name}"
				class="h-8"
				disabled={set.miniSets.length === 0}
				onclick={() => set.miniSets.pop()}
				variant="secondary"
			>
				<RemoveIcon />
			</Button>
			{#if exercise.setType === 'MyorepMatch' || exercise.setType === 'MyorepMatchDown'}
				{@const repsLeft = getRemainingMyorepMatchReps(idx)}
				<span class="grid place-items-center text-xs font-medium text-primary">
					{#if repsLeft && repsLeft > 0}
						{repsLeft} {repsLeft === 1 ? 'rep' : 'reps'} left
					{:else if typeof repsLeft === 'number'}
						matched
					{/if}
				</span>
			{:else}
				<span></span>
			{/if}
			<span></span>
		{/if}
	{/each}
</div>
