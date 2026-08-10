<script lang="ts">
	import { goto } from '$app/navigation';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
	import type { RouterOutputs } from '$lib/trpc/router';
	import { convertCamelCaseToNormal } from '$lib/utils';
	import { getRIRForWeek } from '$lib/utils/workoutUtils';
	import { workoutRunes } from '../../workouts/manage/workoutRunes.svelte';
	import BedIcon from 'virtual:icons/lucide/bed';
	import PlayIcon from 'virtual:icons/lucide/play';

	type PropsType = {
		todaysWorkoutData: Promise<RouterOutputs['workouts']['getTodaysWorkoutData']>;
	};
	let { todaysWorkoutData }: PropsType = $props();

	async function createNewWorkout() {
		if (await workoutRunes.beginNewWorkout()) await goto('/workouts/manage/start');
	}
</script>

<Card.Root>
	{#await todaysWorkoutData}
		<Card.Header>
			<Card.Description>Today's session</Card.Description>
			<Card.Title><Skeleton class="h-7 w-44" /></Card.Title>
		</Card.Header>
		<Card.Content>
			<Skeleton class="h-24 w-full" />
		</Card.Content>
		<Card.Footer>
			<Skeleton class="ml-auto h-10 w-36" />
		</Card.Footer>
	{:then todaysWorkoutData}
		{@const wm = todaysWorkoutData.workoutOfMesocycle}
		{#if wm}
			{#if wm.workoutStatus === 'RestDay'}
				<Card.Header>
					<Card.Description>{wm.mesocycle.name} · cycle {wm.cycleNumber}</Card.Description>
					<Card.Title class="flex items-center gap-2.5">
						<BedIcon class="h-5 w-5 shrink-0 text-primary" />
						Rest day
					</Card.Title>
				</Card.Header>
				<Card.Content class="text-sm leading-relaxed text-muted-foreground">
					No session scheduled today. Recovery is where the growth happens — eat well and sleep well.
				</Card.Content>
			{:else}
				{@const rir = getRIRForWeek(wm.mesocycle.RIRProgression, wm.cycleNumber)}
				{@const muscleGroups = Array.from(
					new Set(
						todaysWorkoutData.workoutExercises.map((e) =>
							convertCamelCaseToNormal(e.customMuscleGroup ?? e.targetMuscleGroup)
						)
					)
				)}
				<Card.Header>
					<Card.Description>{wm.mesocycle.name} · cycle {wm.cycleNumber}</Card.Description>
					<Card.Title class="flex items-start justify-between gap-3 text-2xl">
						{wm.splitDayName}
						<Badge class="mt-1 shrink-0" variant="secondary">{rir} RIR</Badge>
					</Card.Title>
				</Card.Header>
				<Card.Content class="flex flex-col gap-4">
					{#if todaysWorkoutData.workoutExercises.length > 0}
						<ol class="flex flex-col divide-y text-sm">
							{#each todaysWorkoutData.workoutExercises as exercise, idx}
								<li class="flex items-baseline justify-between gap-3 py-2 first:pt-0 last:pb-0">
									<span class="min-w-0 truncate font-medium">
										<span class="mr-2 inline-block w-4 text-right tabular-nums text-muted-foreground">{idx + 1}</span>
										{exercise.name}
									</span>
									<span class="shrink-0 text-xs text-muted-foreground">
										{convertCamelCaseToNormal(exercise.customMuscleGroup ?? exercise.targetMuscleGroup)}
									</span>
								</li>
							{/each}
						</ol>
					{/if}
					{#if muscleGroups.length > 0}
						<p class="text-xs text-muted-foreground">
							{todaysWorkoutData.workoutExercises.length} exercises · {muscleGroups.join(', ')}
						</p>
					{/if}
				</Card.Content>
				<Card.Footer>
					<Button class="w-full gap-2 sm:ml-auto sm:w-auto" onclick={createNewWorkout}>
						<PlayIcon class="h-4 w-4" />
						Start workout
					</Button>
				</Card.Footer>
			{/if}
		{:else}
			<Card.Header>
				<Card.Description>Today's session</Card.Description>
				<Card.Title>No active mesocycle</Card.Title>
			</Card.Header>
			<Card.Content class="text-sm leading-relaxed text-muted-foreground">
				You can log workouts without a mesocycle, but you'll miss out on automatic progression and mesocycle statistics.
			</Card.Content>
			<Card.Footer class="flex flex-col gap-2 sm:flex-row sm:justify-end">
				<Button class="w-full sm:w-auto" onclick={createNewWorkout} variant="secondary">Start without mesocycle</Button>
				<Button class="w-full sm:w-auto" href="/mesocycles">Go to mesocycles</Button>
			</Card.Footer>
		{/if}
	{:catch}
		<Card.Header>
			<Card.Description>Today's session</Card.Description>
			<Card.Title>Couldn't load today's workout</Card.Title>
		</Card.Header>
		<Card.Content class="text-sm text-muted-foreground">Check your connection and try again.</Card.Content>
		<Card.Footer>
			<Button class="ml-auto" href="/dashboard" variant="outline">Retry</Button>
		</Card.Footer>
	{/await}
</Card.Root>
