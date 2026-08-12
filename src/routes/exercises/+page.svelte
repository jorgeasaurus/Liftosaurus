<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Sheet from '$lib/components/ui/sheet';
	import { cn, convertCamelCaseToNormal } from '$lib/utils';
	import { buildExerciseCatalog } from '$lib/utils/exerciseCatalog';
	import ChartIcon from 'virtual:icons/lucide/chart-column';
	import FilterIcon from 'virtual:icons/lucide/list-filter';
	import SearchIcon from 'virtual:icons/lucide/search';

	let { data } = $props();
	let catalog = $derived(buildExerciseCatalog(data.userExercises));
	let exercises = $derived(
		catalog.flatMap(({ muscleGroup, exercises }) => exercises.map((exercise) => ({ ...exercise, muscleGroup })))
	);
	let muscleGroups = $derived(catalog.map(({ muscleGroup }) => muscleGroup));

	let search = $state('');
	let selectedMuscleGroups = $state<string[]>([]);
	let filterOpen = $state(false);

	let filteredExercises = $derived(
		exercises.filter(
			(exercise) =>
				exercise.name.toLowerCase().includes(search.trim().toLowerCase()) &&
				(selectedMuscleGroups.length === 0 || selectedMuscleGroups.includes(exercise.muscleGroup))
		)
	);

	function toggleMuscleGroup(muscleGroup: string) {
		selectedMuscleGroups = selectedMuscleGroups.includes(muscleGroup)
			? selectedMuscleGroups.filter((group) => group !== muscleGroup)
			: [...selectedMuscleGroups, muscleGroup];
	}
</script>

<svelte:head>
	<title>Exercises · Liftosaurus</title>
	<meta name="description" content="Browse Liftosaurus exercises and review your training history." />
</svelte:head>

<section class="mx-auto flex h-full w-full max-w-3xl flex-col gap-3">
	<header class="flex items-end justify-between gap-3">
		<div>
			<p class="text-xs font-semibold uppercase tracking-[0.14em] text-[#9dadbe]">Library</p>
			<h1 class="mt-1 text-3xl font-semibold tracking-[-0.035em] text-[#e9eef5]">Exercises</h1>
		</div>
		<a
			class="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#303844] bg-[#171e27] px-3 text-sm font-semibold text-[#dfe6ef]"
			href="/exercise-stats"
		>
			<ChartIcon class="h-4 w-4" />
			Progress
		</a>
	</header>

	<div class="flex gap-2">
		<label class="relative min-w-0 flex-1">
			<span class="sr-only">Search exercises</span>
			<SearchIcon class="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-[#728292]" />
			<Input class="h-11 pl-9" type="search" placeholder="Search exercises" bind:value={search} />
		</label>
		<Sheet.Root bind:open={filterOpen}>
			<Sheet.Trigger asChild let:builder>
				<Button
					aria-label="Filter exercises"
					builders={[builder]}
					class="relative h-11 w-11 shrink-0"
					size="icon"
					variant={selectedMuscleGroups.length ? 'default' : 'secondary'}
				>
					<FilterIcon class="h-4 w-4" />
					{#if selectedMuscleGroups.length}
						<span
							class="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#e9eef5] px-1 text-[10px] font-bold text-[#11161d]"
						>
							{selectedMuscleGroups.length}
						</span>
					{/if}
				</Button>
			</Sheet.Trigger>
			<Sheet.Content
				class="w-full max-w-none overflow-y-auto px-4 pb-[calc(24px+env(safe-area-inset-bottom))] sm:max-w-sm"
			>
				<Sheet.Header>
					<Sheet.Title>Filter exercises</Sheet.Title>
					<Sheet.Description>Choose one or more muscle groups.</Sheet.Description>
				</Sheet.Header>
				<div class="mt-6 grid grid-cols-2 gap-2">
					{#each muscleGroups as muscleGroup}
						<button
							aria-pressed={selectedMuscleGroups.includes(muscleGroup)}
							class={cn(
								'min-h-11 rounded-xl border px-3 text-left text-sm font-semibold transition-colors',
								selectedMuscleGroups.includes(muscleGroup)
									? 'border-[#8cae2f] bg-[#263317] text-[#dff58e]'
									: 'border-[#303844] bg-[#171e27]'
							)}
							onclick={() => toggleMuscleGroup(muscleGroup)}
						>
							{convertCamelCaseToNormal(muscleGroup)}
						</button>
					{/each}
				</div>
				<div class="mt-6 grid grid-cols-2 gap-2">
					<Button variant="secondary" onclick={() => (selectedMuscleGroups = [])}>Clear</Button>
					<Button onclick={() => (filterOpen = false)}>Show {filteredExercises.length}</Button>
				</div>
			</Sheet.Content>
		</Sheet.Root>
	</div>

	<p class="text-xs tabular-nums text-[#8797a7]">{filteredExercises.length} exercises</p>

	<div class="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
		<div class="grid gap-2 pb-2 sm:grid-cols-2">
			{#each filteredExercises as exercise}
				<article class="rounded-xl border border-[#252c34] bg-[#11161d] px-3 py-3">
					<div class="flex items-start justify-between gap-2">
						<h2 class="text-sm font-semibold leading-snug text-[#e9eef5]">{exercise.name}</h2>
						<span class="shrink-0 rounded-md bg-[#1a2330] px-1.5 py-0.5 text-[10px] font-semibold text-[#9db0c7]">
							{convertCamelCaseToNormal(exercise.muscleGroup)}
						</span>
					</div>
					{#if exercise.type === 'builtIn'}
						<p class="mt-2 text-xs text-[#8797a7]">
							{exercise.repRangeStart}–{exercise.repRangeEnd} reps · {convertCamelCaseToNormal(exercise.setType)} sets
						</p>
					{:else}
						<p class="mt-2 text-xs text-[#8797a7]">Saved from your workout history</p>
					{/if}
					{#if exercise.type === 'builtIn' && exercise.note}
						<p class="mt-2 line-clamp-2 text-xs leading-relaxed text-[#9dadbe]">{exercise.note}</p>
					{/if}
				</article>
			{:else}
				<div class="col-span-full rounded-2xl border border-dashed border-[#303844] px-5 py-10 text-center">
					<p class="font-semibold text-[#dfe6ef]">No matching exercises</p>
					<p class="mt-1 text-sm text-[#8797a7]">Try another name or clear a muscle-group filter.</p>
				</div>
			{/each}
		</div>
	</div>
</section>
