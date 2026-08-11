<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Progress } from '$lib/components/ui/progress';
	import type { RouterOutputs } from '$lib/trpc/router';
	import DoneIcon from 'virtual:icons/lucide/circle-check-big';
	import OpenLinkIcon from 'virtual:icons/lucide/arrow-up-right';

	type PropsType = { entityCounts?: RouterOutputs['users']['getEntityCounts'] };
	let { entityCounts }: PropsType = $props();

	const taskList = $derived([
		{ task: 'Log in', completion: entityCounts !== null, link: '/' },
		{
			task: 'Create an exercise split',
			completion: Number(entityCounts?.exerciseSplits) > 0,
			link: '/exercise-splits'
		},
		{ task: 'Create a mesocycle', completion: Number(entityCounts?.mesocycles) > 0, link: '/mesocycles' },
		{ task: 'Start a mesocycle', completion: Number(entityCounts?.startedMesocycles) > 0, link: '/mesocycles' },
		{ task: 'Log a workout', completion: Number(entityCounts?.workouts) > 0, link: '/workouts' }
	]);

	const tasksDone = $derived(taskList.filter(({ completion }) => completion).length);
</script>

{#if tasksDone < taskList.length}
	<Card.Root class="surface-panel overflow-hidden rounded-xl">
		<Card.Header class="gap-2 pb-4">
			<div class="flex items-center justify-between gap-3">
				<div>
					<Card.Description class="section-kicker">Setup progress</Card.Description>
					<Card.Title class="mt-1 text-base">Get started</Card.Title>
				</div>
				<span
					class="rounded-full border bg-muted/45 px-2.5 py-1 text-[11px] font-medium tabular-nums text-muted-foreground"
				>
					{tasksDone}/{taskList.length}
				</span>
			</div>
			<Progress class="mt-1 h-1" max={taskList.length} value={tasksDone} />
		</Card.Header>
		<Card.Content class="px-4 pb-4">
			<ul class="flex flex-col text-sm">
				{#each taskList as { task, completion, link }, idx}
					{@const prevTaskDone = idx === 0 ? true : taskList.at(idx - 1)?.completion}
					<li class="divided-row flex min-h-11 items-center justify-between gap-3 px-1 first:border-t-0">
						<span class="flex min-w-0 items-center gap-2.5">
							<span
								class={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] tabular-nums ${
									completion ? 'border-primary/40 bg-primary/15 text-primary' : 'bg-muted/40 text-muted-foreground'
								}`}
							>
								{#if completion}<DoneIcon class="h-3 w-3" />{:else}{idx + 1}{/if}
							</span>
							<span class:line-through={completion} class:text-muted-foreground={completion} class="truncate">
								{task}
							</span>
						</span>
						{#if completion}
							<span class="text-[10px] font-medium uppercase tracking-wider text-primary" aria-label="Done">Done</span>
						{:else if idx !== 0}
							{@const buttonProps = prevTaskDone ? { href: link } : { disabled: true }}
							<Button
								class="pressable-control h-7 w-7 shrink-0 rounded-full p-1"
								{...buttonProps}
								aria-label={task}
								size="icon"
								variant="ghost"
							>
								<OpenLinkIcon class="h-4 w-4" />
							</Button>
						{/if}
					</li>
				{/each}
			</ul>
		</Card.Content>
	</Card.Root>
{/if}
