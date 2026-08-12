<script lang="ts">
	import ArrowIcon from 'virtual:icons/lucide/chevron-right';
	import ChangelogIcon from 'virtual:icons/lucide/history';
	import DocsIcon from 'virtual:icons/lucide/book-open';
	import HeartIcon from 'virtual:icons/lucide/heart';
	import ProfileIcon from 'virtual:icons/lucide/circle-user-round';
	import SettingsIcon from 'virtual:icons/lucide/settings';
	import ShieldIcon from 'virtual:icons/lucide/shield-check';

	const sections = [
		{
			label: 'Account',
			items: [
				{ title: 'Profile', description: 'Training totals and account details', href: '/profile', icon: ProfileIcon },
				{
					title: 'Settings',
					description: 'Data, notifications, and preferences',
					href: '/settings',
					icon: SettingsIcon
				}
			]
		},
		{
			label: 'Support',
			items: [
				{ title: 'Documentation', description: 'How Liftosaurus models your training', href: '/docs', icon: DocsIcon },
				{ title: 'Changelog', description: 'Recent fixes and improvements', href: '/changelog', icon: ChangelogIcon },
				{
					title: 'Support the project',
					description: 'Help keep Liftosaurus independent',
					href: '/donations',
					icon: HeartIcon
				}
			]
		},
		{
			label: 'Legal',
			items: [
				{ title: 'Privacy policy', description: 'How your data is handled', href: '/privacy-policy', icon: ShieldIcon },
				{
					title: 'Terms of service',
					description: 'Terms for using Liftosaurus',
					href: '/terms-of-service',
					icon: DocsIcon
				}
			]
		}
	] as const;
</script>

<svelte:head>
	<title>More · Liftosaurus</title>
	<meta name="description" content="Account, settings, support, and legal information." />
</svelte:head>

<section class="mx-auto flex w-full max-w-2xl flex-col gap-5">
	<header>
		<p class="text-xs font-semibold uppercase tracking-[0.14em] text-[#9dadbe]">Liftosaurus</p>
		<h1 class="mt-1 text-3xl font-semibold tracking-[-0.035em] text-[#e9eef5]">More</h1>
	</header>

	{#each sections as section}
		<section aria-labelledby={`more-${section.label.toLowerCase()}`}>
			<h2
				id={`more-${section.label.toLowerCase()}`}
				class="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#7f8e9d]"
			>
				{section.label}
			</h2>
			<div class="overflow-hidden rounded-2xl border border-[#252c34] bg-[#11161d]">
				{#each section.items as item, index}
					<a
						class={`group flex min-h-16 items-center gap-3 px-4 py-3 transition-colors hover:bg-[#151c24] active:bg-[#18212a] ${index < section.items.length - 1 ? 'border-b border-[#252c34]' : ''}`}
						href={item.href}
					>
						<item.icon class="h-5 w-5 shrink-0 text-[#a8b6c5]" />
						<span class="min-w-0 flex-1">
							<span class="block text-sm font-semibold text-[#e9eef5]">{item.title}</span>
							<span class="block truncate text-xs text-[#8797a7]">{item.description}</span>
						</span>
						<ArrowIcon class="h-4 w-4 shrink-0 text-[#657483] transition-transform group-hover:translate-x-0.5" />
					</a>
				{/each}
			</div>
		</section>
	{/each}
</section>
