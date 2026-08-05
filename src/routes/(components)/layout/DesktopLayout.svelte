<script lang="ts">
	import { page } from '$app/stores';
	import type { Snippet } from 'svelte';
	import BrandIcon from 'virtual:icons/lucide/dumbbell';
	import HomeIcon from 'virtual:icons/lucide/house';
	import WorkoutsIcon from 'virtual:icons/lucide/clipboard-list';
	import ProgressIcon from 'virtual:icons/lucide/chart-column';
	import PlansIcon from 'virtual:icons/lucide/calendar-days';
	import LibraryIcon from 'virtual:icons/lucide/book-open';
	import ProfileIcon from 'virtual:icons/lucide/circle-user-round';
	import SettingsIcon from 'virtual:icons/lucide/settings';

	let { children }: { children: Snippet } = $props();

	const navLinks = [
		{ label: 'Today', href: '/dashboard', icon: HomeIcon },
		{ label: 'Workouts', href: '/workouts', icon: WorkoutsIcon },
		{ label: 'Progress', href: '/exercise-stats', icon: ProgressIcon },
		{ label: 'Plans', href: '/mesocycles', icon: PlansIcon },
		{ label: 'Library', href: '/exercise-splits', icon: LibraryIcon }
	] as const;

	const isActive = (href: string) =>
		href === '/dashboard' ? $page.url.pathname.startsWith('/dashboard') : $page.url.pathname.startsWith(href);
</script>

<header
	class="flex h-screen w-[220px] shrink-0 flex-col border-r border-[#232830] bg-[#101419] px-4 py-5 text-[#e8edf2]"
>
	<a class="mb-6 flex items-center gap-2 rounded-lg px-2 py-2" href="/dashboard">
		<BrandIcon class="h-5 w-5 text-[#c7f73a]" />
		<span class="text-xl font-semibold tracking-tight">Liftosaurus</span>
	</a>

	<nav aria-label="Primary navigation" class="space-y-1">
		{#each navLinks as item}
			<a
				class={`flex items-center gap-3 rounded-md border px-3 py-2 text-sm transition-colors ${
					isActive(item.href)
						? 'border-[#c7f73a66] bg-[#171d20] text-[#eff2f7]'
						: 'border-transparent text-[#a8b2be] hover:border-[#2a3039] hover:bg-[#151a20] hover:text-[#dce3ea]'
				}`}
				href={item.href}
			>
				<item.icon class="h-4 w-4" />
				<span>{item.label}</span>
			</a>
		{/each}
	</nav>

	<div class="mt-auto space-y-1 border-t border-[#222831] pt-4">
		<a
			class="flex items-center gap-3 rounded-md border border-transparent px-3 py-2 text-sm text-[#a8b2be] transition-colors hover:border-[#2a3039] hover:bg-[#151a20] hover:text-[#dce3ea]"
			href="/profile"
		>
			<ProfileIcon class="h-4 w-4" />
			<span>{$page.data.session?.user?.name ?? 'Profile'}</span>
		</a>
		<a
			class="flex items-center gap-3 rounded-md border border-transparent px-3 py-2 text-sm text-[#a8b2be] transition-colors hover:border-[#2a3039] hover:bg-[#151a20] hover:text-[#dce3ea]"
			href="/settings"
		>
			<SettingsIcon class="h-4 w-4" />
			<span>Settings</span>
		</a>
	</div>
</header>
<main class="flex h-screen w-full flex-col overflow-y-auto bg-[#0b0f14] p-6 text-[#e8edf2]">
	{@render children()}
</main>
