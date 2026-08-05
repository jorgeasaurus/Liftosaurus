<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import ModeToggle from '$lib/components/ModeToggle.svelte';
	import UserAvatar from './UserAvatar.svelte';
	import UserDropdown from './UserDropdown.svelte';
	import LoginProviderMenu from './LoginProviderMenu.svelte';
	import PWAButtons from './PWAButtons.svelte';
	import { page } from '$app/stores';
	import type { Snippet } from 'svelte';
	import HomeIcon from 'virtual:icons/lucide/house';
	import WorkoutsIcon from 'virtual:icons/lucide/clipboard-list';
	import ProgressIcon from 'virtual:icons/lucide/chart-column';
	import PlansIcon from 'virtual:icons/lucide/calendar-days';
	import ProfileIcon from 'virtual:icons/lucide/circle-user-round';

	let { children }: { children: Snippet } = $props();

	const navLinks = [
		{ label: 'Today', href: '/dashboard', icon: HomeIcon },
		{ label: 'Workouts', href: '/workouts', icon: WorkoutsIcon },
		{ label: 'Progress', href: '/exercise-stats', icon: ProgressIcon },
		{ label: 'Plans', href: '/mesocycles', icon: PlansIcon },
		{ label: 'Profile', href: '/profile', icon: ProfileIcon }
	] as const;

	const isActive = (href: string) =>
		href === '/dashboard' ? $page.url.pathname.startsWith('/dashboard') : $page.url.pathname.startsWith(href);
</script>

<header class="mobile-topbar">
	<a class="mobile-brand" href="/dashboard" aria-label="Liftosaurus home">
		<img alt="" class="brand-logo" height="30" src="/favicon.webp" width="30" />
		<span>Liftosaurus</span>
	</a>
	<div class="mobile-topbar-actions">
		<PWAButtons isMobile={true} />
		<ModeToggle />
		{#if $page.data.session}
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<Button class="mobile-avatar-button" size="icon" variant="ghost" aria-label="Open profile menu">
						<UserAvatar session={$page.data.session} />
					</Button>
				</DropdownMenu.Trigger>
				<UserDropdown />
			</DropdownMenu.Root>
		{:else}
			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button builders={[builder]} size="sm" variant="ghost">Login</Button>
				</DropdownMenu.Trigger>
				<LoginProviderMenu />
			</DropdownMenu.Root>
		{/if}
	</div>
</header>
<main class="mobile-main">
	{@render children()}
</main>

<nav class="mobile-bottom-nav" aria-label="Primary navigation">
	{#each navLinks as item}
		<a class:active={isActive(item.href)} href={item.href} aria-current={isActive(item.href) ? 'page' : undefined}>
			<item.icon aria-hidden="true" />
			<span>{item.label}</span>
		</a>
	{/each}
</nav>

<style>
	.mobile-topbar {
		position: sticky;
		top: 0;
		z-index: 20;
		display: flex;
		height: 62px;
		align-items: center;
		justify-content: space-between;
		padding: 0 16px;
		border-bottom: 1px solid #273034;
		background: rgba(9, 13, 14, 0.92);
		backdrop-filter: blur(16px);
	}

	.mobile-brand {
		display: inline-flex;
		align-items: center;
		gap: 9px;
		color: #f3f6f2;
		font-size: 16px;
		font-weight: 700;
		letter-spacing: -0.02em;
	}

	.mobile-brand img {
		object-fit: contain;
	}

	.mobile-topbar-actions {
		display: flex;
		align-items: center;
		gap: 2px;
	}

	:global(.mobile-avatar-button) {
		height: 38px;
		width: 38px;
		border: 1px solid #2a3438;
		border-radius: 999px;
		background: #171e20;
		padding: 3px;
	}

	.mobile-main {
		min-height: 0;
		width: 100%;
		flex: 1;
		overflow-y: auto;
		padding: 20px 16px 104px;
	}

	.mobile-bottom-nav {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 30;
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 2px;
		padding: 9px 8px calc(9px + env(safe-area-inset-bottom));
		border-top: 1px solid #273034;
		background: rgba(15, 21, 22, 0.96);
		backdrop-filter: blur(18px);
	}

	.mobile-bottom-nav a {
		display: flex;
		min-height: 48px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 4px;
		border-radius: 12px;
		color: #8f999d;
		font-size: 10px;
		font-weight: 600;
		transition:
			color 150ms ease,
			background 150ms ease;
	}

	.mobile-bottom-nav a :global(svg) {
		height: 19px;
		width: 19px;
	}

	.mobile-bottom-nav a.active {
		background: #171e20;
		color: #c7f43a;
	}
</style>
