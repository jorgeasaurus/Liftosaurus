<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
	import type { HomePageCounts } from './+page.server';
	import { mode } from 'mode-watcher';
	import ChartColumnIcon from 'virtual:icons/lucide/chart-column';
	import Clock3Icon from 'virtual:icons/lucide/clock-3';
	import DumbbellIcon from 'virtual:icons/lucide/dumbbell';
	import GithubIcon from 'virtual:icons/lucide/github';
	import MessageCircleQuestionIcon from 'virtual:icons/lucide/message-circle-question';
	import Settings2Icon from 'virtual:icons/lucide/settings-2';
	import SmartphoneIcon from 'virtual:icons/lucide/smartphone';
	import StarIcon from 'virtual:icons/lucide/star';
	import TrendingUpIcon from 'virtual:icons/lucide/trending-up';
	import LoginProviderMenu from './(components)/layout/LoginProviderMenu.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { onMount } from 'svelte';

	let { data }: { data: HomePageCounts } = $props();
	let stars: number | undefined = $state();

	const screenshots = [
		{ src: 'SplitDayChart', alt: 'Exercise split volume chart' },
		{ src: 'MicrocycleVolumeDistributionChart', alt: 'Microcycle volume distribution chart' },
		{ src: 'MuscleGroupVolumeDistributionChart', alt: 'Muscle group volume distribution chart' }
	] as const;

	const features = [
		{
			title: 'Automatic progression',
			description:
				'Increase reps and load from your actual performance, so your next session is ready without spreadsheet work.',
			icon: TrendingUpIcon
		},
		{
			title: 'Useful stats, not vanity charts',
			description:
				'Compare performance, volume, and bodyweight trends to spot what is actually moving training forward.',
			icon: ChartColumnIcon
		},
		{
			title: 'Customizable when your plan changes',
			description:
				'Adjust splits mid-mesocycle, override progression per exercise, and keep training moving when real life happens.',
			icon: Settings2Icon
		}
	] as const;

	const faqs = [
		{
			question: 'Is it really free?',
			answer:
				"The app is open source and intended to stay that way. It runs on Vercel and Supabase's free tiers today, and anyone can self-host it if needed."
		},
		{
			question: 'How do I install it?',
			answer:
				'Liftosaurus is a PWA, so you can use it in the browser or install it from supported browsers using the install action in the header.'
		},
		{
			question: 'Can I request a feature?',
			answer: 'Yes. Open an issue on GitHub and describe the training problem you want solved.'
		},
		{
			question: 'Does it work offline?',
			answer: 'Not yet. Offline support is planned, but the current experience expects a connection.'
		}
	] as const;

	function formatNumber(num: number) {
		if (num >= 100000) return `${(num / 1000).toFixed(0)}k`;
		if (num >= 10000) return `${(num / 1000).toFixed(1)}k`;
		return num.toString();
	}

	onMount(async () => {
		const response = await fetch('https://api.github.com/repos/jorgeasaurus/Liftosaurus');
		const body = await response.json();
		stars = body.stargazers_count;
	});
</script>

<section class="mx-auto flex w-full max-w-6xl flex-col gap-14 pb-12 lg:gap-20 lg:pb-16">
	<div class="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:gap-12">
		<div class="flex flex-col gap-6 lg:gap-7">
			<div class="flex flex-wrap items-center gap-3">
				<Badge variant="secondary" class="gap-2 px-3 py-1 text-[11px] uppercase tracking-[0.14em]">
					<DumbbellIcon class="h-3.5 w-3.5" />
					Science-based workout tracking
				</Badge>
				<div class="inline-flex items-center gap-2 text-sm text-muted-foreground">
					<SmartphoneIcon class="h-4 w-4 text-primary" />
					Browser-first PWA
				</div>
			</div>

			<div class="space-y-4">
				<h1 class="max-w-[11ch] text-balance text-5xl font-semibold tracking-[-0.04em] text-foreground sm:text-6xl">
					Train hard. Track clearly. Progress on purpose.
				</h1>
				<p class="max-w-[62ch] text-pretty text-lg leading-8 text-muted-foreground">
					Liftosaurus helps you run science-based lifting without juggling notes, spreadsheets, or guesswork. Build
					mesocycles, log workouts fast, and let progression update from what you actually did.
				</p>
			</div>

			<div class="grid gap-3 sm:grid-cols-3">
				<div class="rounded-2xl border bg-card/85 p-4 shadow-sm">
					<div class="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
						<Clock3Icon class="h-4 w-4 text-primary" />
						Fast logging
					</div>
					<p class="text-sm leading-6 text-muted-foreground">Capture training without breaking flow between sets.</p>
				</div>
				<div class="rounded-2xl border bg-card/85 p-4 shadow-sm">
					<div class="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
						<TrendingUpIcon class="h-4 w-4 text-primary" />
						Real progression
					</div>
					<p class="text-sm leading-6 text-muted-foreground">
						Prescriptions adapt from past performance instead of static plans.
					</p>
				</div>
				<div class="rounded-2xl border bg-card/85 p-4 shadow-sm">
					<div class="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
						<ChartColumnIcon class="h-4 w-4 text-primary" />
						Meaningful insight
					</div>
					<p class="text-sm leading-6 text-muted-foreground">
						Review trends that help you adjust training, not just admire dashboards.
					</p>
				</div>
			</div>

			<div class="flex flex-wrap items-center gap-3">
				<Button href="https://github.com/jorgeasaurus/Liftosaurus" class="gap-2">
					<GithubIcon class="h-4 w-4" />
					View on GitHub
				</Button>
				{#if data.session === null}
					<DropdownMenu.Root>
						<DropdownMenu.Trigger asChild let:builder>
							<Button builders={[builder]} variant="secondary">Sign in to start lifting</Button>
						</DropdownMenu.Trigger>
						<LoginProviderMenu />
					</DropdownMenu.Root>
				{/if}
				<div class="inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm text-muted-foreground">
					<StarIcon class="h-4 w-4 text-primary" />
					{#if stars === undefined}
						<Skeleton class="h-4 w-14" />
					{:else}
						<span>{stars} GitHub stars</span>
					{/if}
				</div>
			</div>
		</div>

		<div class="relative">
			<div class="absolute inset-0 -z-10 rounded-[2rem] bg-primary/10 blur-3xl"></div>
			<div class="rounded-[2rem] border bg-card/90 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.16)] backdrop-blur sm:p-5">
				<div
					class="grid gap-4 sm:grid-cols-[minmax(0,1.25fr)_minmax(140px,0.75fr)] lg:grid-cols-1 xl:grid-cols-[minmax(0,1.25fr)_minmax(160px,0.75fr)]"
				>
					<div class="overflow-hidden rounded-[1.5rem] border bg-background">
						<img
							class="brand-screenshot h-full w-full object-cover object-top"
							src="/screenshots/{$mode}/SplitDayChart.webp"
							alt="Liftosaurus exercise split volume chart"
							width={720}
							height={520}
						/>
					</div>
					<div class="grid gap-4 sm:grid-rows-2 lg:grid-cols-2 xl:grid-cols-1 xl:grid-rows-2">
						{#each screenshots.slice(1) as shot}
							<div class="overflow-hidden rounded-[1.25rem] border bg-background">
								<img
									class="brand-screenshot h-full w-full object-cover object-top"
									src={`/screenshots/${$mode}/${shot.src}.webp`}
									alt={shot.alt}
									width={320}
									height={220}
								/>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>

	<section class="grid gap-4 md:grid-cols-3">
		<Card.Root class="rounded-2xl bg-card/85 shadow-sm">
			<Card.Header class="gap-2">
				<Card.Description>Already logged</Card.Description>
				<Card.Title class="text-4xl tracking-[-0.04em]">
					{#await data.workoutCount}
						<Skeleton class="h-11 w-24" />
					{:then count}
						{formatNumber(count)}
					{/await}
				</Card.Title>
			</Card.Header>
			<Card.Content class="pt-0 text-sm text-muted-foreground"
				>workouts from real users building momentum over time</Card.Content
			>
		</Card.Root>
		<Card.Root class="rounded-2xl bg-card/85 shadow-sm">
			<Card.Header class="gap-2">
				<Card.Description>Exercises tracked</Card.Description>
				<Card.Title class="text-4xl tracking-[-0.04em]">
					{#await data.exerciseCount}
						<Skeleton class="h-11 w-24" />
					{:then count}
						{formatNumber(count)}
					{/await}
				</Card.Title>
			</Card.Header>
			<Card.Content class="pt-0 text-sm text-muted-foreground"
				>across customized splits, mesocycles, and progression strategies</Card.Content
			>
		</Card.Root>
		<Card.Root class="rounded-2xl bg-card/85 shadow-sm">
			<Card.Header class="gap-2">
				<Card.Description>Total sets recorded</Card.Description>
				<Card.Title class="text-4xl tracking-[-0.04em]">
					{#await data.setsCount}
						<Skeleton class="h-11 w-24" />
					{:then count}
						{formatNumber(count)}
					{/await}
				</Card.Title>
			</Card.Header>
			<Card.Content class="pt-0 text-sm text-muted-foreground"
				>documented with reps, load, and performance history ready to review</Card.Content
			>
		</Card.Root>
	</section>

	<section class="grid gap-4 lg:grid-cols-3">
		{#each features as feature}
			<Card.Root class="rounded-2xl bg-card/85 shadow-sm">
				<Card.Header class="gap-4">
					<div class="bg-primary/12 flex h-11 w-11 items-center justify-center rounded-2xl text-primary">
						<feature.icon class="h-5 w-5" />
					</div>
					<div class="space-y-2">
						<Card.Title class="text-xl tracking-tight">{feature.title}</Card.Title>
						<Card.Description class="text-sm leading-6 text-muted-foreground">{feature.description}</Card.Description>
					</div>
				</Card.Header>
			</Card.Root>
		{/each}
	</section>

	<section class="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start">
		<div class="space-y-4">
			<h2 class="text-3xl font-semibold tracking-[-0.03em] text-foreground">Why people stay with it</h2>
			<p class="max-w-[60ch] text-base leading-7 text-muted-foreground">
				The core promise is simple: spend less time managing your training system and more time executing it.
				Liftosaurus keeps mesocycle structure, progression logic, and reviewable history in one place.
			</p>
			<div class="rounded-2xl border bg-card/85 p-5 shadow-sm">
				<p class="text-sm leading-7 text-muted-foreground">
					If you like tinkering, you can customize aggressively. If you just want to log and go, the defaults are strong
					enough to stay out of your way.
				</p>
			</div>
		</div>

		<div class="rounded-2xl border bg-card/85 p-5 shadow-sm sm:p-6">
			<div class="mb-4 flex items-center gap-3">
				<div class="bg-primary/12 flex h-10 w-10 items-center justify-center rounded-2xl text-primary">
					<MessageCircleQuestionIcon class="h-5 w-5" />
				</div>
				<h2 class="text-2xl font-semibold tracking-tight">FAQ</h2>
			</div>
			<Accordion.Root class="w-full">
				{#each faqs as faq, index}
					<Accordion.Item value={`item-${index}`}>
						<Accordion.Trigger>{faq.question}</Accordion.Trigger>
						<Accordion.Content class="leading-7 text-muted-foreground">
							{#if faq.question === 'Can I request a feature?'}
								Yes. Open an issue on
								<a
									class="text-primary underline underline-offset-4"
									href="https://github.com/jorgeasaurus/Liftosaurus/issues">GitHub</a
								>
								and describe the training problem you want solved.
							{:else}
								{faq.answer}
							{/if}
						</Accordion.Content>
					</Accordion.Item>
				{/each}
			</Accordion.Root>
		</div>
	</section>
</section>
