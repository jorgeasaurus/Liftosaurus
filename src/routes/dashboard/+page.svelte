<script lang="ts">
	import CheckIcon from 'virtual:icons/lucide/circle-check';
	import DotIcon from 'virtual:icons/lucide/circle';
	import PauseIcon from 'virtual:icons/lucide/pause';
	import FlameIcon from 'virtual:icons/lucide/flame';
	import CalendarIcon from 'virtual:icons/lucide/calendar-days';
	import TrophyIcon from 'virtual:icons/lucide/trophy';
	import ChevronDownIcon from 'virtual:icons/lucide/chevron-down';

	const workoutSets = [
		{ set: 1, load: '185', reps: '8', rir: '2', status: 'Completed' },
		{ set: 2, load: '185', reps: '7', rir: '2', status: 'Completed' },
		{ set: 3, load: '185', reps: '–', rir: '2', status: 'Current' },
		{ set: 4, load: '185', reps: '6–8', rir: '2', status: 'Upcoming' }
	] as const;

	const weeklyVolume = [
		{ group: 'Chest', value: 2850 },
		{ group: 'Back', value: 2420 },
		{ group: 'Legs', value: 1950 },
		{ group: 'Shoulders', value: 1680 },
		{ group: 'Arms', value: 1100 },
		{ group: 'Core', value: 250 }
	] as const;

	const progressionPoints = [176, 184, 191, 197, 206, 212] as const;
	const volumePoints = [5800, 6200, 9100, 8600, 10300, 7200] as const;

	const maxVolume = Math.max(...weeklyVolume.map((item) => item.value));
	const maxProgression = Math.max(...progressionPoints);
	const minProgression = Math.min(...progressionPoints);
	const maxProgressChartVolume = Math.max(...volumePoints);

	const pointX = (index: number, total: number) => (index / (total - 1)) * 100;
	const pointY = (value: number) => ((maxProgression - value) / (maxProgression - minProgression || 1)) * 100;
	const volumeY = (value: number) => 100 - (value / maxProgressChartVolume) * 100;

	const progressionPolyline = progressionPoints
		.map((value, index) => `${pointX(index, progressionPoints.length)},${pointY(value)}`)
		.join(' ');
	const volumePolyline = volumePoints
		.map((value, index) => `${pointX(index, volumePoints.length)},${volumeY(value)}`)
		.join(' ');
</script>

<section class="mx-auto flex w-full max-w-[1320px] flex-col gap-5">
	<header class="flex items-center justify-between">
		<h1 class="text-[42px] font-semibold leading-none tracking-[-0.03em] text-[#e9edf3]">Good morning, Alex</h1>
		<div class="flex items-center gap-3">
			<button
				aria-haspopup="listbox"
				class="inline-flex items-center gap-2 rounded-lg border border-[#2b3038] bg-[#12171d] px-4 py-3 text-sm font-medium text-[#d7dde4]"
				type="button"
			>
				Upper Strength
				<ChevronDownIcon class="h-4 w-4 text-[#98a3b2]" />
			</button>
			<button
				class="rounded-lg bg-[#c7f73a] px-7 py-3 text-sm font-semibold text-[#1f2512] transition-colors hover:bg-[#d2f95a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c7f73a]"
				type="button"
			>
				Start workout
			</button>
		</div>
	</header>

	<div class="grid grid-cols-[minmax(0,1fr)_300px] gap-4">
		<div class="rounded-2xl border border-[#242a32] bg-[#11161d] p-5">
			<div class="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
				<div class="space-y-4 border-r border-[#222832] pr-5">
					<div class="space-y-1">
						<p class="text-lg text-[#cfd6df]">Next set: <span class="font-semibold text-[#eef2f7]">Bench Press</span></p>
						<div class="flex items-center gap-3">
							<p class="text-[52px] font-semibold leading-none tracking-[-0.03em] text-[#eef2f7]">185 lb × 6–8</p>
							<span class="rounded-md border border-[#8cae2f66] bg-[#1a2311] px-2.5 py-1 text-sm font-semibold text-[#c7f73a]">RIR 2</span>
						</div>
					</div>

					<div class="overflow-hidden rounded-xl border border-[#262d36]">
						<table class="w-full border-collapse text-sm">
							<thead class="bg-[#141a21] text-[#94a0af]">
								<tr>
									<th class="px-3 py-2 text-left font-medium">Set</th>
									<th class="px-3 py-2 text-left font-medium">Load (lb)</th>
									<th class="px-3 py-2 text-left font-medium">Reps</th>
									<th class="px-3 py-2 text-left font-medium">RIR</th>
									<th class="px-3 py-2 text-left font-medium">Status</th>
								</tr>
							</thead>
							<tbody>
								{#each workoutSets as set}
									<tr class="border-t border-[#222a33] text-[#d3dbe5]">
										<td class="px-3 py-2">{set.set}</td>
										<td class="px-3 py-2"><input aria-label={`Set ${set.set} load`} class="h-9 w-20 rounded-md border border-[#303843] bg-[#111720] px-2 text-[#eaf0f7]" value={set.load} /></td>
										<td class="px-3 py-2"><input aria-label={`Set ${set.set} reps`} class="h-9 w-16 rounded-md border border-[#303843] bg-[#111720] px-2 text-[#eaf0f7]" value={set.reps} /></td>
										<td class="px-3 py-2"><input aria-label={`Set ${set.set} RIR`} class="h-9 w-14 rounded-md border border-[#303843] bg-[#111720] px-2 text-[#eaf0f7]" value={set.rir} /></td>
										<td class="px-3 py-2">
											<span class="inline-flex items-center gap-1.5 text-xs">
												{#if set.status === 'Completed'}
													<CheckIcon class="h-3.5 w-3.5 text-[#9ec43a]" />
												{:else if set.status === 'Current'}
													<DotIcon class="h-3.5 w-3.5 text-[#c7f73a]" />
												{:else}
													<DotIcon class="h-3.5 w-3.5 text-[#596576]" />
												{/if}
												{set.status}
											</span>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>

					<div class="rounded-xl border border-[#2a323b] bg-[#151b23] px-4 py-3">
						<p class="text-xs font-semibold uppercase tracking-[0.1em] text-[#90a0b0]">Progression suggestion</p>
						<p class="mt-1 text-[#dce4ec]">Hit <span class="font-semibold text-[#ecf2fa]">8 reps with RIR 2</span> to increase to <span class="font-semibold text-[#c7f73a]">190 lb</span> next time.</p>
					</div>
				</div>

				<div class="flex flex-col items-center justify-center gap-5">
					<div class="relative h-56 w-56">
						<svg aria-label="Rest timer" class="h-full w-full" viewBox="0 0 120 120">
							<circle cx="60" cy="60" fill="none" r="48" stroke="#2a313a" stroke-width="8" />
							<circle
								cx="60"
								cy="60"
								fill="none"
								r="48"
								stroke="#c7f73a"
								stroke-dasharray="301"
								stroke-dashoffset="90"
								stroke-linecap="round"
								stroke-width="8"
								transform="rotate(-90 60 60)"
							/>
						</svg>
						<div class="absolute inset-0 flex flex-col items-center justify-center">
							<p class="text-xs uppercase tracking-[0.12em] text-[#8f9cad]">Rest timer</p>
							<p class="text-5xl font-semibold tracking-[-0.03em] text-[#c7f73a]">1:24</p>
							<p class="text-lg text-[#9aa6b5]">/ 2:00</p>
						</div>
					</div>
					<button class="inline-flex items-center gap-2 rounded-lg border border-[#303743] bg-[#121821] px-4 py-2 text-[#dbe3ec]" type="button">
						<PauseIcon class="h-4 w-4" />
						Pause
					</button>
				</div>
			</div>
		</div>

		<aside class="space-y-4">
			<div class="rounded-2xl border border-[#252c35] bg-[#11161d] p-4">
				<div class="flex items-center justify-between">
					<p class="text-[34px] font-semibold leading-none text-[#c7f73a]">12</p>
					<FlameIcon class="h-5 w-5 text-[#c7f73a]" />
				</div>
				<p class="text-sm text-[#cfd6df]">day streak</p>
				<div class="mt-3 flex justify-between text-[11px] text-[#92a0b0]">
					{#each ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as day, index}
						<div class="flex flex-col items-center gap-1">
							<span>{day}</span>
							<span class={`h-2.5 w-2.5 rounded-full ${index < 6 ? 'bg-[#c7f73a]' : 'bg-[#3a424f]'}`}></span>
						</div>
					{/each}
				</div>
			</div>

			<div class="rounded-2xl border border-[#252c35] bg-[#11161d] p-4">
				<div class="mb-2 flex items-center justify-between text-[#9eabbb]">
					<p class="text-sm">Next workout</p>
					<CalendarIcon class="h-4 w-4" />
				</div>
				<p class="text-lg font-semibold text-[#e6ebf2]">Lower Strength</p>
				<p class="text-sm text-[#9eabbb]">Sat, May 24 · 10:00 AM</p>
				<button class="mt-3 w-full rounded-lg border border-[#313945] bg-[#141b23] py-2 text-sm text-[#dbe3ec]" type="button">View plan</button>
			</div>

			<div class="rounded-2xl border border-[#252c35] bg-[#11161d] p-4">
				<div class="mb-2 flex items-center justify-between">
					<p class="text-sm font-semibold text-[#b8a8ff]">New PR</p>
					<TrophyIcon class="h-4 w-4 text-[#b8a8ff]" />
				</div>
				<p class="text-sm text-[#a3afbe]">Bench Press</p>
				<p class="text-[33px] font-semibold leading-none tracking-[-0.02em] text-[#edf2f8]">185 lb × 8</p>
				<p class="mt-1 text-sm text-[#8f9ead]">May 20, 2025</p>
			</div>
		</aside>
	</div>

	<div class="grid grid-cols-2 gap-4">
		<section class="rounded-2xl border border-[#252c34] bg-[#11161d] p-4">
			<div class="mb-4 flex items-center justify-between">
				<div>
					<h2 class="text-xl font-semibold text-[#eaf0f7]">Weekly volume</h2>
					<p class="text-sm text-[#98a6b6]">Total <span class="font-semibold text-[#dff1a2]">14,250 lb</span></p>
				</div>
				<button class="rounded-lg border border-[#2c333d] bg-[#131a22] px-3 py-1.5 text-sm text-[#cfd7e1]" type="button">This week</button>
			</div>
			<div class="flex h-52 items-end justify-between gap-3">
				{#each weeklyVolume as item}
					<div class="flex flex-1 flex-col items-center gap-2">
						<div class="relative h-40 w-full overflow-hidden rounded-md border border-[#2a313a] bg-[#151b23]">
							<div
								class="absolute inset-x-0 bottom-0 rounded-sm bg-[#c7f73a]"
								style={`height: ${(item.value / maxVolume) * 100}%`}
							></div>
						</div>
						<div class="text-center">
							<p class="text-xs text-[#a8b4c2]">{item.value.toLocaleString()}</p>
							<p class="text-xs text-[#8f9dae]">{item.group}</p>
						</div>
					</div>
				{/each}
			</div>
		</section>

		<section class="rounded-2xl border border-[#252c34] bg-[#11161d] p-4">
			<div class="mb-3 flex items-center justify-between">
				<div>
					<h2 class="text-xl font-semibold text-[#eaf0f7]">Progression</h2>
					<p class="text-sm text-[#98a6b6]">Estimated 1RM <span class="font-semibold text-[#dff1a2]">205 lb</span></p>
				</div>
				<button class="rounded-lg border border-[#2c333d] bg-[#131a22] px-3 py-1.5 text-sm text-[#cfd7e1]" type="button">Bench Press</button>
			</div>
			<div class="relative h-52 rounded-lg border border-[#2a323b] bg-[#151b23] p-3">
				<div class="absolute inset-x-3 inset-y-3 grid grid-rows-5 border-l border-b border-[#2d3642]">
					{#each Array(4) as _}
						<div class="border-t border-[#222a34]"></div>
					{/each}
				</div>
				<svg class="absolute inset-3" viewBox="0 0 100 100" preserveAspectRatio="none">
					<polyline fill="none" points={progressionPolyline} stroke="#c7f73a" stroke-width="1.4" />
					<polyline fill="none" points={volumePolyline} stroke="#7f83e8" stroke-width="1.2" />
					{#each progressionPoints as value, index}
						<circle cx={pointX(index, progressionPoints.length)} cy={pointY(value)} fill="#c7f73a" r="1.2" />
					{/each}
					{#each volumePoints as value, index}
						<circle cx={pointX(index, volumePoints.length)} cy={volumeY(value)} fill="#8d92ff" r="1.1" />
					{/each}
				</svg>
				<div class="absolute right-3 top-3 flex gap-4 text-xs text-[#a2aebe]">
					<span class="inline-flex items-center gap-1"><span class="h-2 w-2 rounded-full bg-[#c7f73a]"></span>Estimated 1RM</span>
					<span class="inline-flex items-center gap-1"><span class="h-2 w-2 rounded-full bg-[#7f83e8]"></span>Volume (lb)</span>
				</div>
				<div class="absolute bottom-2 left-3 right-3 flex justify-between text-[11px] text-[#8190a2]">
					<span>Apr 20</span>
					<span>Apr 27</span>
					<span>May 4</span>
					<span>May 11</span>
					<span>May 18</span>
				</div>
			</div>
		</section>
	</div>
</section>
