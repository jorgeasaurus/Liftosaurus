<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import H2 from '$lib/components/ui/typography/H2.svelte';
	import type { Snippet } from 'svelte';
	import { workoutRunes } from './workoutRunes.svelte';
	import type { LayoutData } from './$types';

	let { children, data }: { children: Snippet<[LayoutData]>; data: LayoutData } = $props();
	let editing = $derived(workoutRunes.editingWorkoutId !== null);

	async function cancelEdit() {
		const editingWorkoutId = await workoutRunes.cancelEdit();
		if (editingWorkoutId === null) return;
		await goto(editingWorkoutId ? `/workouts/${editingWorkoutId}` : '/workouts');
	}
</script>

<div class="flex items-center justify-between gap-2">
	<H2>{editing ? 'Edit' : 'New'} workout</H2>
	{#if editing}
		<Button variant="secondary" onclick={cancelEdit}>Cancel edit</Button>
	{/if}
</div>
{#if workoutRunes.persistenceConflict}
	<p class="border-amber-600 bg-amber-50 px-3 py-2 text-sm text-amber-950" role="alert">
		This workout draft changed in another tab or uses a newer format. Your changes remain in this tab, and the saved
		draft was left untouched.
	</p>
{:else if workoutRunes.persistenceUnavailable}
	<p class="border-amber-600 bg-amber-50 px-3 py-2 text-sm text-amber-950" role="alert">
		Workout draft persistence is unavailable in this browser. Changes will work in this tab but will not be saved after
		you leave.
	</p>
{/if}
{@render children(data)}
