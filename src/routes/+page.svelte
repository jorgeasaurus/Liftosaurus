<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import Button from '$lib/components/ui/button/button.svelte';
	import LoginProviderMenu from './(components)/layout/LoginProviderMenu.svelte';
	import ArrowUpRight from 'virtual:icons/lucide/arrow-up-right';
	import BarChart3 from 'virtual:icons/lucide/chart-no-axes-combined';
	import Dumbbell from 'virtual:icons/lucide/dumbbell';
	import Sparkles from 'virtual:icons/lucide/sparkles';

	const proofPoints = ['Build your routine', 'Log every set', 'See the trend'];
</script>

<svelte:head>
	<title>Liftosaurus — Train with purpose</title>
	<meta name="description" content="A science-based workout tracker built to make consistent training simpler." />
</svelte:head>

<div class="landing-page">
	<div class="topline"></div>
	<header class="landing-header">
		<a class="wordmark" href="/" aria-label="Liftosaurus home">
			<Dumbbell aria-hidden="true" />
			<span>Liftosaurus</span>
		</a>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild let:builder>
				<Button builders={[builder]} class="signin-button" variant="ghost">Sign in</Button>
			</DropdownMenu.Trigger>
			<LoginProviderMenu />
		</DropdownMenu.Root>
	</header>

	<main>
		<section class="hero" aria-labelledby="landing-title">
			<div class="hero-copy">
				<p class="eyebrow"><Sparkles aria-hidden="true" /> Built for the long run</p>
				<h1 id="landing-title">Train with <em>clarity.</em><br />Progress with proof.</h1>
				<p class="intro">
					Your training log should do more than remember numbers. Liftosaurus turns every session into a clear next
					step.
				</p>
				<div class="hero-actions">
					<DropdownMenu.Root>
						<DropdownMenu.Trigger asChild let:builder>
							<Button builders={[builder]} class="start-button">
								Start tracking free <ArrowUpRight aria-hidden="true" />
							</Button>
						</DropdownMenu.Trigger>
						<LoginProviderMenu />
					</DropdownMenu.Root>
					<a class="learn-link" href="#how-it-works">See how it works <span>↓</span></a>
				</div>
			</div>

			<div class="training-card" aria-label="Example workout progress">
				<div class="card-header">
					<span class="card-label">TODAY'S SESSION</span>
					<span class="live-pill"><i></i> READY</span>
				</div>
				<div class="session-title">
					<div class="session-mark">03</div>
					<div><strong>Upper A</strong><small>Strength &amp; hypertrophy</small></div>
				</div>
				<div class="exercise-row"><span>Barbell bench press</span><b>4 × 6–8</b></div>
				<div class="progress-line"><span></span></div>
				<div class="card-footer">
					<span>Next target</span><strong>67.5 kg <ArrowUpRight aria-hidden="true" /></strong>
				</div>
			</div>
		</section>

		<section id="how-it-works" class="proof-strip" aria-label="How Liftosaurus works">
			{#each proofPoints as point, i}
				<div>
					<span>0{i + 1}</span>
					<p>{point}</p>
					{#if i < proofPoints.length - 1}<i></i>{/if}
				</div>
			{/each}
		</section>

		<section class="principle">
			<div class="principle-icon"><BarChart3 aria-hidden="true" /></div>
			<div>
				<p class="eyebrow">A better training loop</p>
				<h2>Less guessing. More good reps.</h2>
			</div>
			<p>
				Build adaptable programs, see performance in context, and leave each workout knowing exactly what to do next.
			</p>
		</section>
	</main>

	<footer><span>Liftosaurus</span><span>Science-based workout tracking</span></footer>
</div>

<style>
	:global(body:has(.landing-page)) {
		display: block;
		overflow-x: hidden;
		background: #101713;
	}
	.landing-page {
		--ink: #edf3e8;
		--muted: #a6b2a8;
		--lime: #c8f64b;
		min-height: 100dvh;
		color: var(--ink);
		background: radial-gradient(circle at 82% 18%, #293b20 0, transparent 28rem), #101713;
		font-family: Georgia, 'Times New Roman', serif;
	}
	.topline {
		height: 4px;
		background: var(--lime);
	}
	.landing-header,
	.hero,
	.principle,
	footer {
		width: min(1120px, calc(100% - 40px));
		margin: auto;
	}
	.landing-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 86px;
		border-bottom: 1px solid rgba(237, 243, 232, 0.14);
	}
	.wordmark {
		display: flex;
		align-items: center;
		gap: 10px;
		font-family: Inter, sans-serif;
		font-size: 20px;
		font-weight: 750;
		letter-spacing: -0.04em;
	}
	.wordmark :global(svg) {
		color: var(--lime);
		width: 25px;
		height: 25px;
	}
	:global(.signin-button) {
		border: 1px solid rgba(237, 243, 232, 0.28);
		color: var(--ink);
		font-family: Inter, sans-serif;
		padding: 0 18px;
	}
	.hero {
		display: grid;
		grid-template-columns: 1.1fr 0.8fr;
		gap: 8vw;
		align-items: center;
		min-height: 545px;
		padding: 64px 0;
	}
	.eyebrow {
		display: flex;
		align-items: center;
		gap: 7px;
		margin: 0 0 21px;
		color: var(--lime);
		font-family: Inter, sans-serif;
		font-size: 11px;
		font-weight: 750;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}
	.eyebrow :global(svg) {
		width: 15px;
		height: 15px;
	}
	h1,
	h2 {
		margin: 0;
		font-weight: 500;
		letter-spacing: -0.06em;
		line-height: 0.94;
	}
	h1 {
		max-width: 620px;
		font-size: clamp(3.2rem, 7vw, 5.9rem);
	}
	h1 em {
		color: var(--lime);
		font-weight: 400;
	}
	.intro {
		max-width: 495px;
		margin: 28px 0;
		color: var(--muted);
		font-family: Inter, sans-serif;
		font-size: 16px;
		line-height: 1.7;
	}
	.hero-actions {
		display: flex;
		align-items: center;
		gap: 24px;
	}
	:global(.start-button) {
		background: var(--lime);
		color: #192112;
		font-family: Inter, sans-serif;
		font-weight: 750;
	}
	:global(.start-button svg),
	.card-footer :global(svg) {
		width: 16px;
		height: 16px;
	}
	.learn-link {
		color: var(--ink);
		font-family: Inter, sans-serif;
		font-size: 14px;
	}
	.learn-link span {
		color: var(--lime);
		margin-left: 5px;
	}
	.training-card {
		position: relative;
		max-width: 355px;
		justify-self: end;
		padding: 26px;
		border: 1px solid rgba(200, 246, 75, 0.42);
		background: #172019;
		box-shadow: 17px 17px 0 rgba(200, 246, 75, 0.12);
		font-family: Inter, sans-serif;
		transform: rotate(3deg);
	}
	.training-card:before {
		content: '';
		position: absolute;
		inset: 8px;
		border: 1px solid rgba(237, 243, 232, 0.08);
		pointer-events: none;
	}
	.card-header,
	.card-footer,
	.session-title,
	.exercise-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.card-label {
		color: var(--muted);
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.11em;
	}
	.live-pill {
		color: var(--lime);
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.08em;
	}
	.live-pill i {
		display: inline-block;
		width: 6px;
		height: 6px;
		margin-right: 5px;
		border-radius: 50%;
		background: var(--lime);
	}
	.session-title {
		justify-content: flex-start;
		gap: 13px;
		padding: 25px 0;
		border-bottom: 1px solid rgba(237, 243, 232, 0.15);
	}
	.session-mark {
		color: var(--lime);
		font:
			39px Georgia,
			serif;
	}
	.session-title strong,
	.session-title small {
		display: block;
	}
	.session-title strong {
		font-size: 21px;
	}
	.session-title small {
		margin-top: 4px;
		color: var(--muted);
		font-size: 11px;
	}
	.exercise-row {
		padding: 23px 0 13px;
		font-size: 12px;
	}
	.exercise-row b {
		color: var(--lime);
	}
	.progress-line {
		height: 5px;
		background: #314032;
	}
	.progress-line span {
		display: block;
		width: 72%;
		height: 100%;
		background: var(--lime);
	}
	.card-footer {
		padding-top: 18px;
		color: var(--muted);
		font-size: 11px;
	}
	.card-footer strong {
		display: flex;
		gap: 5px;
		align-items: center;
		color: var(--ink);
		font-size: 12px;
	}
	.proof-strip {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		border-top: 1px solid rgba(237, 243, 232, 0.14);
		border-bottom: 1px solid rgba(237, 243, 232, 0.14);
		background: #141c17;
	}
	.proof-strip > div {
		position: relative;
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 24px clamp(20px, 6vw, 100px);
		font-family: Inter, sans-serif;
	}
	.proof-strip span {
		color: var(--lime);
		font-size: 11px;
		font-weight: 750;
	}
	.proof-strip p {
		margin: 0;
		font-size: 14px;
		font-weight: 650;
		white-space: nowrap;
	}
	.proof-strip i {
		position: absolute;
		right: 0;
		height: 28px;
		border-right: 1px solid rgba(237, 243, 232, 0.14);
	}
	.principle {
		display: grid;
		grid-template-columns: 70px 1fr 0.9fr;
		gap: 28px;
		align-items: center;
		padding: 104px 0;
	}
	.principle-icon {
		display: grid;
		width: 54px;
		height: 54px;
		place-items: center;
		background: var(--lime);
		color: #192112;
	}
	.principle-icon :global(svg) {
		width: 28px;
		height: 28px;
	}
	.principle .eyebrow {
		margin-bottom: 14px;
	}
	h2 {
		font-size: clamp(2.25rem, 4vw, 3.7rem);
	}
	.principle > p {
		color: var(--muted);
		font-family: Inter, sans-serif;
		font-size: 15px;
		line-height: 1.7;
	}
	footer {
		display: flex;
		justify-content: space-between;
		padding: 25px 0 35px;
		border-top: 1px solid rgba(237, 243, 232, 0.14);
		color: var(--muted);
		font-family: Inter, sans-serif;
		font-size: 12px;
	}
	footer span:first-child {
		color: var(--ink);
		font-weight: 700;
	}
	@media (max-width: 720px) {
		.landing-header,
		.hero,
		.principle,
		footer {
			width: min(100% - 32px, 1120px);
		}
		.landing-header {
			height: 72px;
		}
		.hero {
			grid-template-columns: 1fr;
			gap: 45px;
			min-height: auto;
			padding: 64px 0 72px;
		}
		.intro {
			font-size: 15px;
		}
		.training-card {
			width: min(88%, 355px);
			justify-self: center;
			transform: rotate(2deg);
		}
		.proof-strip {
			grid-template-columns: 1fr;
		}
		.proof-strip > div {
			justify-content: center;
			padding: 16px;
		}
		.proof-strip i {
			display: none;
		}
		.principle {
			grid-template-columns: 54px 1fr;
			gap: 18px;
			padding: 70px 0;
		}
		.principle > p {
			grid-column: 1 / -1;
		}
		.principle-icon {
			width: 48px;
			height: 48px;
		}
		footer {
			gap: 20px;
			line-height: 1.5;
		}
		.hero-actions {
			flex-wrap: wrap;
			gap: 18px;
		}
	}
</style>
