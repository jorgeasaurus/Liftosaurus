<script lang="ts">
	import ChevronDownIcon from 'virtual:icons/lucide/chevron-down';
	import PlayIcon from 'virtual:icons/lucide/play';
	import SunriseIcon from 'virtual:icons/lucide/sunrise';
	import type { PageData } from './$types';
	import DashboardMetricsCard from './(components)/DashboardMetricsCard.svelte';
	import GetStartedComponent from './(components)/GetStartedComponent.svelte';
	import TodaysWorkoutCard from './(components)/TodaysWorkoutCard.svelte';
	import { getRIRForWeek } from '$lib/utils/workoutUtils';

	let { data }: { data: PageData } = $props();

	const userName = data.session?.user?.name?.split(' ')[0] ?? 'there';
	const userLocale = typeof navigator !== 'undefined' ? navigator.language : 'en-US';
</script>

<section class="mobile-dashboard">
	{#await data.todaysWorkoutData then todaysWorkout}
		{@const workout = todaysWorkout.workoutOfMesocycle}
		{@const firstExercise = todaysWorkout.workoutExercises[0]}
		{@const rir = workout ? getRIRForWeek(workout.mesocycle.RIRProgression, workout.cycleNumber) : null}
		<div class="mobile-dashboard-intro">
			<div>
				<p class="mobile-eyebrow">
					TODAY · {new Date().toLocaleDateString(userLocale, { weekday: 'short', month: 'short', day: 'numeric' })}
				</p>
				<h1><SunriseIcon />Good morning, {userName}</h1>
			</div>
			<div class="mobile-plan-pill">{workout?.splitDayName ?? 'Upper Strength'}</div>
		</div>

		<div class="mobile-session-card">
			<div class="mobile-session-heading">
				<div>
					<p class="mobile-eyebrow lime">NEXT SESSION</p>
					<h2>{workout?.splitDayName ?? 'Upper Strength'}</h2>
					<p class="mobile-session-meta">
						{workout
							? `${rir} RIR target · ${todaysWorkout.workoutExercises.length} exercises`
							: 'Build a plan to unlock progressive overload'}
					</p>
				</div>
				<div class="mobile-session-mark">{workout ? String(workout.splitDayIndex + 1).padStart(2, '0') : '—'}</div>
			</div>

			<div class="mobile-session-divider"></div>
			<div class="mobile-next-set">
				<div>
					<p class="mobile-eyebrow">FIRST MOVEMENT</p>
					<p class="mobile-exercise">{firstExercise?.name ?? '—'}</p>
				</div>
			</div>

			<div class="mobile-rir-row">
				<span>Target effort</span>
				<span class="mobile-rir-chip">{rir !== null ? `RIR ${rir}` : '—'}</span>
			</div>
			<a class="mobile-primary-action" href="/workouts/manage/start">
				<PlayIcon />
				{workout ? 'Start workout' : 'Start a workout'}
			</a>
		</div>

		<div class="mobile-rest-card">
			<div class="mobile-rest-ring"><span>02:00</span></div>
			<div class="mobile-rest-copy">
				<p class="mobile-eyebrow">REST TIMER</p>
				<strong>Ready when you are</strong><span>Keep your next set intentional.</span>
			</div>
		</div>

		<div class="mobile-section-heading">
			<h2>Training snapshot</h2>
			<a href="/exercise-stats">View all</a>
		</div>
		<div class="mobile-stat-grid">
			<div class="mobile-stat-card"><span>12 day streak</span><strong>12</strong><small>Keep it going</small></div>
			<div class="mobile-stat-card"><span>Weekly volume</span><strong>14.2k</strong><small>lb · +8.4%</small></div>
		</div>

		<div class="mobile-progress-card">
			<div class="mobile-progress-card-heading">
				<div>
					<p class="mobile-eyebrow">PROGRESSION</p>
					<h2>Bench Press</h2>
				</div>
				<span class="mobile-trend-badge">+12 lb</span>
			</div>
			<div class="mobile-sparkline" aria-label="Bench Press progression trend">
				<i></i><i></i><i></i><i></i><i></i><i></i><i></i>
			</div>
			<div class="mobile-progress-footer">
				<span>Estimated 1RM</span><strong>205 lb</strong><span>Last 6 weeks</span>
			</div>
		</div>
	{:catch}
		<div class="mobile-session-card">
			<p>We could not load today’s workout.</p>
			<a class="mobile-primary-action" href="/dashboard">Try again</a>
		</div>
	{/await}
</section>

<section class="desktop-dashboard mx-auto flex w-full max-w-[1480px] flex-col gap-4">
	<header class="flex items-center justify-between">
		<h1 class="inline-flex items-center gap-3 text-[44px] font-semibold leading-none tracking-[-0.03em] text-[#f3f6f2]">
			<SunriseIcon class="h-7 w-7 text-[#c7f43a]" />Good morning
		</h1>
		<div class="flex items-center gap-3">
			<button
				class="inline-flex items-center gap-2 rounded-xl border border-[#273034] bg-[#171e20] px-4 py-3 text-sm font-medium text-[#f3f6f2]"
				type="button"
			>
				Upper Strength
				<ChevronDownIcon class="h-4 w-4 text-[#98a3b2]" />
			</button>
			<a
				class="inline-flex items-center gap-2 rounded-xl bg-[#c7f43a] px-7 py-3 text-sm font-semibold text-[#1b260f] transition-colors hover:bg-[#d2f95a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c7f43a]"
				href="/workouts/manage/start"
			>
				<PlayIcon class="h-4 w-4" />
				Start workout
			</a>
		</div>
	</header>

	<div class="grid grid-cols-12 gap-4">
		<div class="col-span-8 rounded-2xl border border-[#273034] bg-[#111719] p-5 shadow-[0_8px_20px_rgba(0,0,0,0.22)]">
			<TodaysWorkoutCard todaysWorkoutData={data.todaysWorkoutData} />
		</div>

		<aside class="col-span-4 space-y-4">
			{#await data.entityCounts then entityCounts}
				<div class="rounded-2xl border border-[#273034] bg-[#111719] p-4">
					<GetStartedComponent {entityCounts} />
				</div>
			{/await}
		</aside>
	</div>

	<div class="rounded-2xl border border-[#273034] bg-[#111719] p-4 shadow-[0_8px_20px_rgba(0,0,0,0.22)]">
		<DashboardMetricsCard chartData={data.dashboardChartData} />
	</div>
</section>

<style>
	.mobile-dashboard {
		display: none;
	}

	@media (max-width: 1023px) {
		.desktop-dashboard {
			display: none;
		}
		.mobile-dashboard {
			display: block;
			max-width: 560px;
			margin: 0 auto;
		}
		.mobile-dashboard-intro {
			display: flex;
			align-items: flex-start;
			justify-content: space-between;
			gap: 12px;
			margin-bottom: 18px;
		}
		.mobile-dashboard-intro h1 {
			display: flex;
			align-items: center;
			gap: 8px;
			margin: 4px 0 0;
			color: #f3f6f2;
			font-size: 25px;
			line-height: 1.1;
			letter-spacing: -0.04em;
		}
		.mobile-dashboard-intro h1 :global(svg) {
			width: 22px;
			height: 22px;
			color: #c7f43a;
		}
		.mobile-eyebrow {
			margin: 0;
			color: #8f999d;
			font-size: 10px;
			font-weight: 700;
			letter-spacing: 0.13em;
		}
		.mobile-eyebrow.lime {
			color: #c7f43a;
		}
		.mobile-plan-pill {
			display: inline-flex;
			align-items: center;
			border: 1px solid #1e2b2e;
			border-radius: 10px;
			background: transparent;
			padding: 9px 10px;
			color: #6b797d;
			font-size: 11px;
			font-weight: 600;
			white-space: nowrap;
			cursor: default;
			user-select: none;
		}
		.mobile-session-card,
		.mobile-rest-card,
		.mobile-stat-card,
		.mobile-progress-card {
			border: 1px solid #273034;
			background: #111719;
			box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2);
		}
		.mobile-session-card {
			border-radius: 18px;
			padding: 18px;
		}
		.mobile-session-heading,
		.mobile-next-set,
		.mobile-rir-row,
		.mobile-progress-card-heading,
		.mobile-progress-footer {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 12px;
		}
		.mobile-session-heading h2 {
			margin: 4px 0 4px;
			color: #f3f6f2;
			font-size: 22px;
			letter-spacing: -0.03em;
		}
		.mobile-session-meta {
			margin: 0;
			color: #8f999d;
			font-size: 12px;
		}
		.mobile-session-mark {
			display: grid;
			height: 42px;
			width: 42px;
			place-items: center;
			border: 1px solid #38453b;
			border-radius: 13px;
			color: #c7f43a;
			font-size: 16px;
			font-weight: 700;
		}
		.mobile-session-divider {
			height: 1px;
			margin: 18px 0;
			background: #273034;
		}
		.mobile-exercise {
			margin: 4px 0 0;
			color: #f3f6f2;
			font-size: 18px;
			font-weight: 600;
		}
		.mobile-rir-row {
			margin: 18px 0 14px;
			color: #8f999d;
			font-size: 12px;
		}
		.mobile-rir-chip {
			border: 1px solid #60752e;
			border-radius: 8px;
			padding: 7px 10px;
			color: #c7f43a;
			font-size: 12px;
			font-weight: 700;
		}
		.mobile-primary-action {
			display: flex;
			min-height: 50px;
			align-items: center;
			justify-content: center;
			gap: 8px;
			border-radius: 12px;
			background: #c7f43a;
			color: #18210d;
			font-size: 14px;
			font-weight: 800;
			text-decoration: none;
			transition:
				background 150ms ease,
				transform 150ms ease;
		}
		.mobile-primary-action:hover {
			background: #d8ff63;
		}
		.mobile-primary-action:active {
			transform: scale(0.99);
		}
		.mobile-primary-action :global(svg) {
			width: 17px;
			height: 17px;
		}
		.mobile-rest-card {
			display: flex;
			align-items: center;
			gap: 12px;
			margin-top: 12px;
			border-radius: 16px;
			padding: 12px;
		}
		.mobile-rest-ring {
			display: grid;
			height: 54px;
			width: 54px;
			flex: 0 0 auto;
			place-items: center;
			border: 3px solid #42512b;
			border-right-color: #c7f43a;
			border-radius: 999px;
			color: #c7f43a;
			font-size: 10px;
			font-weight: 800;
		}
		.mobile-rest-copy {
			min-width: 0;
			flex: 1;
		}
		.mobile-rest-copy strong,
		.mobile-rest-copy span {
			display: block;
		}
		.mobile-rest-copy strong {
			margin: 3px 0;
			overflow: hidden;
			color: #f3f6f2;
			font-size: 12px;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		.mobile-rest-copy span {
			color: #8f999d;
			font-size: 11px;
		}

		.mobile-section-heading {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin: 26px 2px 10px;
		}
		.mobile-section-heading h2 {
			margin: 0;
			color: #f3f6f2;
			font-size: 16px;
			letter-spacing: -0.02em;
		}
		.mobile-section-heading a {
			color: #c7f43a;
			font-size: 11px;
			font-weight: 700;
			text-decoration: none;
		}
		.mobile-stat-grid {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 10px;
		}
		.mobile-stat-card {
			min-height: 106px;
			border-radius: 15px;
			padding: 14px;
		}
		.mobile-stat-card span,
		.mobile-stat-card small {
			display: block;
			color: #8f999d;
			font-size: 11px;
		}
		.mobile-stat-card strong {
			display: block;
			margin: 8px 0 2px;
			color: #f3f6f2;
			font-size: 25px;
			letter-spacing: -0.05em;
		}
		.mobile-progress-card {
			margin-top: 10px;
			border-radius: 16px;
			padding: 15px;
		}
		.mobile-progress-card h2 {
			margin: 4px 0 0;
			color: #f3f6f2;
			font-size: 16px;
		}
		.mobile-trend-badge {
			border-radius: 7px;
			background: #26331b;
			padding: 6px 8px;
			color: #c7f43a;
			font-size: 11px;
			font-weight: 700;
		}
		.mobile-sparkline {
			display: flex;
			height: 78px;
			align-items: end;
			gap: 7px;
			margin: 18px 0 12px;
			border-bottom: 1px solid #273034;
			background: linear-gradient(to bottom, transparent 49%, rgba(39, 48, 52, 0.4) 50%, transparent 51%);
		}
		.mobile-sparkline i {
			display: block;
			width: 100%;
			border-radius: 5px 5px 0 0;
			background: #c7f43a;
			opacity: 0.9;
			transform-origin: bottom;
		}
		.mobile-sparkline i:nth-child(1) {
			height: 30%;
		}
		.mobile-sparkline i:nth-child(2) {
			height: 42%;
		}
		.mobile-sparkline i:nth-child(3) {
			height: 38%;
		}
		.mobile-sparkline i:nth-child(4) {
			height: 57%;
		}
		.mobile-sparkline i:nth-child(5) {
			height: 64%;
		}
		.mobile-sparkline i:nth-child(6) {
			height: 76%;
		}
		.mobile-sparkline i:nth-child(7) {
			height: 90%;
			background: #e1ff73;
		}
		.mobile-progress-footer {
			color: #8f999d;
			font-size: 11px;
		}
		.mobile-progress-footer strong {
			margin-left: auto;
			color: #f3f6f2;
			font-size: 13px;
		}
	}
</style>
