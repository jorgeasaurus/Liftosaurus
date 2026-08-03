<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';
	import EditIcon from 'virtual:icons/lucide/pencil';
	import ExerciseTemplateCard from '$lib/components/mesocycleAndExerciseSplit/ExerciseTemplateCard.svelte';
	import { mesocycleExerciseSplitRunes } from '../edit-split/mesocycleExerciseSplitRunes.svelte';
	import { goto } from '$app/navigation';
	import type { RouterOutputs } from '$lib/trpc/router';
	import { trpc } from '$lib/trpc/client';
	import { toast } from 'svelte-sonner';
	import LoaderCircle from 'virtual:icons/lucide/loader-circle';

	let { mesocycle }: { mesocycle: NonNullable<RouterOutputs['mesocycles']['findById']> } = $props();
	let selectedSplitDay = $state(mesocycle.mesocycleExerciseSplitDays.find((splitDay) => !splitDay.isRestDay)!);
	let resettingTemplateId = $state<string | null>(null);

	function editMesocycleExerciseSplit() {
		mesocycleExerciseSplitRunes.loadExerciseSplit(mesocycle);
		goto(`/mesocycles/${mesocycle.id}/edit-split/structure`);
	}

	async function resetAdaptiveRepRange(exercise: (typeof selectedSplitDay.mesocycleSplitDayExercises)[number]) {
		resettingTemplateId = exercise.id;
		try {
			const response = await trpc().mesocycles.resetAdaptiveRepRanges.mutate({
				mesocycleId: mesocycle.id,
				templateId: exercise.id
			});
			exercise.adaptiveRepRangeStart = null;
			exercise.adaptiveRepRangeEnd = null;
			exercise.adaptiveTopRepRangeStart = null;
			exercise.adaptiveTopRepRangeEnd = null;
			exercise.adaptiveRepRangeSourceId = null;
			exercise.adaptiveTopRepRangeSourceId = null;
			exercise.adaptiveRepRangeResetAt = response.resetAt;
			toast.success(response.message);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : 'Unable to reset adaptive rep range');
		}
		resettingTemplateId = null;
	}
</script>

{#if mesocycle.mesocycleExerciseSplitDays.length > 0}
	<Card.Root class="mb-2 flex items-center justify-between gap-2 p-2">
		<span class="text-sm font-medium text-muted-foreground">The current split of the mesocycle</span>
		<Button class="gap-2" onclick={editMesocycleExerciseSplit} size="sm">
			Edit <EditIcon />
		</Button>
	</Card.Root>
	<Tabs.Root
		class="w-full"
		onValueChange={(v) => {
			selectedSplitDay = mesocycle.mesocycleExerciseSplitDays.find((splitDay) => splitDay.name === v)!;
		}}
		value={selectedSplitDay.name}
	>
		<Tabs.List class="flex justify-start overflow-x-auto">
			{#each mesocycle.mesocycleExerciseSplitDays as splitDay}
				<Tabs.Trigger disabled={splitDay.isRestDay} value={splitDay.name}>
					{splitDay.isRestDay ? 'Rest' : splitDay.name}
				</Tabs.Trigger>
			{/each}
		</Tabs.List>
		<Tabs.Content class="flex flex-col gap-1" value={selectedSplitDay.name}>
			{#each selectedSplitDay.mesocycleSplitDayExercises as exercise}
				<ExerciseTemplateCard context="mesocycle" exerciseTemplate={exercise} readOnly />
				{#if (exercise.repRangeMode ?? mesocycle.repRangeMode) === 'Adaptive'}
					{@const hasTopRange =
						typeof exercise.adaptiveTopRepRangeStart === 'number' &&
						typeof exercise.adaptiveTopRepRangeEnd === 'number'}
					{@const hasStandardRange =
						typeof exercise.adaptiveRepRangeStart === 'number' && typeof exercise.adaptiveRepRangeEnd === 'number'}
					<div class="mb-1 flex items-center justify-between rounded-md border px-3 py-2 text-sm">
						<div class="flex flex-col">
							{#if exercise.setType === 'TopBackoff'}
								<span>
									Top: {hasTopRange
										? `Established ${exercise.adaptiveTopRepRangeStart}–${exercise.adaptiveTopRepRangeEnd}`
										: 'Pending first performance'}
								</span>
								<span>
									Backoff: {hasStandardRange
										? `Established ${exercise.adaptiveRepRangeStart}–${exercise.adaptiveRepRangeEnd}`
										: 'Pending first performance'}
								</span>
							{:else}
								<span>
									{hasStandardRange
										? `Established ${exercise.adaptiveRepRangeStart}–${exercise.adaptiveRepRangeEnd} reps`
										: 'Pending first performance (5–30 reps)'}
								</span>
							{/if}
						</div>
						{#if exercise.adaptiveRepRangeSourceId || exercise.adaptiveTopRepRangeSourceId}
							<Button
								disabled={resettingTemplateId === exercise.id}
								onclick={() => resetAdaptiveRepRange(exercise)}
								size="sm"
								variant="outline"
							>
								{#if resettingTemplateId === exercise.id}<LoaderCircle class="animate-spin" />{:else}Reset{/if}
							</Button>
						{/if}
					</div>
				{/if}
			{/each}
		</Tabs.Content>
	</Tabs.Root>
{:else}
	<div class="muted-text-box">Mesocycle template for this mesocycle in V2 seems to have been deleted</div>
{/if}
