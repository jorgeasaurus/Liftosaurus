<script lang="ts">
	import ArrowIcon from 'virtual:icons/lucide/arrow-up-right';
	import CalendarIcon from 'virtual:icons/lucide/calendar-days';
	import ImportIcon from 'virtual:icons/lucide/file-input';
	import SplitIcon from 'virtual:icons/lucide/panel-top';
	import TemplateIcon from 'virtual:icons/lucide/layout-template';

	const planLinks = [
		{
			title: 'Mesocycles',
			description: 'Run progressive training blocks and review the current cycle.',
			href: '/mesocycles',
			icon: CalendarIcon
		},
		{
			title: 'Exercise splits',
			description: 'Build the weekly structure that your mesocycles use.',
			href: '/exercise-splits',
			icon: SplitIcon
		},
		{
			title: 'Split templates',
			description: 'Start from a proven structure, then make it yours.',
			href: '/exercise-splits/templates',
			icon: TemplateIcon
		},
		{
			title: 'Import a split',
			description: 'Bring an existing Liftosaurus split into your library.',
			href: '/exercise-splits/import',
			icon: ImportIcon
		}
	] as const;
</script>

<svelte:head>
	<title>Plans · Liftosaurus</title>
	<meta name="description" content="Manage mesocycles, exercise splits, and training templates." />
</svelte:head>

<section class="mx-auto flex w-full max-w-3xl flex-col gap-5">
	<header>
		<p class="text-xs font-semibold uppercase tracking-[0.14em] text-[#9dadbe]">Programming</p>
		<h1 class="mt-1 text-3xl font-semibold tracking-[-0.035em] text-[#e9eef5]">Plans</h1>
		<p class="mt-1 max-w-[60ch] text-sm leading-relaxed text-[#9dadbe]">
			Build the structure once, then keep training decisions close at hand.
		</p>
	</header>

	<div class="grid gap-2 sm:grid-cols-2">
		{#each planLinks as item}
			<a
				class="group flex min-h-28 items-start gap-3 rounded-2xl border border-[#252c34] bg-[#11161d] p-4 text-left transition duration-200 hover:border-[#34404b] hover:bg-[#151c24] active:scale-[0.99]"
				href={item.href}
			>
				<span class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#1b252c] text-[#c7f43a]">
					<item.icon class="h-5 w-5" />
				</span>
				<span class="min-w-0 flex-1">
					<span class="block font-semibold text-[#e9eef5]">{item.title}</span>
					<span class="mt-1 block text-sm leading-snug text-[#9dadbe]">{item.description}</span>
				</span>
				<ArrowIcon
					class="h-4 w-4 shrink-0 text-[#71808f] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
				/>
			</a>
		{/each}
	</div>
</section>
