<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';
	import { pwaInfo } from 'virtual:pwa-info';
	import '../app.pcss';
	import DesktopLayout from './(components)/layout/DesktopLayout.svelte';
	import MobileLayout from './(components)/layout/MobileLayout.svelte';
	import UpdateDataLossDialog from './(components)/layout/UpdateDataLossDialog.svelte';
	import TermsOfServiceDialog from '$lib/components/TermsOfServiceDialog.svelte';
	import { workoutRunes } from './workouts/manage/workoutRunes.svelte';
	import type { LayoutData } from './$types';

	import { overrideItemIdKeyNameBeforeInitialisingDndZones } from 'svelte-dnd-action';
	overrideItemIdKeyNameBeforeInitialisingDndZones('name');

	let { children, data }: { children: Snippet; data: LayoutData } = $props();
	if (browser) workoutRunes.bindSession(data.session?.user?.id ?? null);
	$effect(() => {
		if (browser) workoutRunes.bindSession(data.session?.user?.id ?? null);
	});
	const webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : '';
	let isMobile: undefined | boolean = $state(undefined);

	onMount(() => {
		isMobile = window.innerWidth < 1024;
		window.addEventListener('resize', () => {
			isMobile = window.innerWidth < 1024;
		});
	});
</script>

<svelte:head>
	<!-- eslint-disable -->
	{@html webManifestLink}
</svelte:head>

<ModeWatcher />
<Toaster />

{#if page.url.pathname === '/'}
	<main class="landing-shell">{@render children()}</main>
{:else}
	<UpdateDataLossDialog />
	<TermsOfServiceDialog />

	{#if isMobile === true}
		<MobileLayout>{@render children()}</MobileLayout>
	{:else if isMobile === false}
		<DesktopLayout>{@render children()}</DesktopLayout>
	{/if}
{/if}

<style>
	.landing-shell {
		min-height: 100dvh;
		width: 100%;
	}
</style>
