<script lang="ts">
	import CraftedLoadingState from './CraftedLoadingState.svelte';
	import { formatCompactNumber } from '$lib/utils/formatCompactNumber';

	type Props = {
		label: string;
		value: Promise<number>;
	};

	let { label, value }: Props = $props();
</script>

<article class="surface-panel group relative min-w-0 overflow-hidden rounded-xl p-4">
	<span
		aria-hidden="true"
		class="absolute inset-x-0 top-0 h-px bg-primary/60 opacity-0 transition-opacity group-hover:opacity-100"
	></span>
	<p class="section-kicker truncate">{label}</p>
	{#await value}
		<CraftedLoadingState compact label={`Loading ${label.toLowerCase()}`} />
	{:then count}
		<p class="mt-2 text-2xl font-semibold tabular-nums tracking-[-0.04em] sm:text-3xl">
			{formatCompactNumber(count)}
		</p>
	{/await}
	<div class="mt-3 flex items-center gap-1" aria-hidden="true">
		<span class="h-1 w-5 rounded-full bg-primary/80"></span>
		<span class="h-1 w-1 rounded-full bg-primary/35"></span>
		<span class="h-1 w-1 rounded-full bg-primary/20"></span>
	</div>
</article>
