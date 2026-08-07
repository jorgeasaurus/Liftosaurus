<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Progress } from '$lib/components/ui/progress';
	import type { RouterOutputs } from '$lib/trpc/router';
	import DoneIcon from 'virtual:icons/lucide/circle-check-big';
	import OpenLinkIcon from 'virtual:icons/lucide/square-arrow-out-up-right';

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
	<Card.Root>
		<Card.Header>
			<Card.Title class="text-base">Get started</Card.Title>
			<Card.Description>{tasksDone} of {taskList.length} steps done</Card.Description>
			<Progress class="mt-1 h-1.5" max={taskList.length} value={tasksDone} />
		</Card.Header>
		<Card.Content>
			<ul class="flex flex-col text-sm">
				{#each taskList as { task, completion, link }, idx}
					{@const prevTaskDone = idx === 0 ? true : taskList.at(idx - 1)?.completion}
					<li class="flex h-9 items-center justify-between gap-2">
						<span class={completion ? 'text-muted-foreground line-through decoration-muted-foreground/50' : ''}>
							{task}
						</span>
						{#if completion}
							<DoneIcon class="h-4 w-4 shrink-0 text-primary" aria-label="Done" />
						{:else if idx !== 0}
							{@const buttonProps = prevTaskDone ? { href: link } : { disabled: true }}
							<Button class="h-7 w-7 shrink-0 p-1" {...buttonProps} aria-label={task} size="icon" variant="ghost">
								<OpenLinkIcon class="h-4 w-4" />
							</Button>
						{/if}
					</li>
				{/each}
			</ul>
		</Card.Content>
	</Card.Root>
{/if}
