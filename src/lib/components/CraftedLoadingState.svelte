<script lang="ts">
	type Props = {
		label?: string;
		compact?: boolean;
	};

	let { label = 'Loading', compact = false }: Props = $props();
</script>

<div class:compact class="crafted-loader" aria-live="polite" aria-atomic="true">
	<span aria-hidden="true" class="pixel-grid">
		{#each Array(9) as _, index}
			<span style={`--pixel-index: ${index}`}></span>
		{/each}
	</span>
	<span class="shimmer-label">{label}</span>
</div>

<style>
	.crafted-loader {
		display: flex;
		min-height: 8rem;
		align-items: center;
		justify-content: center;
		gap: 0.625rem;
		color: hsl(var(--muted-foreground));
		font-size: 0.8125rem;
		font-weight: 500;
	}

	.crafted-loader.compact {
		min-height: auto;
		padding-block: 0.5rem;
	}

	.pixel-grid {
		display: grid;
		grid-template-columns: repeat(3, 0.25rem);
		gap: 0.125rem;
	}

	.pixel-grid span {
		width: 0.25rem;
		height: 0.25rem;
		border-radius: 1px;
		background: hsl(var(--primary));
		opacity: 0.18;
		animation: pixel-pulse 720ms ease-in-out infinite;
		animation-delay: calc(var(--pixel-index) * 55ms);
	}

	.shimmer-label {
		background: linear-gradient(
			90deg,
			hsl(var(--muted-foreground)) 25%,
			hsl(var(--foreground)) 50%,
			hsl(var(--muted-foreground)) 75%
		);
		background-size: 200% 100%;
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
		color: transparent;
		animation: label-shimmer 1.5s linear infinite;
	}

	@keyframes pixel-pulse {
		0%,
		100% {
			opacity: 0.18;
			transform: scale(0.86);
		}
		50% {
			opacity: 0.95;
			transform: scale(1);
		}
	}

	@keyframes label-shimmer {
		from {
			background-position: 100% 0;
		}
		to {
			background-position: -100% 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.pixel-grid span,
		.shimmer-label {
			animation: none;
		}

		.pixel-grid span:nth-child(5) {
			opacity: 0.95;
		}
	}
</style>
