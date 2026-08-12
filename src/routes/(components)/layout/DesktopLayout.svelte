<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
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
	import LoginProviderMenu from './LoginProviderMenu.svelte';

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
	class="flex h-[100dvh] w-[240px] shrink-0 flex-col border-r border-[#273034] bg-[#111719] px-4 py-5 text-[#f3f6f2]"
>
	<a class="mb-6 flex items-center gap-2 rounded-lg px-2 py-2" href="/dashboard">
		<BrandIcon class="h-5 w-5 text-[#c7f73a]" />
		<span class="text-xl font-semibold tracking-tight">Liftosaurus</span>
	</a>

	<nav aria-label="Primary navigation" class="space-y-1">
		{#each navLinks as item}
			<a
				class={`pressable-control group relative flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm ${
					isActive(item.href)
						? 'border-[#344044] bg-[#192123] text-[#f3f6f2] shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]'
						: 'border-transparent text-[#a6afb1] hover:border-[#2a3438] hover:bg-[#151d1f] hover:text-[#e5ebea]'
				}`}
				href={item.href}
			>
				{#if isActive(item.href)}
					<span aria-hidden="true" class="absolute -left-4 h-6 w-1 rounded-r-full bg-[#c7f43a]"></span>
				{/if}
				<item.icon
					class={`h-4 w-4 transition-transform group-hover:scale-105 ${isActive(item.href) ? 'text-[#c7f43a]' : 'text-[#8f999d]'}`}
				/>
				<span>{item.label}</span>
			</a>
		{/each}
	</nav>

	<div class="mt-auto space-y-2 border-t border-[#273034] pt-4">
		{#if $page.data.session}
			<a
				class="flex items-center gap-3 rounded-xl border border-[#2a3438] bg-[#171e20] px-3 py-2 text-sm text-[#f3f6f2]"
				href="/profile"
			>
				<div class="flex h-8 w-8 items-center justify-center rounded-full bg-[#c7f43a] text-[#1a2310]">
					<ProfileIcon class="h-4 w-4" />
				</div>
				<div class="min-w-0">
					<p class="truncate text-sm font-semibold">{$page.data.session.user?.name ?? 'Profile'}</p>
					<p class="text-xs text-[#a6afb1]">Athlete</p>
				</div>
			</a>
			<a
				class="flex items-center gap-3 rounded-md border border-transparent px-3 py-2 text-sm text-[#a6afb1] transition-colors hover:border-[#2a3438] hover:bg-[#151d1f] hover:text-[#e5ebea]"
				href="/settings"
			>
				<SettingsIcon class="h-4 w-4" />
				<span>Settings</span>
			</a>
		{:else}
			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button builders={[builder]} class="w-full justify-start gap-3" size="sm" variant="ghost">
						<ProfileIcon class="h-4 w-4" />
						Sign in
					</Button>
				</DropdownMenu.Trigger>
				<LoginProviderMenu />
			</DropdownMenu.Root>
		{/if}
	</div>
</header>
<main class="flex h-[100dvh] w-full flex-col overflow-y-auto bg-background p-6 text-foreground">
	{@render children()}
</main>
