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

<Card.Root class="overflow-hidden rounded-xl shadow-none lg:rounded-lg lg:shadow-sm">
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
				<Card.Header class="p-5 pb-4 lg:p-6 lg:pb-4">
					<Card.Description>{wm.mesocycle.name} · cycle {wm.cycleNumber}</Card.Description>
					<Card.Title class="flex items-center gap-2.5">
						<BedIcon class="h-5 w-5 shrink-0 text-primary" />
						Rest day
					</Card.Title>
				</Card.Header>
				<Card.Content class="p-5 pt-0 text-sm leading-relaxed text-muted-foreground lg:p-6 lg:pt-0">
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
				<Card.Header class="p-5 pb-4 lg:p-6 lg:pb-4">
					<Card.Description>{wm.mesocycle.name} · cycle {wm.cycleNumber}</Card.Description>
					<Card.Title class="flex items-start justify-between gap-3 text-[1.75rem] leading-tight">
						{wm.splitDayName}
						<Badge class="mt-1 shrink-0" variant="secondary">{rir} RIR</Badge>
					</Card.Title>
				</Card.Header>
				<Card.Content class="flex flex-col gap-4 p-5 pt-0 lg:p-6 lg:pt-0">
					{#if todaysWorkoutData.workoutExercises.length > 0}
						<ol class="flex flex-col divide-y text-sm">
							{#each todaysWorkoutData.workoutExercises as exercise, idx}
								<li
									class="flex min-h-11 items-center justify-between gap-3 py-2 first:pt-0 last:pb-0 lg:min-h-0 lg:items-baseline"
								>
									<span class="min-w-0 truncate text-[0.95rem] font-medium lg:text-sm">
										<span class="mr-3 inline-block w-4 text-right tabular-nums text-muted-foreground lg:mr-2"
											>{idx + 1}</span
										>
										{exercise.name}
									</span>
									<span class="shrink-0 text-sm text-muted-foreground lg:text-xs">
										{convertCamelCaseToNormal(exercise.customMuscleGroup ?? exercise.targetMuscleGroup)}
									</span>
								</li>
							{/each}
						</ol>
					{/if}
					{#if muscleGroups.length > 0}
						<p class="text-sm text-muted-foreground lg:text-xs">
							{todaysWorkoutData.workoutExercises.length} exercises · {muscleGroups.join(', ')}
						</p>
					{/if}
				</Card.Content>
				<Card.Footer class="p-5 pt-1 lg:p-6 lg:pt-0">
					<Button
						class="h-12 w-full gap-2 text-base sm:ml-auto sm:w-auto lg:h-10 lg:text-sm"
						onclick={createNewWorkout}
					>
						<PlayIcon class="h-5 w-5 lg:h-4 lg:w-4" />
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
