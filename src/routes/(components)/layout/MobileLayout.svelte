<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import ModeToggle from '$lib/components/ModeToggle.svelte';
	import UserAvatar from './UserAvatar.svelte';
	import UserDropdown from './UserDropdown.svelte';
	import LoginProviderMenu from './LoginProviderMenu.svelte';
	import PWAButtons from './PWAButtons.svelte';
	import { page } from '$app/stores';
	import { getMobileSection, isWorkoutManagementPath, mobileSections } from '$lib/navigation/mobileNavigation';
	import type { Snippet } from 'svelte';
	import HomeIcon from 'virtual:icons/lucide/house';
	import HistoryIcon from 'virtual:icons/lucide/history';
	import ExercisesIcon from 'virtual:icons/lucide/dumbbell';
	import PlansIcon from 'virtual:icons/lucide/calendar-days';
	import MoreIcon from 'virtual:icons/lucide/menu';

	let { children }: { children: Snippet } = $props();

	const icons = { workout: HomeIcon, history: HistoryIcon, plans: PlansIcon, exercises: ExercisesIcon, more: MoreIcon };
	let activeSection = $derived(getMobileSection($page.url.pathname));
	let isFocusedWorkout = $derived(isWorkoutManagementPath($page.url.pathname));
	let isExerciseLogging = $derived($page.url.pathname === '/workouts/manage/exercises');
</script>

<header class="mobile-topbar" class:compact={isFocusedWorkout}>
	<a class="mobile-brand" href="/dashboard" aria-label="Liftosaurus home">
		<img alt="" class="brand-logo" height="30" src="/favicon.webp" width="30" />
		{#if !isFocusedWorkout}
			<span>Liftosaurus</span>
		{/if}
	</a>
	<div class="mobile-topbar-actions">
		{#if !isFocusedWorkout}
			<PWAButtons isMobile={true} />
			<ModeToggle />
		{/if}
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
<main class="mobile-main" class:focused={isExerciseLogging}>
	{@render children()}
</main>

<nav class="mobile-bottom-nav" aria-label="Primary navigation">
	{#each mobileSections as item}
		{@const Icon = icons[item.id]}
		<a
			class:active={activeSection === item.id}
			href={item.href}
			aria-current={activeSection === item.id ? 'page' : undefined}
		>
			<Icon aria-hidden="true" />
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
		height: calc(62px + env(safe-area-inset-top));
		align-items: center;
		justify-content: space-between;
		padding: env(safe-area-inset-top) max(20px, env(safe-area-inset-right)) 0 max(20px, env(safe-area-inset-left));
		border-bottom: 1px solid #273034;
		background: rgba(9, 13, 14, 0.92);
		backdrop-filter: blur(16px);
	}

	.mobile-topbar.compact {
		height: calc(48px + env(safe-area-inset-top));
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
		min-width: 0;
		max-width: 100%;
		width: 100%;
		flex: 1;
		overflow-x: hidden;
		overflow-y: auto;
		padding: 20px max(16px, env(safe-area-inset-right)) 24px max(16px, env(safe-area-inset-left));
	}

	.mobile-main.focused {
		overflow: hidden;
		padding: 12px max(12px, env(safe-area-inset-right)) 16px max(12px, env(safe-area-inset-left));
	}

	.mobile-bottom-nav {
		flex: none;
		z-index: 30;
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 4px;
		padding: 8px max(12px, env(safe-area-inset-right)) calc(8px + env(safe-area-inset-bottom))
			max(12px, env(safe-area-inset-left));
		border-top: 1px solid #273034;
		background: rgba(15, 21, 22, 0.96);
		backdrop-filter: blur(18px);
	}

	.mobile-bottom-nav a {
		position: relative;
		display: flex;
		min-height: 52px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 4px;
		border-radius: 14px;
		color: #8f999d;
		font-size: 11px;
		font-weight: 600;
		transition:
			color 150ms ease,
			background 150ms ease,
			transform 150ms ease;
	}

	.mobile-bottom-nav a:active {
		transform: scale(0.96);
	}

	.mobile-bottom-nav a :global(svg) {
		height: 19px;
		width: 19px;
	}

	.mobile-bottom-nav a.active {
		background: #171e20;
		color: #c7f43a;
		box-shadow: inset 0 1px 0 rgb(255 255 255 / 4%);
	}

	.mobile-bottom-nav a.active::before {
		position: absolute;
		top: 4px;
		left: 50%;
		width: 18px;
		height: 2px;
		border-radius: 999px;
		background: #c7f43a;
		content: '';
		transform: translateX(-50%);
	}

	@media (prefers-reduced-motion: reduce) {
		.mobile-bottom-nav a {
			transition: none;
		}
	}
</style>
