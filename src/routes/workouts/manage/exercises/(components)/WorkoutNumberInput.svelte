<script lang="ts">
	import { cn } from '$lib/utils';
	import type { HTMLInputAttributes } from 'svelte/elements';

	type Props = Omit<HTMLInputAttributes, 'value' | 'min' | 'max' | 'step' | 'oninput' | 'onblur'> & {
		value: number | undefined;
		completed?: boolean;
		min?: number;
		max?: number;
		step?: number;
		integer?: boolean;
		preserveInvalid?: boolean;
		oncommit: (value: number | undefined) => void;
		onflush: () => void;
	};

	let {
		value,
		completed = false,
		min,
		max,
		step,
		integer = false,
		preserveInvalid = completed,
		class: className,
		oncommit,
		onflush,
		...attributes
	}: Props = $props();

	let displayValue = $state(value === undefined ? '' : String(value));
	let focused = $state(false);

	$effect(() => {
		if (!focused) displayValue = value === undefined ? '' : String(value);
	});

	function validNumber(candidate: number) {
		if (!Number.isFinite(candidate)) return false;
		if (min !== undefined && candidate < min) return false;
		if (max !== undefined && candidate > max) return false;
		if (integer && !Number.isInteger(candidate)) return false;
		if (step !== undefined) {
			const steps = (candidate - (min ?? 0)) / step;
			if (Math.abs(steps - Math.round(steps)) > 1e-8) return false;
		}
		return true;
	}

	function handleInput(event: Event) {
		displayValue = (event.currentTarget as HTMLInputElement).value;
		if (displayValue === '') {
			if (!completed) oncommit(undefined);
			return;
		}
		const candidate = Number(displayValue);
		if (validNumber(candidate)) oncommit(candidate);
		else if (!preserveInvalid) oncommit(undefined);
	}

	function handleBlur() {
		focused = false;
		displayValue = value === undefined ? '' : String(value);
		onflush();
	}
</script>

<input
	class={cn(
		'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
		className
	)}
	{min}
	{max}
	{step}
	value={displayValue}
	onfocus={() => (focused = true)}
	oninput={handleInput}
	onblur={handleBlur}
	{...attributes}
/>
