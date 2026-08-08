<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import GitHubIcon from 'virtual:icons/mdi/github';
	import AgentIcon from 'virtual:icons/lucide/bot';
	import { page } from '$app/stores';
	import { invalidateAll } from '$app/navigation';
	import { signIn } from '@auth/sveltekit/client';
	import * as Badge from '$lib/components/ui/badge';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	const LAST_USED_PROVIDER_KEY = 'last-used-auth-provider';

	const providerList = [{ name: 'github', logo: GitHubIcon, displayName: 'GitHub' }];

	let lastUsedProvider = $state<string | null>(null);
	let agentLoginPending = $state(false);
	let sortedProviders = $derived(
		[...providerList].sort((a, b) => {
			if (a.name === lastUsedProvider) return -1;
			if (b.name === lastUsedProvider) return 1;
			return 0;
		})
	);

	onMount(() => {
		if (typeof window !== 'undefined') {
			lastUsedProvider = localStorage.getItem(LAST_USED_PROVIDER_KEY);
		}
	});

	const handleSignIn = (providerName: string) => {
		if (typeof window !== 'undefined') {
			localStorage.setItem(LAST_USED_PROVIDER_KEY, providerName);
		}
		signIn(providerName, { callbackUrl: $page.url.pathname });
	};

	async function handleAgentSignIn() {
		agentLoginPending = true;
		try {
			const response = await fetch('/api/agent-login', { method: 'POST' });
			if (!response.ok) throw new Error(await response.text());
			localStorage.setItem(LAST_USED_PROVIDER_KEY, 'agent');
			try {
				await invalidateAll();
			} catch {
				window.location.reload();
			}
		} catch {
			toast.error('Agent login failed');
		} finally {
			agentLoginPending = false;
		}
	}
</script>

<DropdownMenu.Content align="start">
	<DropdownMenu.Group>
		{#each sortedProviders as { name, logo, displayName }}
			<DropdownMenu.Item class="gap-2" onclick={() => handleSignIn(name)}>
				{@const Component = logo}
				<Component class="h-6 w-6 lg:h-7 lg:w-7" />

				<span class="flex-1 capitalize">{displayName}</span>
				{#if name === lastUsedProvider}
					<Badge.Badge variant="secondary" class="ml-auto px-1.5 py-0 text-[10px]">Last used</Badge.Badge>
				{/if}
			</DropdownMenu.Item>
		{/each}
		{#if $page.data.agentLoginEnabled}
			<DropdownMenu.Item class="gap-2" disabled={agentLoginPending} onclick={handleAgentSignIn}>
				<AgentIcon class="h-6 w-6 lg:h-7 lg:w-7" />
				<span class="flex-1">{agentLoginPending ? 'Signing in…' : 'Agent test account'}</span>
				{#if lastUsedProvider === 'agent'}
					<Badge.Badge variant="secondary" class="ml-auto px-1.5 py-0 text-[10px]">Last used</Badge.Badge>
				{/if}
			</DropdownMenu.Item>
		{/if}
	</DropdownMenu.Group>
</DropdownMenu.Content>
